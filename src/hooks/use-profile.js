import { useState, useEffect } from 'react';
import { useAuth } from './use-auth';
import getProfile from '../api/get-profile';
import updateProfile from '../api/update-profile';

function useProfile(profileId) {
    const [profile, setProfile] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const { auth } = useAuth();

    useEffect(() => {
        async function fetchProfile() {
            try {
                if (!auth?.token) {
                    throw new Error("Not authenticated");
                }

                const userId = profileId || auth.user.id;
                const data = await getProfile(userId, auth.token);
                setProfile(data);
            } catch (err) {
                setError(err.message);
            } finally {
                setIsLoading(false);
            }
        }

        if (auth?.token) {
            fetchProfile();
        }
    }, [profileId, auth]);

    // Add function to update profile
    const updateProfileData = async (profileData) => {
        try {
            setIsLoading(true);
            setError(null);
            
            if (!auth?.token) {
                throw new Error("Not authenticated");
            }

            const userId = profileId || auth.user.id;
            const updatedProfile = await updateProfile(userId, auth.token, profileData);
            setProfile(updatedProfile);
            return updatedProfile;
        } catch (err) {
            setError(err.message);
            throw err;
        } finally {
            setIsLoading(false);
        }
    };

    return { 
        profile, 
        isLoading, 
        error,
        updateProfileData  // Include the update function in the return
    };
}

export default useProfile;