import { Link, Outlet, useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/use-auth";
import PokePledge from "../assets/PokePledge.png";
import StatsBanner from "./StatsBanner";

import "./NavBar.css";

function NavBar() {
  const {auth, setAuth} = useAuth();

  const navigate = useNavigate();

  const handleLogout = (e) => {
    // Keep token storage the same (other components rely on it). Remove token
    // then update auth in-memory and navigate after logout completes so we
    // avoid racing a Link navigation.
    window.localStorage.removeItem("token");
    setAuth({ token: null });
    navigate("/", { replace: true });
  };


  return (
    <>
    <StatsBanner />
    <div className="nav-container">
      <nav className="nav-bar">
        <div className="nav-left">
          <Link to="/">
            <img src={PokePledge} alt="Logo" />
          </Link>
          <ul className="nav-bar-links">
            <li className="pill">
              <Link to="/about" className="about-link">About</Link>
              </li>
          </ul>
        </div>
        <div className="nav-right">
          <ul className="nav-bar-links">
            
            
              <li className="pill">
                <Link to="/create-fundraiser">Create a Fundraiser</Link>
              </li>

            {/*Authentication links - combined login and signup, both don't show when logged in*/}
            {auth.token ? (
              <>
                <li className="pill">
                  <Link to="/dashboard">Dashboard</Link>
                </li>
                <li className="pill">
                  <button type="button" className="logout-button" onClick={handleLogout}>
                    Log Out
                  </button>
                </li>
              </>
            ) : (
              <>
                <li>
                  <Link to="/login">Login</Link>
                </li>
                <li>
                  <Link to="/signup/">Sign Up</Link>
                </li>
              </>
            )}
          </ul>
        </div>
      </nav>
    </div>
    <Outlet />
    </>
  );
}
  

export default NavBar;