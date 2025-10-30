import { Link } from 'react-router-dom';
import psyduckImage from '../assets/psyduck.jpg';
import './Error404Page.css';

function Error404Page() {
    return (
        <div className="error-page-container">
            <div className="error-content">
                <h1>404</h1>
                <h2>PAGE NOT FOUND</h2>
                <img 
                    src={psyduckImage} 
                    alt="Confused Psyduck" 
                    className="error-image"
                />
                <p>Oops! Looks like this Pokémon wandered off somewhere...</p>
                <Link to="/" className="home-link">
                    RETURN HOME
                </Link>
            </div>
        </div>
    );
}

export default Error404Page;