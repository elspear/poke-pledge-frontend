const getProfile = async (identifier, token) => {
    const base = import.meta.env.VITE_API_URL;

    // Set up headers based on whether we have a token
    const headers = {
        "Content-Type": "application/json",
    };
    
    if (token) {
        headers.Authorization = token.startsWith('Token') ? token : `Token ${token}`;
    }

    console.log('Profile fetch request:', { identifier, hasToken: !!token });

    try {
        // If no identifier is provided, use current user's profile
        if (!identifier) {
            if (!token) {
                throw new Error("Authentication required to view your own profile");
            }
            throw new Error("Profile identifier required");
        }

        // Always fetch from the profiles endpoint using the identifier
        const response = await fetch(`${base}/users/profiles/${identifier}/`, { 
            headers 
        });

        if (!response.ok) {
            throw new Error("Failed to fetch profile");
        }

        return await response.json();

    } catch (error) {
        console.error('Error fetching profile:', error);
        throw error;
    }
};

export default getProfile;