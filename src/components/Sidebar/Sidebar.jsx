import { Link } from "react-router";
import LogoutIcon from "@mui/icons-material/Logout";
import PersonOutlineIcon from "@mui/icons-material/PersonOutline";
import MailOutlineIcon from "@mui/icons-material/MailOutline";
import DarkModeOutlinedIcon from "@mui/icons-material/DarkModeOutlined";

import "./Sidebar.css";

const Sidebar = ({ sidebarOpen, handleLogout, userName, email }) => {
  return (
    <div className="sidebar" data-sidebar-open={sidebarOpen}>
      <h3 className="sidebar__list-title">ACCOUNT</h3>
      <ul className="sidebar__list">
        <li>
          <div className="sidebar__item">
            <PersonOutlineIcon fontSize="small" className="sidebar__icon" />
            <span className="sidebar__item-name">Name</span>
          </div>
          <p className="sidebar__item-value">{userName}</p>
        </li>
        <li>
          <div className="sidebar__item">
            <MailOutlineIcon fontSize="small" className="sidebar__icon" />
            <span className="sidebar__item-name">Email</span>
          </div>
          <p className="sidebar__item-value">{email}</p>
        </li>
      </ul>
      <h3 className="sidebar__list-title">APP</h3>
      <ul className="sidebar__list">
        <li>
          <div className="sidebar__item">
            <DarkModeOutlinedIcon fontSize="small" className="sidebar__icon" />
            <span className="sidebar__item-name"> Color Scheme</span>
          </div>
          <p className="sidebar__item-value">Light</p>
        </li>
        <li>
          <div className="sidebar__item">
            <LogoutIcon fontSize="small" className="sidebar__icon" />
            <Link onClick={handleLogout} className="link">
              <span className="sidebar__item-name">Logout</span>
            </Link>
          </div>
        </li>
      </ul>
    </div>
  );
};

export default Sidebar;
