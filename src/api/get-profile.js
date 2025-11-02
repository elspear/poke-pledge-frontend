async function getProfile(identifier, token) {
    if (!identifier) {
        throw new Error("Profile identifier required");
    }

    const base = import.meta.env.VITE_API_URL;
    
    // Choose endpoint based on authentication status
    const url = token 
        ? `${base}/users/profiles/${identifier}/`
        : `${base}/users/profiles/public/${identifier}/`;

    const headers = token ? {
        'Authorization': token.startsWith('Token') ? token : `Token ${token}`
    } : {};

    const response = await fetch(url, { 
        method: "GET",
        headers 
    });

    if (!response.ok) {
        const fallbackError = `Error fetching profile ${identifier}`;
        const data = await response.json().catch(() => {
            throw new Error(fallbackError);
        });
        const errorMessage = data?.detail ?? fallbackError;
        throw new Error(errorMessage);
    }

    return await response.json();
}

export default getProfile;