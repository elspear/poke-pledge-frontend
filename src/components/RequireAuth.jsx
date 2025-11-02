import { useAuth } from "../hooks/use-auth";
import { Navigate } from "react-router-dom";

function RequireAuth({ children }) {
  const { isLoggedIn } = useAuth();
  
  if (!isLoggedIn) {
    return <Navigate to="/auth-required/" replace />;
  }

  return children;
}

export default RequireAuth;