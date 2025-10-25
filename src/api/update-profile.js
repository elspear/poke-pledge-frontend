async function updateProfile(userId, token, profileData) {
    const base = import.meta.env.VITE_API_URL;
    
    const response = await fetch(`${base}/users/profiles/${userId}/`, {
        method: 'PATCH',
        headers: {
            "Content-Type": "application/json",
            "Authorization": token
        },
        body: JSON.stringify(profileData)
    });

    if (!response.ok) {
        const text = await response.text();
        let data;
        try {
            data = JSON.parse(text);
        } catch {
            data = text;
        }
        console.error(`Profile update failed: ${response.status}`, data);
        throw new Error(response.status === 404 ? "Profile not found" : "Failed to update profile");
    }

    return await response.json();
}

export default updateProfile;