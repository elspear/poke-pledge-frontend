import { useAuth } from "../hooks/use-auth";
import { Navigate } from "react-router-dom";

const RequireAuth = ({ children }) => {
    const { isLoggedIn } = useAuth();
    return isLoggedIn ? children : <Navigate to="/auth-required/" />;
};

export default RequireAuth;