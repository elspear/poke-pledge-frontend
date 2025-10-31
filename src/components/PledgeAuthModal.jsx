import { Link } from "react-router-dom";
import './PledgeAuthModal.css';

function PledgeAuthModal({ onClose }) {
    return (
        <div className="pledge-auth-overlay" onClick={onClose}>
            <div className="pledge-auth-content" onClick={e => e.stopPropagation()}>
                <button className="close-button" onClick={onClose}>&times;</button>

                <h2 className="pledge-auth-heading">Account Required</h2>

                <p className="pledge-auth-message">
                    You must be logged in to make a pledge.
                </p>

                <div className="pledge-auth-links">
                    <Link to="/signup" className="auth-link">Sign up</Link>
                    <Link to="/login" className="auth-link">Log in</Link>
                </div>
            </div>
        </div>
    );
}

export default PledgeAuthModal;