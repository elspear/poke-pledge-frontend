import { useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/use-auth";
import "./SharedForm.css";

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
        <div className="modal-overlay">
            <div className="form-container">
                <h1>Complete Your Profile?</h1>
                
                <p className="modal-text">
                    Would you like to personalize your profile now? You can:
                </p>
                <ul className="modal-list">
                    <li>Choose your Pokemon trainer avatar</li>
                    <li>Add a bio about yourself</li>
                    <li>Customize your profile</li>
                </ul>

                <div className="modal-buttons">
                    <button 
                        className="form-btn" 
                        onClick={handleCompleteProfile}
                    >
                        Yes, Customize Profile
                    </button>
                    
                    <button 
                        className="form-btn secondary" 
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