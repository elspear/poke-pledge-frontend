import './ProfileCard.css';
import { useState } from 'react';
import AvatarPicker from './AvatarPicker';
import { getAvatarById, getAvatarByRole } from '../utils/AvatarUtils';
import { useAuth } from '../hooks/use-auth';
import location from '../assets/location.svg';

// Helper function to format role from pokemon_center to Pokemon Center
function formatRole(role) {
  if (!role) return '';
  return role
    .split('_')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(' ');
}

function ProfileCard({ profile, onUpdate }) {
  const { auth } = useAuth();
  const isOwnProfile = auth?.user?.id === profile?.user?.id;
  
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState({
    bio: profile.bio || '',
    avatar: profile.avatar || '',
    location: profile.location || '',
    showAvatarPicker: false
  });
  const [error, setError] = useState(null);

  const getAvatarSrc = () => {
    if (isEditing && editData.avatar) {
      return getAvatarById(editData.avatar)?.src;
    }
    if (profile.avatar) {
      return getAvatarById(profile.avatar)?.src;
    }
    if (profile.user?.role) {
      return getAvatarById(getAvatarByRole(profile.user.role))?.src;
    }
    return getAvatarById('ditto')?.src;
  };

  const handleSave = async () => {
    try {
      if (!editData.location.trim()) {
        setError("Location cannot be empty");
        return;
      }

      const updatedProfile = await onUpdate({
        bio: editData.bio,
        avatar: editData.avatar,
        location: editData.location.trim()
      });
      
      setEditData({
        bio: updatedProfile.bio || '',
        avatar: updatedProfile.avatar || '',
        location: updatedProfile.location || '',
        showAvatarPicker: false
      });
      
      setIsEditing(false);
    } catch (error) {
      alert('Failed to update profile. Please try again.');
    }
  };

  if (!profile) return null;

  return (
    <div className="profile-card">
      <div className="profile-header">
        {isOwnProfile && !isEditing && (
          <button onClick={() => setIsEditing(true)} className="edit-button">
            Edit
          </button>
        )}
        
        <div className="avatar-container">
          <img
            src={getAvatarSrc()}
            alt="Profile avatar"
            className="profile-avatar"
          />
          {isEditing && (
            <button 
              className="avatar-edit-icon"
              onClick={() => setEditData(prev => ({ ...prev, showAvatarPicker: true }))}
            >
              ✎
            </button>
          )}
          {isEditing && editData.showAvatarPicker && (
            <AvatarPicker
              selected={editData.avatar}
              onSelect={(avatarId) => {
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
          <h3 className="username">{profile.username}</h3>
          <h4 className="role">{formatRole(profile.user?.role)}</h4>
          
          {isEditing ? (
            <div className="edit-field">
              <input
                type="text"
                value={editData.location}
                onChange={(e) => {
                  setError(null);
                  setEditData(prev => ({
                    ...prev,
                    location: e.target.value
                  }));
                }}
                placeholder="Enter your location"
                className={error ? 'error' : ''}
                required
              />
              {error && <div className="error-message">{error}</div>}
            </div>
          ) : (
            <div className='location-container'>
              <img className="location-image" src={location} alt="Location icon" />
              <p className="location-text">{profile.location || 'Location not set'}</p>
            </div>
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
              <button onClick={() => setIsEditing(false)}>Cancel</button>
              <button onClick={handleSave}>Save</button>
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