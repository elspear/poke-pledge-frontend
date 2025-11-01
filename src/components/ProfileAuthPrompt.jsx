import { useNavigate } from 'react-router-dom';
import './ProfileAuthPrompt.css';

function ProfileAuthPrompt({ username }) {
    const navigate = useNavigate();

    return (
        <div className="profile-auth-prompt">
            <h2>Authentication Required</h2>
            <p>
                You need to be logged in to view {username}'s profile.
            </p>
            <div className="auth-buttons">
                <button 
                    className="login-button"
                    onClick={() => navigate('/login')}
                >
                    Log In
                </button>
                <button 
                    className="signup-button"
                    onClick={() => navigate('/signup')}
                >
                    Sign Up
                </button>
            </div>
        </div>
    );
}

export default ProfileAuthPrompt;