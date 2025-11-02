import { useState } from "react";
import { useNavigate } from "react-router-dom";
import postFundraiser from "../api/post-fundraiser";
import './CreateFundraiser.css';

function FundraiserForm({
  initialValues = {
    title: "",
    description: "",
    pokemon: "",
    goal: "",
    itemsNeeded: "",
    image: "",
    pledges: [],
  },
  onSubmit,
  onDelete,
  mode = "create",
  isLoading: externalLoading = false,
}) {
  const navigate = useNavigate();
  const [fundraiserData, setFundraiserData] = useState({
    title: initialValues.title || "",
    description: initialValues.description || "",
    pokemon: initialValues.pokemon || "",
    goal: initialValues.goal || "",
    itemsNeeded: initialValues.itemsNeeded || "",
    image: initialValues.image || "",
    end_date: initialValues.end_date || "",
    location: initialValues.location || "",
  });

  // above code, now defaults fields to empty strings for when a user edits their fundraiser
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const isFormDisabled = isLoading || externalLoading;

  // For edit mode, calculate total pledged
  const totalPledged = Array.isArray(initialValues.pledges)
    ? initialValues.pledges.reduce((sum, pledge) => sum + (pledge.amount || 0), 0)
    : 0;

  const handleChange = (event) => {
    const { id, value } = event.target;
    setFundraiserData((prevData) => ({
      ...prevData,
      [id]: value,
    }));
    setErrors((prev) => ({
      ...prev,
      [id]: "",
    }));
  };

  const isValidUrl = (string) => {
    try {
      new URL(string);
      return string.match(/\.(jpg|jpeg|png|gif|webp)$/i);
    } catch {
      return false;
    }
  };


  const validateForm = async () => {
    const newErrors = {};
    // Title validation
    if (!fundraiserData.title.trim()) {
      newErrors.title = "Title is required";
    } else if (fundraiserData.title.length > 100) {
      newErrors.title = "Title must be less than 100 characters";
    }
    // Description validation
    if (!fundraiserData.description.trim()) {
      newErrors.description = "Description is required";
    } else if (fundraiserData.description.length > 2000) {
      newErrors.description = "Description must be less than 2000 characters";
    }
    // Goal validation
    if (!fundraiserData.goal) {
      newErrors.goal = "Goal is required";
    } else {
      const goalAmount = parseFloat(fundraiserData.goal);
      if (isNaN(goalAmount) || goalAmount <= 0) {
        newErrors.goal = "Please enter a valid positive number";
      } else if (goalAmount > 1000000) {
        newErrors.goal = "Goal cannot exceed ₽1,000,000";
      } else if (mode === "edit" && goalAmount < totalPledged) {
        newErrors.goal = `Goal cannot be less than total pledged (${totalPledged})`;
      }
    }
    // End date validation
    if (fundraiserData.end_date) {
      const endDate = new Date(fundraiserData.end_date);
      if (endDate < new Date()) {
        newErrors.end_date = "End date cannot be in the past";
      }
    }
   
    // Location validation
    if (!fundraiserData.location.trim()) {
      newErrors.location = "Location is required";
    } else if (fundraiserData.location.length > 100) {
      newErrors.location = "Location must be less than 100 characters";
    }
    
    // Image URL validation
    if (!fundraiserData.image.trim()) {
      newErrors.image = "Image URL is required";
    } else if (!isValidUrl(fundraiserData.image)) {
      newErrors.image = "Please enter a valid image URL";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const isValid = await validateForm();
    if (isValid) {
      setIsLoading(true);
      setErrors({});
      try {
        // Convert camelCase to snake_case for API and ensure location is included
        const apiData = {
          ...fundraiserData,
          goal: parseFloat(fundraiserData.goal),
          items_needed: fundraiserData.itemsNeeded,
          location: fundraiserData.location, // explicitly include location
        };

        // If end_date is empty string or falsy, remove it so the API doesn't try to parse it
        if (!apiData.end_date) {
          delete apiData.end_date;
        }
        if (onSubmit) {
          await onSubmit(apiData);
        } else {
          // Default: create mode
          const response = await postFundraiser(apiData);
          navigate(`/fundraiser/${response.id}`);
        }
      } catch (error) {
        if (error.serverData) {
          if (
            error.serverData.error &&
            error.serverData.error.toLowerCase().includes("invalid pokemon name")
          ) {
            setErrors((prev) => ({
              ...prev,
              pokemon: "Select a real Pokémon.",
            }));
          } else {
            setErrors((prev) => ({
              ...prev,
              submit:
                error.serverData.error ||
                "Failed to submit fundraiser. Please try again.",
            }));
          }
        } else {
          setErrors((prev) => ({
            ...prev,
            submit: error.message || "Failed to submit fundraiser. Please try again.",
          }));
        }
      } finally {
        setIsLoading(false);
      }
    }
  };

  const handleDelete = async () => {
    if (onDelete && window.confirm("Are you sure you want to delete this fundraiser? This cannot be undone.")) {
      setIsLoading(true);
      try {
        await onDelete();
      } catch (error) {
        setErrors((prev) => ({
          ...prev,
          submit: error.message || "Failed to delete fundraiser. Please try again.",
        }));
      } finally {
        setIsLoading(false);
      }
    }
  };

  return (
    
   

      <div className="form-container-fundraiser">
      <h1>{mode === "edit" ? "EDIT FUNDRAISER" : "CREATE A NEW FUNDRAISER"}</h1>
      <form onSubmit={handleSubmit}>        {/* Title */}
        <div className="form-group">
          <label htmlFor="title">FUNDRAISER TITLE</label>
          <input
            type="text"
            id="title"
            value={fundraiserData.title}
            onChange={handleChange}
            placeholder="Enter fundraiser title"
            className={errors.title ? "error" : ""}
            disabled={isLoading || externalLoading}
          />
          {errors.title && <span className="form-error-message">{errors.title}</span>}
        </div>

        {/* Description */}
        <div className="form-group">
          <label htmlFor="description">DESCRIPTION</label>
          <textarea
            id="description"
            value={fundraiserData.description}
            onChange={handleChange}
            placeholder="Describe your fundraiser"
            rows={4}
            className={errors.description ? "error" : ""}
            disabled={isLoading || externalLoading}
          />
          {errors.description && <span className="error-message">{errors.description}</span>}
        </div>

        {/* Pokemon (disabled in edit mode) */}
        <div className="form-group">
          <label htmlFor="pokemon">POKÉMON</label>
          <input
            type="text"
            id="pokemon"
            value={fundraiserData.pokemon}
            onChange={handleChange}
            placeholder="Which Pokémon is this for?"
            className={errors.pokemon ? "error" : ""}
            disabled={mode === "edit" || isLoading || externalLoading}
          />
          {errors.pokemon && <span className="error-message">{errors.pokemon}</span>}
        </div>

        {/* Location */}
        <div className="form-group">
          <label htmlFor="location">LOCATION</label>
          <input
            type="text"
            id="location"
            value={fundraiserData.location}
            onChange={handleChange}
            placeholder="Where are you located?"
            className={errors.location ? "error" : ""}
            disabled={isLoading || externalLoading}
          />
          {errors.location && <span className="error-message">{errors.location}</span>}
        </div>

        {/* Goal */}
        <div className="form-group">
          <label htmlFor="goal">GOAL AMOUNT ₽</label>
          <input
            type="number"
            id="goal"
            value={fundraiserData.goal}
            onChange={handleChange}
            placeholder="0.00"
            min="0"
            step="0.01"
            className={errors.goal ? "error" : ""}
            disabled={isLoading || externalLoading}
          />
          {errors.goal && <span className="error-message">{errors.goal}</span>}
        </div>

        {/* Items Needed */}
        <div className="form-group">
          <label htmlFor="itemsNeeded">ITEMS NEEDED (OPTIONAL)</label>
          <input
            type="text"
            id="itemsNeeded"
            value={fundraiserData.itemsNeeded}
            onChange={handleChange}
            placeholder="What items do you need?"
            className={errors.itemsNeeded ? "error" : ""}
            disabled={isLoading || externalLoading}
          />
          {errors.itemsNeeded && <span className="error-message">{errors.itemsNeeded}</span>}
        </div>

        {/* Image URL */}
        <div className="form-group">
          <label htmlFor="image">IMAGE URL</label>
          <input
            type="url"
            id="image"
            value={fundraiserData.image}
            onChange={handleChange}
            placeholder="https://example.com/image.jpg"
            className={errors.image ? "error" : ""}
            disabled={isLoading || externalLoading}
          />
          {errors.image && <span className="error-message">{errors.image}</span>}
        </div>

        {/* End Date (optional) */}
        <div className="form-group">
          <label htmlFor="end_date">END DATE (OPTIONAL)</label>
          <input
            type="datetime-local"
            id="end_date"
            value={fundraiserData.end_date}
            onChange={handleChange}
            className={errors.end_date ? "error" : ""}
            disabled={isLoading || externalLoading}
          />
          {errors.end_date && <span className="error-message">{errors.end_date}</span>}
        </div>

        {/* Submit Error */}
        {errors.submit && <div className="form-error-message">{errors.submit}</div>}

        {/* Submit Buttons */}
        <div className="form-group">
          <button 
            type="submit" 
            className="form-btn"
            disabled={isFormDisabled}
          >
            {isFormDisabled
              ? mode === "edit"
                ? "SAVING..."
                : "CREATING..."
              : mode === "edit"
              ? "SAVE CHANGES"
              : "CREATE FUNDRAISER"}
          </button>
          <button 
            type="button" 
            className="form-btn"
            onClick={() => navigate("/")} 
            disabled={isLoading || externalLoading}
          >
            CANCEL
          </button>
          {mode === "edit" && onDelete && (
            <button
              type="button"
              className="form-btn"
              onClick={handleDelete}
              disabled={isLoading || externalLoading}
            >
              DELETE FUNDRAISER
            </button>
          )}
        </div>
      </form>
    </div>
  );
}

export default FundraiserForm;