import { avatars } from '../assets/avatars';
import './AvatarPicker.css';

function AvatarPicker({ selectedAvatar, onSelect }) {
    return (
        <div className="avatar-picker">
            <div className="avatar-grid">
                {avatars.map((avatar) => (
                    <button
                        key={avatar.id}
                        className={`avatar-option ${selectedAvatar === avatar.id ? 'selected' : ''}`}
                        onClick={() => onSelect(avatar.id)}
                        type="button"
                    >
                        <img 
                            src={avatar.src} 
                            alt={avatar.alt}
                            className="avatar-image" 
                        />
                    </button>
                ))}
            </div>
        </div>
    );
}

export default AvatarPicker;
