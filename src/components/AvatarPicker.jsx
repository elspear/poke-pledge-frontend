import { avatars } from '../assets/avatars';
import './AvatarPicker.css';

function AvatarPicker({ selectedAvatar, onSelect }) {
    return (
        <div className="avatar-picker">
            <h4>Choose your avatar</h4>
            <div className="avatar-grid">
                {avatars.map((avatar) => (
                    <button
                        key={avatar.id}
                        className={`avatar-option ${selectedAvatar === avatar.src ? 'selected' : ''}`}
                        onClick={() => onSelect(avatar.src)}
                        type="button"
                        title={avatar.alt}
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
