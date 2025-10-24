import { Link, useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import "./ProfilePage.css";
import { useAuth } from "../hooks/use-auth";
import useFundraisersByOwner from "../hooks/use-fundraisers-by-owner";
import FundraiserCard from "../components/FundraiserCard";
import Avatar from "../components/Avatar";
import AvatarPicker from "../components/AvatarPicker";
import patchProfile from "../api/patch-profile";
import getCurrentUserByUsername from "../api/get-current-user";
import avatars from "../assets/avatars";

function ProfilePage() {
  const { auth, isLoggedIn, setAuth } = useAuth();

  const { id: routeId } = useParams();

  // If the route includes an `id` param we should try to load that user's profile
  // and allow unauthenticated visitors to view it. If no id is present then we
  // require the current user to be logged in to view their own profile page.

  const user = auth.user || {};
  const profile = user.profile || {};

  // State for when viewing another user's profile via route param
  const [otherUser, setOtherUser] = useState(null);
  const [loadingOther, setLoadingOther] = useState(false);
  const [otherError, setOtherError] = useState(null);

  useEffect(() => {
    let cancelled = false;
    if (!routeId) return;

    const load = async () => {
      setLoadingOther(true);
      setOtherError(null);
      try {
        // If routeId is numeric, try fetching the profile endpoint by id
        if (/^\d+$/.test(routeId)) {
          const token = window.localStorage.getItem("token");
          const res = await fetch(`${import.meta.env.VITE_API_URL}/users/profiles/${routeId}/`, {
            headers: {
              "Content-Type": "application/json",
              ...(token && { Authorization: token }),
            },
          });
          if (!res.ok) throw new Error(`Failed to fetch profile ${routeId}`);
          const profileData = await res.json();
          // Wrap into a user-shaped object the page expects: { username?, profile }
          const wrapped = { username: profileData.user?.username || profileData.username || `user-${profileData.id}`, profile: profileData };
          if (!cancelled) setOtherUser(wrapped);
        } else {
          // treat routeId as a username
          const userObj = await getCurrentUserByUsername(routeId);
          if (!cancelled) setOtherUser(userObj);
        }
      } catch {
        if (!cancelled) setOtherError(new Error('Failed to load profile'));
      } finally {
        if (!cancelled) setLoadingOther(false);
      }
    };

    load();
    return () => {
      cancelled = true;
    };
  }, [routeId]);
  const [showPicker, setShowPicker] = useState(false);
  // Always determine displayed user and fetch their fundraisers here so hooks
  // are executed unconditionally (avoid the Rules of Hooks ESLint errors).
  const viewingOther = Boolean(routeId);
  const displayedUser = viewingOther ? otherUser : user;
  const displayedProfile = displayedUser?.profile || {};

  // Determine whether the current viewer is the profile owner. Used to
  // conditionally render private fields (email, pledges, edit controls).
  const isOwner = Boolean(
    auth?.user &&
      displayedUser &&
      (
        // Prefer comparing profile id when available
        (auth.user?.profile?.id && displayedUser?.profile?.id && auth.user.profile.id === displayedUser.profile.id) ||
        // Fallback to username
        (auth.user?.username && displayedUser?.username && auth.user.username === displayedUser.username) ||
        // Last resort: user id
        (auth.user?.id && displayedUser?.id && auth.user.id === displayedUser.id)
      )
  );

  // ownerIdentifier prefers a profile id, then username, then user id.
  // When viewing another user's profile we avoid passing a placeholder or
  // partially-loaded value to the hook. Also sanitize any string that
  // contains the literal 'undefined' (these are usually placeholder usernames
  // produced during fallback logic).
  let ownerIdentifier = null;
  if (viewingOther) {
    if (loadingOther || otherError || !otherUser) {
      ownerIdentifier = null;
    } else {
      // Prefer a concrete profile id when available.
      ownerIdentifier = otherUser?.profile?.id ?? otherUser?.username ?? otherUser?.id ?? null;

      // If the username is a placeholder like "user-undefined" we may still
      // be able to derive a valid owner id from the profile's fundraisers
      // payload (some backends attach fundraisers to the profile). Use the
      // first fundraiser's owner fields as a fallback so we can display the
      // correct list on other users' profiles.
      if (typeof ownerIdentifier === "string" && ownerIdentifier.includes("undefined")) {
        const p = otherUser?.profile;
        if (p && Array.isArray(p.fundraisers) && p.fundraisers.length > 0) {
          const first = p.fundraisers[0];
          if (first) {
            if (typeof first.owner === "number") {
              ownerIdentifier = first.owner;
            } else if (first.owner_username) {
              ownerIdentifier = first.owner_username;
            }
          }
        }
      }
    }
  } else {
    ownerIdentifier = user?.profile?.id ?? user?.username ?? user?.id ?? null;
  }

  if (typeof ownerIdentifier === "string" && ownerIdentifier.includes("undefined")) {
    ownerIdentifier = null;
  }

  // debug logs removed

  const { fundraisers: ownerFundraisers, isLoading: ownerIsLoading, error: ownerError } = useFundraisersByOwner(ownerIdentifier);

  const myFundraisers = ownerFundraisers || [];

  // If user is not logged in and no routeId is present, show a friendly prompt.
  // This appears after the hook calls to satisfy the Rules of Hooks.
  if (!isLoggedIn && !routeId) {
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



  return (
    <div className="profile-page">
      <header className="profile-header">
        <div className="profile-avatar">
          <Avatar
            avatar={displayedProfile.avatar}
            src={displayedProfile.image}
            username={displayedUser?.username}
          />
        </div>

        <div className="profile-meta">
          <h2>{displayedUser?.username}{isOwner ? ' (you)' : ''}</h2>
          {displayedProfile.name && <p className="profile-name">{displayedProfile.name}</p>}
          {displayedProfile.bio && <p className="profile-bio">{displayedProfile.bio}</p>}
          {isOwner && displayedUser?.email && <p className="profile-email">{displayedUser.email}</p>}
          <p className="profile-actions">
            {isOwner && (
              <>
                <Link to="/profile/edit">Edit profile</Link> ·{" "}
                <Link to="/create">Create fundraiser</Link>
                <button style={{ marginLeft: 12 }} onClick={() => setShowPicker(true)}>
                  Choose avatar
                </button>
              </>
            )}
          </p>
        </div>
      </header>

        {/* Only allow avatar picker for the profile owner */}
        {showPicker && isOwner && (
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
              } catch {
                // ignore storage errors
              }
              return { ...prev, user: newUser };
            });

            // If we're viewing a profile via the route (viewingOther) and the
            // displayed profile corresponds to the current user (isOwner), also
            // update the `otherUser` state so the UI updates immediately while
            // we persist to the server. Without this, owners who visit their
            // own profile via a username/id route would not see the optimistic
            // avatar change because `displayedUser` is `otherUser`.
            if (viewingOther && isOwner && typeof setOtherUser === "function") {
              setOtherUser((prev) => ({
                ...(prev || {}),
                profile: { ...((prev && prev.profile) || {}), avatar: newAvatar },
              }));
            }

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
              } catch {
                // ignore
              }
              // inform the user
              window.alert("Failed to save avatar. Please try again.");
            }
          }}
        />
      )}

      <section className="profile-fundraisers">
        <h3>{isOwner ? 'Your fundraisers' : `${displayedUser?.username || 'This user'}'s fundraisers`}</h3>

        {viewingOther && loadingOther && <div className="loading">Loading profile...</div>}
        {viewingOther && otherError && <div className="error">Error loading profile: {otherError.message}</div>}

        {ownerIsLoading ? (
          <div className="loading">Loading fundraisers...</div>
        ) : null}

        {ownerError ? (
          <div className="error">Error loading fundraisers: {ownerError.message || String(ownerError)}</div>
        ) : null}

        {!ownerIsLoading && myFundraisers.length === 0 && (
          <div className="no-fundraisers">
            {viewingOther ? (
              <p>{displayedUser?.username || 'This user'} hasn't created any fundraisers yet.</p>
            ) : (
              <>
                <p>You haven't created any fundraisers yet.</p>
                <Link to="/create">
                  <button>Create your first fundraiser</button>
                </Link>
              </>
            )}
          </div>
        )}

        <div id="fundraiser-list">
          {myFundraisers.map((fundraiserData, key) => (
            <FundraiserCard
              key={fundraiserData?.id ?? fundraiserData?.pk ?? fundraiserData?._id ?? key}
              fundraiserData={fundraiserData}
            />
          ))}
        </div>
      </section>
    </div>
  );
}

export default ProfilePage;
