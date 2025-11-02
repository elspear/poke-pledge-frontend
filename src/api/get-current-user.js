async function getCurrentUserByUsername(username) {
  if (!username) return null;

  const token = window.localStorage.getItem("token");
  const base = import.meta.env.VITE_API_URL;

  // Helper to perform a GET with auth header
  const doGet = async (url) => {
    const response = await fetch(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        ...(token && { Authorization: token.startsWith('Token') ? token : `Token ${token}` }),
      },
    });

    if (!response.ok) {
      // Try to get text of the response for better debugging (may be HTML or JSON)
      const responseText = await response.text().catch(() => null);
      let data = null;
      try {
        data = responseText ? JSON.parse(responseText) : null;
      } catch {
        // not JSON, keep raw text
      }

      // Log full body to console to help debugging server-side 500s
      console.error(`GET ${url} returned ${response.status}`, responseText || data || response.statusText);

      const err = new Error(`Failed to fetch from ${url}`);
      err.response = { status: response.status, data };
      err.responseText = responseText;
      throw err;
    }

    return await response.json();
  };

  // 1) Fetch the users list and try to find by username
  try {
    const usersUrl = `${base}/users/`;
    const usersData = await doGet(usersUrl);

    let foundUser = null;
    if (Array.isArray(usersData)) {
      foundUser = usersData.find((u) => u.username === username) || null;
    } else if (usersData && usersData.username === username) {
      foundUser = usersData;
    } else if (usersData && Array.isArray(usersData.results)) {
      // support paginated responses
      foundUser = usersData.results.find((u) => u.username === username) || null;
    }

    if (foundUser) {
      // Attempt to fetch the profile using your urls.py pattern: /users/profiles/<user_id>/
        try {
        const profileUrl = `${base}/users/profiles/public/${foundUser.id}/`;
        const profile = await doGet(profileUrl);
        if (profile) {
          // Attach profile under `profile` key for frontend use
          foundUser.profile = profile;
        }
      } catch {
        // If profile fetch fails, keep the user object as-is
        // console.debug('Profile fetch failed');
      }      return foundUser;
    }
  } catch {
    // ignore and fall back
  }

  // Fallback: return minimal user object so UI logic continues to work
  return { username };
}

export default getCurrentUserByUsername;
