import { useState } from "react";
import { useNavigate } from "react-router-dom";

import postSignup from "../api/post-signup";

function SignupForm() {
    const navigate = useNavigate();
    const [errors, setErrors] = useState({});

    const [credentials, setCredentials] = useState({
        email: "",
        password: "",
    });

    const handleChange = (event) => {
        const { id, value} = event.target;
        setCredentials((prevCredentials) => ({
            ...prevCredentials,
            [id]: value,
        }));
    };

    const handleSubmit = (event) => {
        event.preventDefault();
        if (validateForm()) {
            // Store initial signup data in sessionStorage
            sessionStorage.setItem("signupData", JSON.stringify(credentials));
            // Navigate to signup completion page
            navigate("/complete-signup");
        }
    };

    const validateForm = () => {
        const newErrors = {};
        if (!credentials.email) newErrors.email = "Email is required";
        if (!credentials.password) newErrors.password = "Password is required";
        

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };


    return (
        <form onSubmit={handleSubmit}>
            <div className="form-group">
                <label htmlFor="email">Email:</label>
                <input
                   type="email"
                   id="email"
                   value={credentials.email}
                   placeholder="Enter your email"
                   onChange={handleChange}
                />
                {errors.email && <span className="error">{errors.email}</span>}
            </div>
            <div className="form-group">
                <label htmlFor="password">Password:</label>
                <input
                   type="password"
                   id="password"
                   value={credentials.password}
                   placeholder="password"
                   onChange={handleChange}
                 />
                {errors.password && <span className="error">{errors.password}</span>}
            </div>
            <button type="submit">Sign up</button>
        </form>
    );
}

export default SignupForm;