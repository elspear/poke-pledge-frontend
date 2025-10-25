import { useState, useEffect } from 'react';
import { useAuth } from './use-auth';

function useProfile(profileId) {
    // State variables to: manage profile data, loading state & errors
    const [profile, setProfile] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const { auth } = useAuth();

    useEffect(() => {
        async function fetchProfile() {
            try {
                // if no profileId or it matches current user, use auth data
                if (!profileId || profileId === auth.user.id) {
                    const response = await fetch(`/users/profiles/${auth.user.id}`);
                    if (!response.ok) {
                        throw new Error("Failed to fetch profile");
                    }
                    const data = await response.json();
                    setProfile(data);
                } else {
                    // fetch other users profiles
                    const response = await fetch(`/users/profiles/${profileId}`);
                    if (!response.ok) {
                        throw new Error("Profile not found");
                    }
                    const data = await response.json();
                    setProfile(data);
                }
            } catch (err) {
                setError(err.message);
            } finally {
                setIsLoading(false);
            }
        }

        fetchProfile();
    }, [profileId, auth.user]);

    return { profile, isLoading, error};
}

export default useProfile;