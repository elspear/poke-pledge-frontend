import { Link, Outlet } from "react-router-dom";
import { useAuth } from "../hooks/use-auth";

import "./NavBar.css";

function NavBar() {
  const {auth, setAuth} = useAuth();

  const handleLogout = () => {
    window.localStorage.removeItem("token");
    setAuth({ token: null });
  };


  return (
    <>
    <div className="nav-container">
      <nav className="nav-bar">
        <ul>
          <li>
            <Link to="/">Home</Link>
          </li>
          <li>
            {auth.token ? (
              <Link to="/" onClick={handleLogout}>
                Log Out
              </Link>
            ) : (
              <Link to="/login">Login</Link>
            )}
          </li>
          <li>
            <Link to="/signup">Sign Up</Link>
          </li>
          <li>
            <Link to="/create-fundraiser">Create a New Fundraiser</Link>
          </li>
          <li>
            <Link to="/about">About PokePledge</Link>
          </li>
          <li>
            <Link to="/contact">Contact Us</Link>
          </li>
        </ul>
      </nav>
    </div>
    <Outlet />
    </>
  );
}
  

export default NavBar;