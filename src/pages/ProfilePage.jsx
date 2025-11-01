import { useParams } from 'react-router-dom';
import useProfile from '../hooks/use-profile';
import ProfileCard from '../components/ProfileCard';
import { useAuth } from '../hooks/use-auth';
import './ProfilePage.css';

function ProfilePage() {
    const { id } = useParams();
    const { profile, isLoading, error, updateProfileData } = useProfile(id);
    const { auth } = useAuth();

    // Check if this is the logged-in user's profile
    const isOwnProfile = auth?.user && (
        !id || // No ID in URL means viewing own profile
        auth.user.id === profile?.user?.id ||
        auth.user.username === id
    );

    const handleProfileUpdate = async (updateData) => {
        if (!isOwnProfile) {
            throw new Error("You can only edit your own profile");
        }

        try {
            console.log('Profile data in handleProfileUpdate:', profile);
            const userId = profile?.user?.id || id;
            if (!userId) {
                throw new Error("User ID not found");
            }
            console.log('Using userId for update:', userId);
            const result = await updateProfileData(updateData, userId);
            return result;
        } catch (error) {
            console.error('Failed to update profile:', error);
            throw error;
        }
    };

    if (isLoading) return <div className="profile-loading">Loading...</div>;
    if (error) return <div className="profile-error">Error: {error}</div>;
    if (!profile) return <div className="profile-error">Profile not found</div>;

    return (
        <div className="profile-page">
            <ProfileCard 
                profile={profile} 
                onUpdate={handleProfileUpdate}
            />
        </div>
    );
}

export default ProfilePage;
