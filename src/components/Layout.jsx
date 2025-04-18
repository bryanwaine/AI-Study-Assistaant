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
import HistoryIcon from "@mui/icons-material/History";
import DescriptionOutlinedIcon from "@mui/icons-material/DescriptionOutlined";
import QuizOutlinedIcon from "@mui/icons-material/QuizOutlined";
import SearchOutlinedIcon from '@mui/icons-material/SearchOutlined';
import DarkModeOutlinedIcon from '@mui/icons-material/DarkModeOutlined';
import SpaceDashboardOutlinedIcon from '@mui/icons-material/SpaceDashboardOutlined';
import { DashboardOutlined } from "@mui/icons-material";

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
      <div className="menu" data-menu-open={menuOpen}>
      <div className="search-container">
          <button>
            <SearchOutlinedIcon  style={{ color: "#035172" }}/>
          </button>
          <input type="text" placeholder="Search" />
        </div>
        <ul className="menu-list">
          <li>
            <Link to="/dashboard">
              <div>
                <DashboardOutlined className="icon" />
                <span>Dashboard</span>
              </div>
            </Link>
          </li>
          <li>
            <Link to="#sessions">
              <div>
                <HistoryIcon className="icon" />
                <span>Sessions</span>
              </div>
            </Link>
          </li>
          <li>
            <Link to="#notes">
              <div>
                <DescriptionOutlinedIcon className="icon" />
                <span>Notes</span>
              </div>
            </Link>
          </li>
          <li>
            <Link to="#quizzes">
              <div>
                <QuizOutlinedIcon className="icon" />
                <span>Quizzes</span>
              </div>
            </Link>
          </li>
        </ul>
        <ul className="menu-list">
          <h3>Today</h3>
          <li>
            <div>
              <span> Memoization in React</span>
            </div>
          </li>
          <li>
            <div>
              <span>useState hook best practices</span>
            </div>
          </li>
        </ul>
        <ul className="menu-list">
          <h3>Last week</h3>
          <li>
            <div>
              <span> Object destructuring in JavaScript</span>
            </div>
          </li>
          <li>
            <div>
              <span>Empty array truthy or falsy</span>
            </div>
          </li>
          <li>
            <div>
              <span>Save fetch data to local storage</span>
            </div>
          </li>
        </ul>
        <ul className="menu-list">
          <h3>2 weeks ago</h3>
          <li>
            <div>
              <span>Shalow vs deep copy</span>
            </div>
          </li>
          <li>
            <div>
              <span>Searchng algorithm complexity</span>
            </div>
          </li>
        </ul>
        <ul className="menu-list">
          <h3>1 month ago</h3>
          <li>
            <div>
              <span>Select list items in Html</span>
            </div>
          </li>
          <li>
            <div>
              <span>Conditional rendering in React</span>
            </div>
          </li>
        </ul>
      </div>
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
              <div className="avatar-container">
                {photoURL ? (
                  <img className="avatar" src={photoURL} alt={displayName} />
                ) : (
                  <AccountCircleIcon
                    style={{ color: "white", fontSize: "3rem" }}
                  />
                )}
              </div>
            </div>
          </nav>
        </header>
        <main>{children}</main>
      </div>
      <div className="sidebar" data-sidebar-open={sidebarOpen}>
        <ul className="sidebar-list">
          <h3>ACCOUNT</h3>
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
        </ul>
        <ul className="sidebar-list">
          <h3>APP</h3>
          <li>
            <div>
              <DarkModeOutlinedIcon className="icon" />
              <span> Color Scheme</span>
            </div>
            <p>Light</p>
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
