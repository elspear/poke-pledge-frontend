import { useState } from "react";
import { useNavigate } from "react-router-dom";

function CreateFundraiserForm() {
    const navigate = useNavigate();

    // We'll add state and handlers in the next steps
    return (
        <div>
            <h2>Create a New Fundraiser</h2>
            <form>
                <p>Form coming soon...</p>
                <button type="button" onClick={() => navigate("/")}>
                    Cancel
                </button>
            </form>
        </div>
    );
}

export default CreateFundraiserForm;