import { useState } from "react";
import { useNavigate } from "react-router-dom";   

function SignupForm() {
    const navigate = useNavigate();
    const [errors, setErrors] = useState({});
    const [isLoading, setIsLoading] = useState(false);

    const [credentials, setCredentials] = useState({
        email: "",
        password: "",
    });

    const handleChange = (event) => {
        const { id, value } = event.target;
        setCredentials((prevCredentials) => ({
            ...prevCredentials,
            [id]: value,
        }));
    };

    const handleSubmit = (event) => {
        event.preventDefault();
        if (validateForm()) {
            setIsLoading(true);
            // Store credentials in sessionStorage
            sessionStorage.setItem("signupData", JSON.stringify(credentials));
            // Navigate to signup completion page
            navigate("/complete-signup");
        }
    };

    const validateForm = () => {
        const newErrors = {};
        if (!credentials.email) newErrors.email = "Email is required";
        if (!credentials.password) newErrors.password = "Password is required";
        
        // Basic email format check (must contain @ and .com)
        if (credentials.email && !credentials.email.includes('@') || !credentials.email.toLowerCase().endsWith('.com')) {
            newErrors.email = "Must be in email format (include @ and .com)";
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    }

    return (
        <form onSubmit={handleSubmit}>
            <div className="form-group">
                <label htmlFor="email">Email</label>
                <input
                    type="email"
                    id="email"
                    value={credentials.email}
                    onChange={handleChange}
                    placeholder="Enter a valid email address"
                    className={errors.email ? "input-error" : ""}
                    aria-invalid={Boolean(errors.email)}
                    aria-describedby={errors.email ? "email-error" : undefined}
                    disabled={isLoading}
                />
                {errors.email && (
                    <span className="error-message" id="email-error">
                        {errors.email}
                    </span>
                )}
            </div>
            <div className="form-group">
                <label htmlFor="password">Password:</label>
                <input
                    type="password"
                    id="password"
                    value={credentials.password}
                    onChange={handleChange}
                    placeholder="Password"
                    className={errors.password ? "input-error" : ""}
                    aria-invalid={Boolean(errors.password)}
                    aria-describedby={errors.password ? "password-error" : undefined}
                    disabled={isLoading}
                />
                {errors.password && (
                    <span className="error-message" id="password-error">
                        {errors.password}
                    </span>
                )}
            </div>
            <button 
                type="submit" 
                disabled={isLoading}
            >
                {isLoading ? "Creating Account..." : "Continue"}
            </button>
        </form>
    );
}

export default SignupForm;