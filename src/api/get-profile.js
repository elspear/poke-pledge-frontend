async function getProfile(userId, token) {
    const base = import.meta.env.VITE_API_URL;
    
    const response = await fetch(`${base}/users/profiles/${userId}/`, {
        headers: {
            "Content-Type": "application/json",
            "Authorization": token
        }
    });

    if (!response.ok) {
        const text = await response.text();
        let data;
        try {
            data = JSON.parse(text);
        } catch {
            data = text;
        }
        console.error(`Profile fetch failed: ${response.status}`, data);
        throw new Error(response.status === 404 ? "Profile not found" : "Failed to fetch profile");
    }

    return await response.json();
}

export default getProfile;