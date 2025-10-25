import { useState, useEffect } from 'react';
import { useAuth } from './use-auth';

function useProfile(profileId) {
    const [profile, setProfile] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const { auth } = useAuth();

    useEffect(() => {
        async function fetchProfile() {
            try {
                // Safety check for auth
                if (!auth?.token) {
                    throw new Error("Not authenticated");
                }

                const base = import.meta.env.VITE_API_URL;
                const userId = profileId || auth.user.id;
                
                const response = await fetch(`${base}/users/profiles/${userId}/`, {
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": auth.token
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

                const data = await response.json();
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

    return { profile, isLoading, error };
}

export default useProfile;