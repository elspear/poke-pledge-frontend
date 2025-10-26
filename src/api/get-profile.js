async function getProfile(identifier, token) {
    const base = import.meta.env.VITE_API_URL;
    
    // Helper function for making authenticated requests
    const fetchWithAuth = async (url) => {
        console.log('Using token:', token); // Debug log
        const response = await fetch(url, {
            headers: {
                "Content-Type": "application/json",
                "Authorization": token.startsWith('Token') ? token : `Token ${token}`
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
            console.error(`Request failed: ${response.status}`, data);
            throw new Error(response.status === 404 ? "Profile not found" : "Failed to fetch profile");
        }

        return await response.json();
    };

    // If identifier is a number, treat it as an ID
    if (!isNaN(identifier)) {
        const url = `${base}/users/profiles/${identifier}/`;
        return await fetchWithAuth(url);
    }

    // If identifier is a string, treat it as a username
    try {
        // First get users list to find the ID
        const users = await fetchWithAuth(`${base}/users/`);
        const user = users.find(u => u.username.toLowerCase() === identifier.toLowerCase());
        
        if (!user) {
            throw new Error("User not found");
        }

        // Then get the profile using the ID
        const url = `${base}/users/profiles/${user.id}/`;
        return await fetchWithAuth(url);
    } catch (error) {
        console.error('Error fetching profile:', error);
        throw error;
    }
}

export default getProfile;