import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import postSignup from "../api/post-signup";
import postLogin from "../api/post-login";
import patchProfile from "../api/patch-profile";
import { getAvatarByRole } from "../utils/AvatarUtils";
import { useAuth } from "../hooks/use-auth";
import getCurrentUserByUsername from "../api/get-current-user";
import checkUsername from "../api/check-username";
import ProfilePromptModal from "./ProfileModalPrompt";
import "./SharedForm.css";

function CompleteSignupForm() {
  const navigate = useNavigate();
  const { setAuth } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [showProfilePrompt, setShowProfilePrompt] = useState(false);

  const [formState, setFormState] = useState({
    fields: {
      username: "",
      firstName: "",
      lastName: "",
      role: "",
      location: "",
    },
    errors: {
      username: "",
      firstName: "",
      lastName: "",
      role: "",
      location: "",
      submit: "",
    }
  });

  // Check for signup data
  useEffect(() => {
    const signupData = sessionStorage.getItem("signupData");
    if (!signupData) {
      navigate("/signup");
    }
  }, [navigate]);

  const validateForm = () => {
    let isValid = true;
    const newErrors = {};

    // Check all fields are filled
    Object.entries(formState.fields).forEach(([key, value]) => {
      if (!value.trim()) {
        newErrors[key] = `${key.charAt(0).toUpperCase() + key.slice(1)} is required`;
        isValid = false;
      }
    });

    setFormState(prev => ({
      ...prev,
      errors: newErrors
    }));

    return isValid;
  };

  const handleChange = async (event) => {
    const { id, value } = event.target;
    
    setFormState(prev => ({
      ...prev,
      fields: { ...prev.fields, [id]: value },
      errors: { ...prev.errors, [id]: "" }
    }));

    // Check username availability
    if (id === 'username' && value.trim()) {
      try {
        const response = await checkUsername(value);
        if (!response.available) {
          setFormState(prev => ({
            ...prev,
            errors: { ...prev.errors, username: "Username already taken" }
          }));
        }
      } catch (error) {
        console.error("Error checking username:", error);
      }
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (validateForm()) {
      setIsLoading(true);

      try {
        const signupData = JSON.parse(sessionStorage.getItem("signupData"));
        const avatar = getAvatarByRole(formState.fields.role);
        
        const fullUserData = {
          email: signupData.email,
          password: signupData.password,
          username: formState.fields.username,
          first_name: formState.fields.firstName,
          last_name: formState.fields.lastName,
          role: formState.fields.role,
          avatar,
          location: formState.fields.location,
        };

        await postSignup(fullUserData);
        const loginResponse = await postLogin(fullUserData.username, fullUserData.password);
        const token = `Token ${loginResponse.token}`;
        window.localStorage.setItem("token", token);

        const user = await getCurrentUserByUsername(fullUserData.username);
        
        if (user.profile) {
          await patchProfile(user.id, { 
            avatar,
            location: formState.fields.location 
          });
        }

        window.localStorage.setItem("user", JSON.stringify(user));
        setAuth({ token, user });
        setShowProfilePrompt(true);

      } catch (error) {
        const errorMessage = error.serverData?.detail || 
                           error.message || 
                           "Failed to create account";
        
        setFormState(prev => ({
          ...prev,
          errors: { ...prev.errors, submit: errorMessage }
        }));
      } finally {
        setIsLoading(false);
      }
    }
  };

  return (
    <>
      <form onSubmit={handleSubmit}>
        <div className="form-container">
          <div className="form-header">
            <h1>Just a few more details...</h1>
          </div>

          {Object.entries({
            username: "Choose a username to log in with",
            firstName: "Your first name",
            lastName: "Your last name",
            location: "Your location"
          }).map(([field, placeholder]) => (
            <div key={field} className={`form-group ${formState.errors[field] ? "error" : ""}`}>
              <label htmlFor={field}>{field.toUpperCase()}</label>
              <input
                type="text"
                id={field}
                placeholder={placeholder}
                onChange={handleChange}
                value={formState.fields[field]}
                disabled={isLoading}
              />
              {formState.errors[field] && (
                <span className="form-error-message">{formState.errors[field]}</span>
              )}
            </div>
          ))}

          <div className={`form-group ${formState.errors.role ? "error" : ""}`}>
            <label htmlFor="role">ROLE</label>
            <select 
              id="role" 
              value={formState.fields.role} 
              onChange={handleChange}
              disabled={isLoading}
            >
              <option value="">Select a role</option>
              <option value="trainer">Trainer</option>
              <option value="pokemon_center">Pokemon Center</option>
              <option value="safari_park">Safari Park</option>
            </select>
            {formState.errors.role && (
              <span className="form-error-message">{formState.errors.role}</span>
            )}
          </div>

          {formState.errors.submit && (
            <div className="error">{formState.errors.submit}</div>
          )}

          <button className="form-btn" type="submit" disabled={isLoading}>
            {isLoading ? "CREATING ACCOUNT..." : "COMPLETE SIGNUP"}
          </button>
        </div>
      </form>

      {showProfilePrompt && (
        <ProfilePromptModal 
          onClose={() => setShowProfilePrompt(false)}
        />
      )}
    </>
  );
}

export default CompleteSignupForm;