import { useState } from "react";
import { useNavigate } from "react-router-dom";
import postFundraiser from "../api/post-fundraiser";

function CreateFundraiserForm() {
    const navigate = useNavigate();

    // Creates local state to hold form data
    const [fundraiserData, setFundraiserData] = useState({
        title: "",
        description: "",
        pokemon: "",
        goal: "",
        itemsNeeded: "",
        image: "",
    });

    // Error state
    const [errors, setErrors] = useState({});

    // Loading state

    const [isLoading, setIsLoading] = useState(false); // isLoading = false (form is ready, buttons enabled)

    // Handle input changes
    const handleChange = (event) => {
        const { id, value } = event.target;
        setFundraiserData((prevData) =>({
            ...prevData,
            [id]: value,
        }));

        // Clear errors when user starts typing
        setErrors(prev => ({
            ...prev,
            [id]: ""  // Clear the error for this field
        }));
    };

    // URL validation helper function
    const isValidUrl = (string) => {
        try {
            new URL(string);
            return string.match(/\.(jpg|jpeg|png|gif|webp)$/i);
        } catch (_) {
            return false;
        }
    };

    // Form validation
    const validateForm = () => {
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

            // Pokemon validation
            if (!fundraiserData.pokemon.trim()) {
                newErrors.pokemon = "Pokemon is required";
            }

            // Goal validation
            if (!fundraiserData.goal) {
                newErrors.goal = "Goal is required";
            } else {
                const goalAmount = parseFloat(fundraiserData.goal);
                if (isNaN(goalAmount) || goalAmount <= 0 ) {
                    newErrors.goal = "Please enter a valid positive number";
                }
            }

            // Items needed validation

            if (!fundraiserData.itemsNeeded.trim()) {
                newErrors.itemsNeeded = "Items required"
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

    // Handle form submission 
    const handleSubmit = async (event) => {
        event.preventDefault();

        if (validateForm()) {
            setIsLoading(true);
            setErrors({}); // clear any previous errors

            try {
                // prepare data for API convert (conver goal to number)
                const apiData = {
                    ...fundraiserData,
                    goal: parseFloat(fundraiserData.goal)
                };

                // Debug: Log what we're sending to the API
                console.log("Sending this data to API:", apiData);

                // Call API
                const response = await postFundraiser(apiData);

                console.log("Fundraiser created successfully", response);

                // Redirect to the new fundraiser page
                navigate(`/fundraiser/${response.id}`);
            } catch (error) {
                console.error("Error creating fundraiser", error);
                // Improved error handling for server validation
                if (error.serverData) {
                    // Show specific error for invalid Pokemon name
                    if (error.serverData.error && error.serverData.error.includes("invalid Pokemon name")) {
                        setErrors(prev => ({
                            ...prev,
                            pokemon: error.serverData.error
                        }));
                    } else {
                        // Generic server error
                        setErrors(prev => ({
                            ...prev,
                            submit: error.serverData.error || "Failed to create fundraiser. Please try again."
                        }));
                    }
                } else {
                    // Fallback for other errors
                    setErrors(prev => ({
                        ...prev,
                        submit: error.message || "Failed to create fundraiser. Please try again."
                    }));
                }
            } finally {
                setIsLoading(false);
            }
        }
    };

    return (
        <div>
            <h2>Create a New Fundraiser</h2>
            <form onSubmit={handleSubmit}>
                {/* Title */}
                <div className="form-group">
                    <label htmlFor="title">Fundraiser Title:</label>
                    <input
                        type="text"
                        id="title"
                        value={fundraiserData.title}
                        onChange={handleChange}
                        placeholder="Enter fundraiser title"
                        className={errors.title ? "input-error" : ""}
                        disabled={isLoading}
                    />
                    {errors.title && (
                        <span className="error-message">{errors.title}</span>
                    )}
                </div>

                {/* Description */}
                <div className="form-group">
                    <label htmlFor="description">Description:</label>
                    <textarea
                        id="description"
                        value={fundraiserData.description}
                        onChange={handleChange}
                        placeholder="Describe your fundraiser"
                        rows={4}
                        className={errors.description ? "input-error" : ""}
                        disabled={isLoading}
                    />
                    {errors.description && (
                        <span className="error-message">{errors.description}</span>
                    )}
                </div>

                {/* Pokemon */}
                <div className="form-group">
                    <label htmlFor="pokemon">Pokemon:</label>
                    <input
                        type="text"
                        id="pokemon"
                        value={fundraiserData.pokemon}
                        onChange={handleChange}
                        placeholder="Which Pokemon is this for?"
                        className={errors.pokemon ? "input-error" : ""}
                        disabled={isLoading}
                    />
                    {errors.pokemon && (
                        <span className="error-message">{errors.pokemon}</span>
                    )}
                </div>

                {/* Goal */}
                <div className="form-group">
                    <label htmlFor="goal">Goal Amount (₽):</label>
                    <input
                        type="number"
                        id="goal"
                        value={fundraiserData.goal}
                        onChange={handleChange}
                        placeholder="0.00"
                        min="0"
                        step="0.01"
                        className={errors.goal ? "input-error" : ""}
                        disabled={isLoading}
                    />
                    {errors.goal && (
                        <span className="error-message">{errors.goal}</span>
                    )}
                </div>

                {/* Items Needed */}
                <div className="form-group">
                    <label htmlFor="itemsNeeded">Items Needed (Optional):</label>
                    <input
                        type="text"
                        id="itemsNeeded"
                        value={fundraiserData.itemsNeeded}
                        onChange={handleChange}
                        placeholder="What items do you need? (Optional)"
                        className={errors.itemsNeeded ? "input-error" : ""}
                        disabled={isLoading}
                    />
                    {errors.itemsNeeded && (
                        <span className="error-message">{errors.itemsNeeded}</span>
                    )}
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
                        disabled={isLoading}
                    />
                    {errors.image && (
                        <span className="error-message">{errors.image}</span>
                    )}
                </div>

                {/* Submit Error */}
                {errors.submit && (
                    <div className="error-message submit-error">
                        {errors.submit}
                    </div>
                )}

                {/* Submit Buttons */}
                <div className="form-buttons">
                    <button 
                        type="submit" 
                        disabled={isLoading}
                    >
                        {isLoading ? "Creating..." : "Create Fundraiser"}
                    </button>
                    <button 
                        type="button" 
                        onClick={() => navigate("/")}
                        disabled={isLoading}
                    >
                        Cancel
                    </button>
                </div>
            </form>
        </div>
    );
    
}

export default CreateFundraiserForm;