import { createContext, useState } from "react";

// Here we create the Context
export const AuthContext = createContext();

// Here we create the component that will wrap our app, this means all it children can access the context using are hook.
export const AuthProvider = (props) => {
  // Load both token and user from localStorage
  const [auth, setAuth] = useState({
    token: window.localStorage.getItem("token"),
    user: JSON.parse(window.localStorage.getItem("user")) || null,
  });

  const isLoggedIn = !!auth.token; // true if token exists

  return (
    <AuthContext.Provider value={{ auth, setAuth, isLoggedIn }}>
      {props.children}
    </AuthContext.Provider>
  );
};