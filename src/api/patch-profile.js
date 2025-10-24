async function patchProfile(profileId, patchData) {
  if (!profileId) {
    const err = new Error("Missing profile id for patch");
    throw err;
  }

  const token = window.localStorage.getItem("token");
  const base = import.meta.env.VITE_API_URL;
  const url = `${base}/users/profiles/${profileId}/`;

  const response = await fetch(url, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      ...(token && { Authorization: token }),
    },
    body: JSON.stringify(patchData),
  });

  if (!response.ok) {
    const responseText = await response.text().catch(() => null);
    let data = null;
    try {
      data = responseText ? JSON.parse(responseText) : null;
    } catch (e) {
      // ignore
    }
    const err = new Error(data?.detail || responseText || `Failed to patch profile: ${response.status}`);
    err.response = { status: response.status, data };
    throw err;
  }

  return await response.json();
}

export default patchProfile;
