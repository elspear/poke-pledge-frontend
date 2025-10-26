import './ProfileCard.css';
import { useState } from 'react';
import { useAuth } from '../hooks/use-auth';

function ProfileCard({ profile, onUpdate }) {
  const { auth } = useAuth();
  const isOwnProfile = auth.user && auth.user.id === profile.user.id;
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState({
    bio: profile.bio || '',
    avatar: profile.avatar || ''
  });

  const handleSave = async () => {
    try {
        await onUpdate(editData);
        setIsEditing(false);
    } catch (error) {
        // note - add error handling
        console.error('Failed to update profile:', error);
    }
}

  if (!profile) return null;

  return (
    <div className="profile-card">
      {isOwnProfile && !isEditing && (
        <button 
            onClick={() => setIsEditing(true)}
            className="edit-button"
        >
            Edit Profile
        </button>
    )}
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
          {isEditing ? (
              <div>
                  <textarea
                      value={editData.bio}
                      onChange={(e) => setEditData(prev => ({
                          ...prev,
                          bio: e.target.value
                      }))}
                      placeholder="Write your bio..."
                      className="bio-textarea"
                  />
                  <div className="edit-actions">
                      <button 
                          type="button" 
                          onClick={() => setIsEditing(false)}
                      >
                          Cancel
                      </button>
                      <button 
                          type="button" 
                          onClick={handleSave}
                      >
                          Save
                      </button>
                  </div>
              </div>
          ) : (
              <p>{profile.bio || 'No bio yet'}</p>
          )}
        </div>
      </div>
    </div>
  );
}

export default ProfileCard;