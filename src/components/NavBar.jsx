import { Link, Outlet } from "react-router-dom";
import { useAuth } from "../hooks/use-auth";
import PokePledge from "../assets/PokePledge.png";

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
        <div className="nav-left">
          <Link to="/">
            <img src={PokePledge} alt="Logo" />
          </Link>
          <ul className="nav-bar-links">
            <li><Link to="/about" className="about-link">About</Link></li>
          </ul>
        </div>
        <div className="nav-right">
          <ul className="nav-bar-links">
            
            
              <li className="pill">
                <Link to="/create-fundraiser">Create a Fundraiser</Link>
              </li>

            {/*Authentication links - combined login and signup, both don't show when logged in*/}
            {auth.token ? ( 
              <li className="pill">
                <Link to="/" onClick={handleLogout}>
                  Log Out
                </Link>
              </li>
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