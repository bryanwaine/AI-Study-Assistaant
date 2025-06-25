import { Link } from "react-router";
import LogoutIcon from "@mui/icons-material/Logout";
import PersonOutlineIcon from "@mui/icons-material/PersonOutline";
import MailOutlineIcon from "@mui/icons-material/MailOutline";
import DarkModeOutlinedIcon from "@mui/icons-material/DarkModeOutlined";

import "./Sidebar.css";

const Sidebar = ({ sidebarOpen, handleLogout, userName, email }) => {
  return (
    <div className="sidebar bg-gray-100/90 dark:bg-neutral-900/90  backdrop-blur-md" data-sidebar-open={sidebarOpen}>
      <h3 className="text-md align-left self-start !ml-4 text-sky-900 dark:text-sky-100 font-light">ACCOUNT</h3>
      <ul className="sidebar__list">
        <li className="bg-sky-100 dark:bg-black">
           <div className="w-full flex-1 flex items-center gap-2 text-sky-900 dark:text-sky-100">
            <PersonOutlineIcon fontSize="small" className="sidebar__icon" />
            <span className="font-md text-sm"> Name</span>
          </div>
          <p className="sidebar__item-value w-full flex-3 flex justify-end items-center gap-2 text-xs font-light text-neutral-900 dark:text-neutral-100">{userName}</p>
        </li>
       <li className="bg-sky-100 dark:bg-black">
           <div className="w-full flex-1 flex items-center gap-2 text-sky-900 dark:text-sky-100">
            <MailOutlineIcon fontSize="small" className="sidebar__icon" />
            <span className="font-md text-sm"> Email</span>
          </div>
          <p className="sidebar__item-value w-full flex-3 flex justify-end items-center gap-2 text-xs font-light text-neutral-900 dark:text-neutral-100 ">{email}</p>
        </li>
      </ul>
      <h3 className="text-md align-left self-start !ml-4 text-sky-900 dark:text-sky-100 font-light">APP</h3>
      <ul className="sidebar__list">
        <li className="bg-sky-100 dark:bg-black">
          <div className="w-full flex items-center gap-2 text-sky-900 dark:text-sky-100">
            <DarkModeOutlinedIcon fontSize="small" className="text-md" />
            <span className="font-md text-sm"> Color Scheme</span>
          </div>
          <p className="sidebar__item-value w-full flex justify-end items-center gap-2 text-xs font-light text-neutral-900 dark:text-neutral-100 truncate overflow-hidden whitespace-nowrap">Light</p>
        </li>
         <li className="bg-sky-100 dark:bg-black">
          <div className="w-full flex items-center gap-2 text-sky-900 dark:text-sky-100">
            <LogoutIcon fontSize="small" className="text-md" />
            <Link onClick={handleLogout} className="">
              <span className="font-md text-sm">Logout</span>
            </Link>
          </div>
        </li>
      </ul>
    </div>
  );
};

export default Sidebar;
