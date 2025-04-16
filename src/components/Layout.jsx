import { Link, useNavigate } from "react-router";
import MenuIcon from "@mui/icons-material/Menu";
import LogoSm from "./LogoSm";
import useAuth from "../hooks/useAuth";
import { useState } from "react";
import useToast from "../hooks/useToast";
import firstNameFilter from "../utils/firstNameFilter";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import LogoutIcon from "@mui/icons-material/Logout";
import PersonOutlineIcon from "@mui/icons-material/PersonOutline";
import MailOutlineIcon from "@mui/icons-material/MailOutline";

const Layout = ({ children }) => {
  const { user, logout } = useAuth();
  const { photoURL, displayName, email } = user;
  const [menuOpen, setMenuOpen] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const { showToast } = useToast();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    showToast(`Goodbye ${firstNameFilter(displayName)}!`, "success");
    navigate("/login", { replace: true });
  };

  return (
    <div className="page-wrapper">
      <div
        className="overlay"
        data-menu-open={menuOpen}
        data-sidebar-open={sidebarOpen}
        onClick={() => {
          setMenuOpen(false);
          setSidebarOpen(false);
        }}
      />
      <div
        className="page-container"
        data-menu-open={menuOpen}
        data-sidebar-open={sidebarOpen}
      >
        <header>
          <nav>
            <div className="nav-left">
              <MenuIcon
                fontSize="large"
                style={{ color: "white" }}
                onClick={() => {
                  setMenuOpen((prev) => !prev);
                }}
              />
            </div>
            <div className="nav-center">
              <LogoSm variant="light" />
            </div>
            <div
              className="nav-right"
              onClick={() => setSidebarOpen((prev) => !prev)}
            >
              {photoURL ? (
                <img className="avatar" src={photoURL} alt={displayName} />
              ) : (
                <AccountCircleIcon
                  style={{ color: "white", fontSize: "3rem" }}
                />
              )}
            </div>
          </nav>
        </header>
        <main>{children}</main>
      </div>
      <div className="sidebar" data-sidebar-open={sidebarOpen}>
        <ul className="sidebar-list">
          <h3>Account</h3>
          <li>
            <div>
              <PersonOutlineIcon className="icon" />
              <span>Name</span>
            </div>
            <p>{displayName}</p>
          </li>
          <li>
            <div>
              <MailOutlineIcon className="icon" />
              <span>Email</span>
            </div>
            <p>{email}</p>
          </li>
          <li>
            <div>
              <LogoutIcon className="icon" />
              <Link onClick={handleLogout} className="link">
                Logout
              </Link>
            </div>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default Layout;
