import { useState, useEffect } from 'react';
import { useAuth } from './use-auth';
import getProfile from '../api/get-profile';
import updateProfile from '../api/update-profile';

function useProfile(identifier) {
    const [profile, setProfile] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const { auth } = useAuth();

    useEffect(() => {
        async function fetchProfile() {
            try {
                // Don't require auth token for public profile views
                const token = auth?.token;
                console.log('Profile fetch:', { identifier, token });

                // For /profile/ route (no identifier), require auth
                if (!identifier && !token) {
                    throw new Error("Authentication required to view your profile");
                }

                const id = identifier || auth?.user?.id;
                if (!id) {
                    throw new Error("Profile identifier required");
                }

                const data = await getProfile(id, token);
                setProfile(data);
            } catch (err) {
                console.error('Profile fetch error:', err);
                setError(err.message);
            } finally {
                setIsLoading(false);
            }
        }

        fetchProfile();
    }, [identifier, auth]);

    // Add function to update profile
    const updateProfileData = async (profileData, userId) => {
        try {
            setIsLoading(true);
            setError(null);
            
            if (!auth?.token) {
                throw new Error("Not authenticated");
            }

            // Use the explicitly passed userId, fall back to identifier or auth.user.id
            const id = userId || identifier || auth.user.id;
            const updatedProfile = await updateProfile(id, profileData);
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
        updateProfileData
    };
}

export default useProfile;