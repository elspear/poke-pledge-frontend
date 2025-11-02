import { avatars } from '../assets/avatars';
import { useState } from 'react';
import './AvatarPicker.css';

function AvatarPicker({ selectedAvatar, onSelect }) {
    const [loadedImages, setLoadedImages] = useState(new Set());
    const [errors, setErrors] = useState(new Set());

    const handleImageLoad = (avatarId) => {
        setLoadedImages(prev => new Set([...prev, avatarId]));
    };

    const handleImageError = (avatarId) => {
        setErrors(prev => new Set([...prev, avatarId]));
    };

    return (
        <div className="avatar-picker">
            <h4>Choose your avatar</h4>
            <div className="avatar-grid">
                {avatars.map((avatar) => (
                    <button
                        key={avatar.id}
                        className={`avatar-option ${selectedAvatar === avatar.id ? 'selected' : ''} ${
                            !loadedImages.has(avatar.id) ? 'loading' : ''
                        }`}
                        onClick={() => onSelect(avatar.id)}
                        type="button"
                        title={avatar.alt}
                        disabled={errors.has(avatar.id)}
                    >
                        <img 
                            src={avatar.src} 
                            alt={avatar.alt}
                            className="avatar-image"
                            onLoad={() => handleImageLoad(avatar.id)}
                            onError={() => handleImageError(avatar.id)}
                        />
                        {!loadedImages.has(avatar.id) && !errors.has(avatar.id) && (
                            <div className="avatar-loading">Loading...</div>
                        )}
                    </button>
                ))}
            </div>
        </div>
    );
}

export default AvatarPicker;
