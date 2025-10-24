import { useState, useEffect } from "react";
import getCurrentUserByUsername from "../api/get-current-user";
import { AuthContext } from "../contexts/auth";

// Here we create the component that will wrap our app, this means all it children can access the context using are hook.
export const AuthProvider = (props) => {
  // Load both token and user from localStorage
  const [auth, setAuth] = useState({
    token: window.localStorage.getItem("token"),
    user: JSON.parse(window.localStorage.getItem("user")) || null,
  });

  const isLoggedIn = !!auth.token; // true if token exists

  // When the app starts (or when token changes), try to load the full user/profile
  // If a token exists but we only have a minimal user (or none), try to fetch the
  // full user object from the API and persist it to localStorage.
  useEffect(() => {
    let cancelled = false;

    const loadUser = async () => {
      try {
        if (!auth.token) return;

        // Get the current user from context/localStorage
        const currentUser = auth.user || JSON.parse(window.localStorage.getItem("user"));

        // If we already have a `profile` object attached, skip fetching
        if (currentUser && currentUser.profile) return;

        const username = currentUser?.username;
        if (!username) return;

        const user = await getCurrentUserByUsername(username);
        if (!cancelled && user) {
          setAuth((prev) => ({ ...prev, user }));
          window.localStorage.setItem("user", JSON.stringify(user));
        }
      } catch (error) {
        // If fetch fails, we silently ignore — app can still function with minimal user info
        console.error("Failed to fetch current user/profile:", error);
      }
    };

    loadUser();

    return () => {
      cancelled = true;
    };
  }, [auth.token]);

  return (
    <AuthContext.Provider value={{ auth, setAuth, isLoggedIn }}>
      {props.children}
    </AuthContext.Provider>
  );
};