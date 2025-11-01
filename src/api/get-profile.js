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
            const response = await fetch(`${base}/users/profiles/me/`, { headers });
            if (!response.ok) {
                throw new Error("Failed to fetch profile");
            }
            return await response.json();
        }

        // If identifier is a number, we need to look up the username first
        if (!isNaN(identifier)) {
            const usersResponse = await fetch(`${base}/users/`, { headers });
            if (!usersResponse.ok) {
                throw new Error("Failed to fetch users");
            }

            const users = await usersResponse.json();
            const user = users.find(u => u.id === parseInt(identifier));

            if (!user) {
                throw new Error("User not found");
            }

            // Return user data directly
            return {
                user: user,
                username: user.username,
                // Add any other fields that might be needed
                bio: '',  // These fields will only be available when logged in
                location: '',
                avatar: null
            };
        }

        // If it's a username, try to get the user's ID first
        console.log('Looking up user by username:', identifier);
        const usersResponse = await fetch(`${base}/users/`, { headers });
        if (!usersResponse.ok) {
            throw new Error("Failed to fetch users");
        }

        const users = await usersResponse.json();
        const user = users.find(u => u.username.toLowerCase() === identifier.toLowerCase());

        if (!user) {
            throw new Error("User not found");
        }

        // Return user data directly since that's publicly accessible
        console.log('Found user:', user);
        return {
            user: user,
            username: user.username,
            // Add any other fields that might be needed
            // These will match the shape expected by ProfileCard
            bio: '',  // These fields will only be available when logged in
            location: '',
            avatar: null
        };

    } catch (error) {
        console.error('Error fetching profile:', error);
        throw error;
    }
};

export default getProfile;