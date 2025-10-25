import './ProfileCard.css';

function ProfileCard({ profile }) {
    if (!profile) return null;

    return (
        <div className="profile-card">
            <div className="profile-header">
                <div className="profile-avatar">
                    <img 
                        src={profile.avatar || '/default-avatar.png'} 
                        alt={`${profile.username}'s avatar`}
                    />
                </div>
                <div className="profile-info">
                    <h2>{profile.username}</h2>
                    <p className="role">{profile.user.role}</p>
                </div>
            </div>
            <div className="profile-body">
                <div className="bio-section">
                    <h3>Bio</h3>
                    <p>{profile.bio || 'No bio yet'}</p>
                </div>
            </div>
        </div>
    );
}

export default ProfileCard;