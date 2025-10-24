import { Link } from "react-router-dom";
import { useState } from "react";
import "./ProfilePage.css";
import { useAuth } from "../hooks/use-auth";
import useFundraisers from "../hooks/use-fundraisers";
import FundraiserCard from "../components/FundraiserCard";
import Avatar from "../components/Avatar";
import AvatarPicker from "../components/AvatarPicker";
import patchProfile from "../api/patch-profile";
import avatars from "../assets/avatars";

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
  const [showPicker, setShowPicker] = useState(false);

  // setAuth is provided by AuthContext; useAuth() returns { auth, setAuth, isLoggedIn }
  const { setAuth } = useAuth();

  // Filter fundraisers that belong to this user. The API surface in other
  // components uses `owner_username` so we match on username if available.
  const myFundraisers = Array.isArray(fundraisers)
    ? fundraisers.filter((f) => {
        if (!f) return false;
        if (f.owner_username && user.username)
          return f.owner_username === user.username;
        // fallback: try owner id fields
        if (f.owner && typeof f.owner === "number" && user.id)
          return f.owner === user.id;
        if (f.owner && f.owner.id && user.id) return f.owner.id === user.id;
        return false;
      })
    : [];

  return (
    <div className="profile-page">
      <header className="profile-header">
        <div className="profile-avatar">
          <Avatar
            avatar={profile.avatar}
            src={profile.image}
            username={user.username}
          />
        </div>

        <div className="profile-meta">
          <h2>{user.username}</h2>
          {profile.name && <p className="profile-name">{profile.name}</p>}
          {profile.bio && <p className="profile-bio">{profile.bio}</p>}
          {user.email && <p className="profile-email">{user.email}</p>}
          <p className="profile-actions">
            <Link to="/profile/edit">Edit profile</Link> ·{" "}
            <Link to="/create">Create fundraiser</Link>
            <button style={{ marginLeft: 12 }} onClick={() => setShowPicker(true)}>
              Choose avatar
            </button>
          </p>
        </div>
      </header>

      {showPicker && (
        <AvatarPicker
          avatars={avatars}
          initialSelectedId={profile?.avatar?.id}
          onClose={() => setShowPicker(false)}
          onSave={async (selected) => {
            // selected is an item from the avatars manifest: { id, name, src }
            const newAvatar = selected
              ? { type: "library", id: selected.id, src: selected.src }
              : null;
            // Optimistic update: keep previous auth/user so we can rollback on failure
            const prevAuth = auth;

            setAuth((prev) => {
              const newUser = { ...(prev.user || {}), profile: { ...(prev.user?.profile || {}), avatar: newAvatar } };
              try {
                window.localStorage.setItem("user", JSON.stringify(newUser));
              } catch (e) {
                // ignore storage errors
              }
              return { ...prev, user: newUser };
            });

            setShowPicker(false);

            // Attempt to persist to server. Use profile id if available or fallback to user id
            const profileId = user?.profile?.id || user?.id || null;
            if (!profileId) {
              // no server id available; nothing else to do
              return;
            }

            try {
              // The API expects a string (for example an avatar id or URL), not an object.
              // Send the avatar id so the backend can persist a simple value. If your
              // API expects the full URL instead, change this to `selected.src`.
              await patchProfile(profileId, { avatar: selected ? selected.id : "" });
            } catch (err) {
              console.error("Failed to save avatar to server", err);
              // rollback optimistic change
              try {
                setAuth((prev) => ({ ...prev, user: prevAuth.user }));
                window.localStorage.setItem("user", JSON.stringify(prevAuth.user));
              } catch (e) {
                // ignore
              }
              // inform the user
              window.alert("Failed to save avatar. Please try again.");
            }
          }}
        />
      )}

      <section className="profile-fundraisers">
        <h3>Your fundraisers</h3>

        {isLoading && <div className="loading">Loading fundraisers...</div>}
        {error && (
          <div className="error">
            Error loading fundraisers: {error.message || String(error)}
          </div>
        )}

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
