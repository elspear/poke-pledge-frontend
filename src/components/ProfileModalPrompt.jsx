import { useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/use-auth";
import "./ProfileModalPrompt.css";

function ProfilePromptModal({ onClose }) {
    const navigate = useNavigate();
    const { auth } = useAuth();

    const handleCompleteProfile = () => {
        // Navigate to their profile page with edit mode active
        navigate(`/profile/${auth.user.id}?edit=true`);
        onClose();
    };

    const handleSkip = () => {
        navigate("/");
        onClose();
    };

    return (
        <div className="profile-modal-prompt-overlay">
            <div className="profile-modal-prompt-content">
                <div className="profile-modal-prompt-header">
                    <h2>Complete Your Profile?</h2>
                </div>
                
                <div className="profile-modal-prompt-message">
                    <p>
                        Would you like to personalize your profile now? <br />
                        You can:
                    </p>
                    <ul>
                        <li>Choose an avatar</li>
                        <li>Add a bio about yourself or organisation</li>
                    </ul>
                </div>

                <div className="profile-modal-prompt-buttons">
                    <button 
                        className="primary-button" 
                        onClick={handleCompleteProfile}
                    >
                        Yes, Customize Profile
                    </button>
                    
                    <button 
                        className="secondary-button" 
                        onClick={handleSkip}
                    >
                        I'll Do It Later
                    </button>
                </div>
            </div>
        </div>
    );
}

export default ProfilePromptModal;