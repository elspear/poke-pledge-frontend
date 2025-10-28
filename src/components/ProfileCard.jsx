import './ProfileCard.css';
import { useState } from 'react';
import { useAuth } from '../hooks/use-auth';
import AvatarPicker from './AvatarPicker';
import { getAvatarById, getAvatarByRole } from '../utils/AvatarUtils';

const formatRole = (role) => {
  if (!role) return '';
  // Split by underscore, capitalize each word, then join with space
  return role
    .split('_')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(' ');
};

function ProfileCard({ profile, onUpdate }) {
  const { auth } = useAuth();
  const isOwnProfile = auth.user && auth.user.id === profile.user?.id;
  
  console.log('Full profile data in ProfileCard:', profile);
  console.log('Profile structure:', {
    hasAvatar: 'avatar' in profile,
    avatarValue: profile.avatar,
    userInfo: profile.user,
    resolvedAvatar: profile.avatar ? getAvatarById(profile.avatar) : 'no avatar'
  });
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState({
    bio: profile.bio || '',
    avatar: profile.avatar || '',
    location: profile.location || '',
    showAvatarPicker: false
  });

  const handleSave = async () => {
    try {
        // Only send the fields that the backend expects
        const updateData = {
            bio: editData.bio,
            avatar: editData.avatar,
            location: editData.location
        };
        console.log('Saving profile data:', updateData);
        await onUpdate(updateData);
        setIsEditing(false);
    } catch (error) {
        // note - add error handling
        console.error('Failed to update profile:', error);
    }
}

  if (!profile) return null;

  return (
    <div className="card-container">
      {isOwnProfile && !isEditing && (
        <button 
            onClick={() => setIsEditing(true)}
            className="edit-button"
        >
            Edit Profile
        </button>
    )}
      <div className="profile-header">
        <div className="avatar-container">
          {(() => {
            // Determine the avatar source outside of the JSX
            let avatarSrc;
            if (profile.avatar && profile.avatar.trim()) {
              const avatarObj = getAvatarById(profile.avatar);
              avatarSrc = avatarObj?.src;
            } else if (profile.user?.role) {
              const roleAvatar = getAvatarByRole(profile.user.role);
              const avatarObj = roleAvatar ? getAvatarById(roleAvatar) : null;
              avatarSrc = avatarObj?.src;
            }
            
            // If no avatar was resolved, use ditto as default
            if (!avatarSrc) {
              const defaultAvatar = getAvatarById('ditto');
              avatarSrc = defaultAvatar?.src;
            }

            console.log('Avatar resolution:', {
              profileAvatar: profile.avatar,
              userRole: profile.user?.role,
              resolvedSrc: avatarSrc
            });

            return (
              <img
                src={avatarSrc}
                alt={profile.user?.username ? `${profile.user.username}'s avatar` : 'Default avatar'}
                className="profile-avatar"
                onError={(e) => {
                  console.error('Avatar failed to load:', {
                    profileAvatar: profile.avatar,
                    userRole: profile.user?.role,
                    attemptedSrc: e.target.src
                  });
                  const defaultAvatar = getAvatarById('ditto');
                  if (e.target.src !== defaultAvatar?.src) {
                    e.target.src = defaultAvatar?.src;
                  }
                }}
              />
            );
          })()}
          {isEditing && isOwnProfile && (
            <button 
              className="avatar-edit-icon"
              onClick={() => setEditData(prev => ({ ...prev, showAvatarPicker: true }))}
              title="Change avatar"
            >
              ✎
            </button>
          )}
          {isEditing && editData.showAvatarPicker && (
            <AvatarPicker
              selected={editData.avatar}
              onSelect={(avatarId) => 
                setEditData(prev => ({
                  ...prev, 
                  avatar: avatarId,
                  showAvatarPicker: false
                }))
              }
            />
          )}
        </div>
        <div className="profile-info">
          <h2>{profile.username}</h2>
          <p className="role">{formatRole(profile.user.role)}</p>
          <p className="location">Location: {profile.location || 'No location set'}</p>
        </div>
      </div>
      <div className="profile-body">
        <div className="bio-section">
          <h3>About</h3>
          {isEditing ? (
              <div>
                  <div className="edit-field">
                      <label htmlFor="location">Location</label>
                      <input
                          type="text"
                          id="location"
                          value={editData.location}
                          onChange={(e) => setEditData(prev => ({
                              ...prev,
                              location: e.target.value
                          }))}
                          placeholder="Enter your location"
                          className="location-input"
                      />
                  </div>
                  <div className="edit-field">
                      <label htmlFor="bio">Bio</label>
                      <textarea
                          id="bio"
                          value={editData.bio}
                          onChange={(e) => setEditData(prev => ({
                              ...prev,
                              bio: e.target.value
                          }))}
                          placeholder="Write your bio..."
                          className="bio-textarea"
                      />
                  </div>
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