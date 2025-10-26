async function updateProfile(userId, profileData) {
    if (!userId) {
        throw new Error("User ID is required to update profile");
    }

    const base = import.meta.env.VITE_API_URL;
    const token = window.localStorage.getItem("token");
    
    const response = await fetch(`${base}/users/profiles/${userId}/`, {
        method: 'PATCH',
        headers: {
            "Content-Type": "application/json",
            "Authorization": token.startsWith('Token') ? token : `Token ${token}`
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

        // Enhanced error handling with specific messages
        let errorMessage;
        switch (response.status) {
            case 401:
                errorMessage = "You must be logged in to update your profile";
                break;
            case 403:
                errorMessage = "You don't have permission to update this profile";
                break;
            case 404:
                errorMessage = "Profile not found";
                break;
            case 400:
                // Handle validation errors from the backend
                if (data && typeof data === 'object') {
                    const errors = Object.entries(data)
                        .map(([field, msgs]) => `${field}: ${Array.isArray(msgs) ? msgs.join(', ') : msgs}`)
                        .join('; ');
                    errorMessage = `Invalid profile data: ${errors}`;
                } else {
                    errorMessage = "Invalid profile data provided";
                }
                break;
            default:
                errorMessage = "Failed to update profile";
        }

        const error = new Error(errorMessage);
        error.status = response.status;
        error.data = data;
        console.error(`Profile update failed: ${response.status}`, data);
        throw error;
    }

    return await response.json();
}

export default updateProfile;