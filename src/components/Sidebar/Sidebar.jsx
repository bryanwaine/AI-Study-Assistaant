import { Link } from "react-router";
import LogoutIcon from "@mui/icons-material/Logout";
import PersonOutlineIcon from "@mui/icons-material/PersonOutline";
import MailOutlineIcon from "@mui/icons-material/MailOutline";
import DarkModeOutlinedIcon from "@mui/icons-material/DarkModeOutlined";

import "./Sidebar.css";
import { useEffect, useState } from "react";

const Sidebar = ({ sidebarOpen, handleLogout, userName, email }) => {
  const [theme, setTheme] = useState("dark");

  useEffect(() => {
    const savedTheme = localStorage.getItem("theme");
    if (!savedTheme) {
      localStorage.setItem("theme", "dark");
      document.documentElement.classList.add("dark");
      setTheme("dark");
    } else if (theme === "dark") {
      document.documentElement.classList.add("dark");
      setTheme("dark");
    } else {
      document.documentElement.classList.remove("dark");
      setTheme("light");
    }
  }, []);

  function handleDarkMode() {
    document.documentElement.classList.add("dark");
    localStorage.setItem("theme", "dark");
    setTheme("dark");
  }

  function handleLightMode() {
    document.documentElement.classList.remove("dark");
    localStorage.setItem("theme", "light");
    setTheme("light");
  }

  return (
    <div
      className="sidebar bg-gray-100/90 dark:bg-neutral-900/90  backdrop-blur-md"
      data-sidebar-open={sidebarOpen}
    >
      <h3 className="text-md align-left self-start !ml-4 text-sky-900 dark:text-sky-400 font-light">
        ACCOUNT
      </h3>
      <ul className="sidebar__list">
        <li className="bg-sky-100 dark:bg-black">
          <div className="w-full flex-1 flex items-center gap-2 text-sky-900 dark:text-sky-400">
            <PersonOutlineIcon fontSize="small" className="sidebar__icon" />
            <span className="font-md text-sm"> Name</span>
          </div>
          <p className="sidebar__item-value w-full flex-3 flex justify-end items-center gap-2 text-xs font-light text-neutral-900 dark:text-neutral-100">
            {userName}
          </p>
        </li>
        <li className="bg-sky-100 dark:bg-black">
          <div className="w-full flex-1 flex items-center gap-2 text-sky-900 dark:text-sky-400">
            <MailOutlineIcon fontSize="small" className="sidebar__icon" />
            <span className="font-md text-sm"> Email</span>
          </div>
          <p className="sidebar__item-value w-full flex-3 flex justify-end items-center gap-2 text-xs font-light text-neutral-900 dark:text-neutral-100 ">
            {email}
          </p>
        </li>
      </ul>
      <h3 className="text-md align-left self-start !ml-4 text-sky-900 dark:text-sky-400 font-light">
        APP
      </h3>
      <ul className="sidebar__list">
        <li className="bg-sky-100 dark:bg-black">
          <div className="w-full flex items-center gap-2 text-sky-900 dark:text-sky-400">
            <DarkModeOutlinedIcon fontSize="small" className="text-md" />
            <span className="font-md text-sm"> Color Scheme</span>
          </div>
          <div className="sidebar__item-value w-full flex justify-end items-center gap-2 text-xs font-light text-neutral-900 dark:text-neutral-100 ">
            <select
              name="color-scheme"
              id="color-scheme"
              className="outline-none md:outline-2"
              onChange={(e) => {
                if (e.target.value === "dark") {
                  handleDarkMode();
                } else {
                  handleLightMode();
                }
              }}
              value={theme}
            >
              <option value="dark">Dark</option>
              <option value="light">Light</option>
            </select>
          </div>
        </li>
        <li className="bg-sky-100 dark:bg-black">
          <div className="w-full flex items-center gap-2 text-sky-900 dark:text-sky-400">
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
