import { useParams } from 'react-router-dom';
import useProfile from '../hooks/use-profile';
import ProfileCard from '../components/ProfileCard';
import './ProfilePage.css';

function ProfilePage() {
    const { id } = useParams();
    const { profile, isLoading, error } = useProfile(id);

    if (isLoading) return <div>Loading...</div>;
    if (error) return <div>Error: {error}</div>;
    if (!profile) return <div>Profile not found</div>;

    return (
        <div className="profile-page">
            <ProfileCard profile={profile} />
        </div>
    );
}

export default ProfilePage;
