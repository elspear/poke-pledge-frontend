
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
		<div className="form-container">
			<div className="form-header">
				<h1>MAKE A PLEDGE</h1>
			</div>
			
			<form onSubmit={handleSubmit}>
				<div className="form-group">
					<label htmlFor="amount">AMOUNT ₽</label>
					<input
						type="number"
						id="amount"
						value={amount}
						onChange={(e) => setAmount(e.target.value)}
						min="1"
						required
						placeholder="Enter amount"
					/>
					{error === "Amount is required" && <span className="form-error-message">{error}</span>}
				</div>

				<div className="form-group">
					<label htmlFor="comment">COMMENT (OPTIONAL)</label>
					<input
						type="text"
						id="comment"
						value={comment}
						onChange={(e) => setComment(e.target.value)}
						maxLength={200}
						placeholder="Add a message"
					/>
				</div>

				<div className="form-group checkbox-group">
					<label htmlFor="anonymous" className="checkbox-label">
						<input
							type="checkbox"
							id="anonymous"
							checked={anonymous}
							onChange={(e) => setAnonymous(e.target.checked)}
						/>
						PLEDGE ANONYMOUSLY
					</label>
				</div>

				<button type="submit" className="form-btn">
					SUBMIT PLEDGE
				</button>

				{success && <p className="form-success-message">{success}</p>}
				{error && error !== "Amount is required" && (
					<p className="form-error-message">{error}</p>
				)}
			</form>
		</div>
	);
}

export default PledgeForm;
