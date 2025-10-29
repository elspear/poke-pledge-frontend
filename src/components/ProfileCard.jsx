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
    username: profile.username,
    nestedUsername: profile.user?.username,
    resolvedAvatar: profile.avatar ? getAvatarById(profile.avatar) : 'no avatar'
  });
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState({
    bio: profile.bio || '',
    avatar: profile.avatar?.includes('/') ? profile.avatar.split('/').pop().replace('.svg', '') : profile.avatar || '',
    location: profile.location || '',
    showAvatarPicker: false
  });

  const handleSave = async () => {
    try {
        // Ensure we're sending just the avatar ID
        const avatarId = editData.avatar?.includes('/') 
          ? editData.avatar.split('/').pop().replace('.svg', '')
          : editData.avatar;
        
        console.log('Saving avatar:', {
          originalValue: editData.avatar,
          processedId: avatarId
        });

        // Only send the fields that the backend expects
        const updateData = {
            bio: editData.bio,
            avatar: avatarId,
            location: editData.location
        };
        console.log('Saving profile data:', updateData);
        const updatedProfile = await onUpdate(updateData);
        console.log('Profile after update:', updatedProfile);
        
        // Make sure the local state reflects the server state
        setEditData(prev => ({
            ...prev,
            bio: updatedProfile.bio || '',
            avatar: updatedProfile.avatar || '',
            location: updatedProfile.location || '',
            showAvatarPicker: false
        }));
        
        setIsEditing(false);
    } catch (error) {
        console.error('Failed to update profile:', error);
        alert('Failed to update profile. Please try again.');
    }
  }

  if (!profile) return null;

  return (
    <div className="profile-card">
      <div className="profile-header">
        {isOwnProfile && !isEditing && (
          <button 
            onClick={() => setIsEditing(true)}
            className="edit-button"
          >
            Edit
          </button>
        )}
        <div className="avatar-container">
          {(() => {
            let avatarSrc;
            if (profile.avatar && profile.avatar.trim()) {
              const avatarObj = getAvatarById(profile.avatar);
              avatarSrc = avatarObj?.src;
            } else if (profile.user?.role) {
              const roleAvatar = getAvatarByRole(profile.user.role);
              const avatarObj = roleAvatar ? getAvatarById(roleAvatar) : null;
              avatarSrc = avatarObj?.src;
            }
            
            if (!avatarSrc) {
              const defaultAvatar = getAvatarById('ditto');
              avatarSrc = defaultAvatar?.src;
            }

            return (
              <img
                src={avatarSrc}
                alt={profile.user?.username ? `${profile.user.username}'s avatar` : 'Default avatar'}
                className="profile-avatar"
                onError={(e) => {
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
              onSelect={(avatarId) => {
                console.log('Selected avatar ID:', avatarId);
                setEditData(prev => ({
                  ...prev, 
                  avatar: avatarId,
                  showAvatarPicker: false
                }));
              }}
            />
          )}
        </div>
      </div>
      <div className="lower-container">
        <div className="user-info">
          {console.log('Rendering user info:', {
            username: profile.username,
            role: profile.user?.role,
            location: profile.location
          })}
          <h3 className="username">{profile.username}</h3>
          <h4 className="role">{formatRole(profile.user?.role)}</h4>
          {isEditing ? (
            <div>
            <input
              type="text"
              value={editData.location}
              onChange={(e) => setEditData(prev => ({
                ...prev,
                location: e.target.value
              }))}
              placeholder="Enter your location"
              className="location-input"
            />
            </div>
          ) : (
            profile.location && <p className="location">{profile.location}</p>
          )}
        </div>
        {isEditing ? (
          <div>
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
          <div className="bio-section">
            <p>{profile.bio || 'No bio yet'}</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default ProfileCard;