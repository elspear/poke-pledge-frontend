import { useParams } from 'react-router-dom';
import useProfile from '../hooks/use-profile';
import ProfileCard from '../components/ProfileCard';
import './ProfilePage.css';

function ProfilePage() {
    const { id } = useParams();
    const { profile, isLoading, error, updateProfileData } = useProfile(id);

    const handleProfileUpdate = async (updateData) => {
        try {
            await updateProfileData(updateData);
        } catch (error) {
            console.error('Failed to update profile:', error);
            // will add better error handling later
        }
    };

    if (isLoading) return <div>Loading...</div>;
    if (error) return <div>Error: {error}</div>;
    if (!profile) return <div>Profile not found</div>;

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
