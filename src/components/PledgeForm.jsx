
import React, { useState } from "react";
import postPledge from "../api/post-pledge";

function PledgeForm({ fundraiserId, onSuccess }) {
	const [amount, setAmount] = useState("");
	const [comment, setComment] = useState("");
	const [anonymous, setAnonymous] = useState(false);
	const [success, setSuccess] = useState("");
	const [error, setError] = useState("");

		const handleSubmit = async (e) => {
			e.preventDefault();
			setSuccess("");
			setError("");
			if (!amount) {
				setError("Amount is required");
				return;
			}
			if (!fundraiserId) {
				setError("Fundraiser ID missing");
				return;
			}
			try {
				await postPledge({
					amount: parseInt(amount, 10),
					comment,
					anonymous,
					fundraiser: fundraiserId,
				});
				setSuccess("Pledge submitted!");
				setAmount("");
				setComment("");
				setAnonymous(false);
				if (onSuccess) {
				  onSuccess();
				}
			} catch (err) {
				setError(err.message || "Failed to submit pledge");
			}
		};

	return (
		<form onSubmit={handleSubmit} className="pledge-form">
			<div>
				<label htmlFor="amount">Amount:</label>
				<input
					type="number"
					id="amount"
					value={amount}
					onChange={(e) => setAmount(e.target.value)}
					min="1"
					required
				/>
			</div>
			<div>
				<label htmlFor="comment">Comment:</label>
				<input
					type="text"
					id="comment"
					value={comment}
					onChange={(e) => setComment(e.target.value)}
					maxLength={200}
				/>
			</div>
			<div>
				<label htmlFor="anonymous">
					<input
						type="checkbox"
						id="anonymous"
						checked={anonymous}
						onChange={(e) => setAnonymous(e.target.checked)}
					/>
					Pledge anonymously
				</label>
			</div>
			<button type="submit">Submit Pledge</button>
			{success && <p className="success-message">{success}</p>}
			{error && <p className="error-message">{error}</p>}
		</form>
	);
}

export default PledgeForm;
