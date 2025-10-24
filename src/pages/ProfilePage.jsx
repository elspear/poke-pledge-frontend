
import { Link } from "react-router-dom";
import "./ProfilePage.css";
import { useAuth } from "../hooks/use-auth";
import useFundraisers from "../hooks/use-fundraisers";
import FundraiserCard from "../components/FundraiserCard";

function ProfilePage() {
	const { auth, isLoggedIn } = useAuth();
	const { fundraisers, isLoading, error } = useFundraisers();

	// If user is not logged in, prompt to login or signup
	if (!isLoggedIn) {
		return (
			<div className="profile-page not-logged-in">
				<h2>Your profile</h2>
				<p>You need to be logged in to view your profile.</p>
				<p>
					<Link to="/login">Log in</Link> or <Link to="/signup">Sign up</Link>
				</p>
			</div>
		);
	}

	const user = auth.user || {};
	const profile = user.profile || {};

	// Filter fundraisers that belong to this user. The API surface in other
	// components uses `owner_username` so we match on username if available.
	const myFundraisers = Array.isArray(fundraisers)
		? fundraisers.filter((f) => {
				if (!f) return false;
				if (f.owner_username && user.username) return f.owner_username === user.username;
				// fallback: try owner id fields
				if (f.owner && typeof f.owner === "number" && user.id) return f.owner === user.id;
				if (f.owner && f.owner.id && user.id) return f.owner.id === user.id;
				return false;
			})
		: [];

	return (
		<div className="profile-page">
			<header className="profile-header">
				<div className="profile-avatar">
					{profile.image ? (
						<img src={profile.image} alt={`${user.username} avatar`} />
					) : (
						<div className="avatar-placeholder">{(user.username || "?").charAt(0).toUpperCase()}</div>
					)}
				</div>
				<div className="profile-meta">
					<h2>{user.username}</h2>
					{profile.name && <p className="profile-name">{profile.name}</p>}
					{profile.bio && <p className="profile-bio">{profile.bio}</p>}
					{user.email && <p className="profile-email">{user.email}</p>}
					<p className="profile-actions">
						<Link to="/profile/edit">Edit profile</Link> · <Link to="/create">Create fundraiser</Link>
					</p>
				</div>
			</header>

			<section className="profile-fundraisers">
				<h3>Your fundraisers</h3>

				{isLoading && <div className="loading">Loading fundraisers...</div>}
				{error && <div className="error">Error loading fundraisers: {error.message || String(error)}</div>}

				{!isLoading && myFundraisers.length === 0 && (
					<div className="no-fundraisers">
						<p>You haven't created any fundraisers yet.</p>
						<Link to="/create">
							<button>Create your first fundraiser</button>
						</Link>
					</div>
				)}

				<div id="fundraiser-list">
					{myFundraisers.map((fundraiserData, key) => (
						<FundraiserCard key={key} fundraiserData={fundraiserData} />
					))}
				</div>
			</section>
		</div>
	);
}

export default ProfilePage;

