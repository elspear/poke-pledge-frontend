import { useState, useEffect} from "react";
import { useNavigate } from "react-router-dom";

import postSignup from "../api/post-signup";
import postLogin from "../api/post-login";

function CompleteSignupForm() {
    const navigate = useNavigate();
    const [errors, setErrors] = useState({});
    const [isLoading, setIsLoading] = useState(false);
    const [successMessage, setSuccessMessage] = useState("");

    const [profileData, setProfileData] = useState({
        username: "",
        firstName: "",
        lastName: "",
        role: "",
    });

    // Get the email & password data from session storage
    useEffect(() => {
        const signupData = sessionStorage.getItem("signupData");
        if (!signupData) {
            // If not initial signup data, redirect back to signup
            navigate("/signup");
        }
    }, [navigate]);

    const handleChange = (event) => {
        const { id, value } = event.target;
        setProfileData((prev) => ({
            ...prev,
            [id]: value,
        }));
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        setErrors({});
        setSuccessMessage("");
        
        if (validateForm()) {
            setIsLoading(true);
            try {
                // get intial signup data
                const signupData = JSON.parse(sessionStorage.getItem("signupData"));

                // combine both sets of data
                const fullUserData = {
                    email: signupData.email,
                    password: signupData.password,
                    username: profileData.username,
                    first_name: profileData.firstName,
                    last_name: profileData.lastName,
                    role: profileData.role
                };

                // First create the account with all data
                await postSignup(fullUserData);
                
                // Then login with the credentials
                const loginResponse = await postLogin(fullUserData.username, fullUserData.password);

                // set the token and redirect
                window.localStorage.setItem("token", `Token ${loginResponse.token}`);
                
                setSuccessMessage("Account created successfully! Redirecting...");
                
                // Small delay to show success message before redirect
                setTimeout(() => {
                    navigate("/");
                }, 1500);
                
            } catch (error) {
                setErrors({submit: `Signup failed: ${error.message}`});
            } finally {
                setIsLoading(false);
            }
        }
    };

    const validateForm = () => {
        const newErrors = {};
        if (!profileData.username) newErrors.username = "Username is required";
        if (!profileData.firstName) newErrors.firstName = "First name is required";
        if (!profileData.lastName) newErrors.lastName = "Last name is required";
        if (!profileData.role) newErrors.role = "Role is required";

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

        return (
        <form onSubmit={handleSubmit}>
            <div>
                <label htmlFor="username">Username (for logging in):</label>
                <input 
                    type="text"
                    id="username"
                    value={profileData.username}
                    onChange={handleChange}
                    placeholder="Choose a username to log in with"
                />
                {errors.username && <span className="error">{errors.username}</span>}
            </div>
            <div>
                <label htmlFor="firstName">First Name:</label>
                <input
                    type="text"
                    id="firstName"
                    value={profileData.firstName}
                    onChange={handleChange}
                    placeholder="Your first name"
                />
                {errors.firstName && <span className="error">{errors.firstName}</span>}
            </div>
            <div>
                <label htmlFor="lastName">Last Name:</label>
                <input
                    type="text"
                    id="lastName"
                    value={profileData.lastName}
                    onChange={handleChange}
                    placeholder="Your last name"
                />
                {errors.lastName && <span className="error">{errors.lastName}</span>}
            </div>
            <div>
                <label htmlFor="role">Role:</label>
                <select
                    id="role"
                    value={profileData.role}
                    onChange={handleChange}
                >
                    <option value="">Select a role</option>
                    <option value="trainer">Trainer</option>
                    <option value="pokemon_center">Pokemon Center</option>
                    <option value="safari_park">Safari Park</option>
                </select>
                {errors.role && <span className="error">{errors.role}</span>}
            </div>
            
            {/* User Feedback Messages */}
            {errors.submit && <div className="error">{errors.submit}</div>}
            {successMessage && <div className="success">{successMessage}</div>}
            {isLoading && <div className="loading">Creating your account...</div>}
            
            <button type="submit" disabled={isLoading}>
                {isLoading ? "Creating Account..." : "Complete Sign Up"}
            </button>
        </form>
    );
}

export default CompleteSignupForm;