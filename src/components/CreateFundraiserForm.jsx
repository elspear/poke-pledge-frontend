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
  });

  // above code, now defaults fields to empty strings for when a user edits their fundraiser
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);

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
    } catch (_) {
      return false;
    }
  };

  const validatePokemonName = async (name) => {
    if (!name) return { valid: false, error: "Pokemon is required" };
    if (name.trim().toLowerCase() === "pikachu") {
      return { valid: true };
    }
    return { valid: false, error: "Select a real Pokémon." };
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
    } else if (fundraiserData.description.length > 500) {
      newErrors.description = "Description must be less than 500 characters";
    }
    // Goal validation
    if (!fundraiserData.goal) {
      newErrors.goal = "Goal is required";
    } else {
      const goalAmount = parseFloat(fundraiserData.goal);
      if (isNaN(goalAmount) || goalAmount <= 0) {
        newErrors.goal = "Please enter a valid positive number";
      } else if (mode === "edit" && goalAmount < totalPledged) {
        newErrors.goal = `Goal cannot be less than total pledged (${totalPledged})`;
      }
    }
    // Items needed validation
    if (!fundraiserData.itemsNeeded.trim()) {
      newErrors.itemsNeeded = "Items required";
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
        const apiData = {
          ...fundraiserData,
          goal: parseFloat(fundraiserData.goal),
        };
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
    <div>
      <h2>{mode === "edit" ? "Edit Fundraiser" : "Create a New Fundraiser"}</h2>
      <form onSubmit={handleSubmit}>
        {/* Title */}
        <div className="form-group">
          <label htmlFor="title">Fundraiser Title</label>
          <input
            type="text"
            id="title"
            value={fundraiserData.title}
            onChange={handleChange}
            placeholder="Enter fundraiser title"
            className={errors.title ? "input-error" : ""}
            disabled={isLoading || externalLoading}
          />
          {errors.title && <span className="error-message">{errors.title}</span>}
        </div>

        {/* Description */}
        <div className="form-group">
          <label htmlFor="description">Description</label>
          <textarea
            id="description"
            value={fundraiserData.description}
            onChange={handleChange}
            placeholder="Describe your fundraiser"
            rows={4}
            className={errors.description ? "input-error" : ""}
            disabled={isLoading || externalLoading}
          />
          {errors.description && <span className="error-message">{errors.description}</span>}
        </div>

        {/* Pokemon (disabled in edit mode) */}
        <div className="form-group">
          <label htmlFor="pokemon">Pokemon</label>
          <input
            type="text"
            id="pokemon"
            value={fundraiserData.pokemon}
            onChange={handleChange}
            placeholder="Which Pokemon is this for?"
            className={errors.pokemon ? "input-error" : ""}
            disabled={mode === "edit" || isLoading || externalLoading}
          />
          {errors.pokemon && <span className="error-message">{errors.pokemon}</span>}
        </div>

        {/* Goal */}
        <div className="form-group">
          <label htmlFor="goal">Goal Amount ₽</label>
          <input
            type="number"
            id="goal"
            value={fundraiserData.goal}
            onChange={handleChange}
            placeholder="0.00"
            min="0"
            step="0.01"
            className={errors.goal ? "input-error" : ""}
            disabled={isLoading || externalLoading}
          />
          {errors.goal && <span className="error-message">{errors.goal}</span>}
        </div>

        {/* Items Needed */}
        <div className="form-group">
          <label htmlFor="itemsNeeded">Items Needed</label>
          <input
            type="text"
            id="itemsNeeded"
            value={fundraiserData.itemsNeeded}
            onChange={handleChange}
            placeholder="What items do you need?"
            className={errors.itemsNeeded ? "input-error" : ""}
            disabled={isLoading || externalLoading}
          />
          {errors.itemsNeeded && <span className="error-message">{errors.itemsNeeded}</span>}
        </div>

        {/* Image URL */}
        <div className="form-group">
          <label htmlFor="image">Image URL:</label>
          <input
            type="url"
            id="image"
            value={fundraiserData.image}
            onChange={handleChange}
            placeholder="https://example.com/image.jpg"
            className={errors.image ? "input-error" : ""}
            disabled={isLoading || externalLoading}
          />
          {errors.image && <span className="error-message">{errors.image}</span>}
        </div>

        {/* Submit Error */}
        {errors.submit && <div className="error-message submit-error">{errors.submit}</div>}

        {/* Submit Buttons */}
        <div className="form-buttons">
          <button type="submit" disabled={isLoading || externalLoading}>
            {isLoading || externalLoading
              ? mode === "edit"
                ? "Saving..."
                : "Creating..."
              : mode === "edit"
              ? "Save Changes"
              : "Create Fundraiser"}
          </button>
          <button type="button" onClick={() => navigate("/")} disabled={isLoading || externalLoading}>
            Cancel
          </button>
          {mode === "edit" && onDelete && (
            <button
              type="button"
              className="delete-button"
              onClick={handleDelete}
              disabled={isLoading || externalLoading}
            >
              Delete Fundraiser
            </button>
          )}
        </div>
      </form>
    </div>
  );
}

export default FundraiserForm;