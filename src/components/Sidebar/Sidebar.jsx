import { Link } from "react-router";
import LogoutIcon from "@mui/icons-material/Logout";
import PersonOutlineIcon from "@mui/icons-material/PersonOutline";
import MailOutlineIcon from "@mui/icons-material/MailOutline";
import DarkModeOutlinedIcon from '@mui/icons-material/DarkModeOutlined';
import "./Sidebar.css";

const Sidebar = ({ sidebarOpen, handleLogout, userName, email }) => {
    return (
        <div className="sidebar" data-sidebar-open={sidebarOpen}>
        <ul className="sidebar-list">
          <h3>ACCOUNT</h3>
          <li>
            <div className="sidebar-list-item">
              <PersonOutlineIcon className="icon" />
              <span>Name</span>
            </div>
            <p>{userName}</p>
          </li>
          <li>
            <div className="sidebar-list-item">
              <MailOutlineIcon className="icon" />
              <span>Email</span>
            </div>
            <p>{email}</p>
          </li>
        </ul>
        <ul className="sidebar-list">
          <h3>APP</h3>
          <li>
            <div className="sidebar-list-item">
              <DarkModeOutlinedIcon className="icon" />
              <span> Color Scheme</span>
            </div>
            <p>Light</p>
          </li>
          <li>
            <div className="sidebar-list-item">
              <LogoutIcon className="icon" />
              <Link onClick={handleLogout} className="link">
                Logout
              </Link>
            </div>
          </li>
        </ul>
      </div>
    )
}

export default Sidebar