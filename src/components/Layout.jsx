import { Outlet } from "react-router";
import MenuIcon from "@mui/icons-material/Menu";
import LogoSm from "./LogoSm";
import useAuth from "../hooks/useAuth";
import { AccountCircle } from "@mui/icons-material";
import { useState } from "react";

const Layout = ({ children }) => {
  const { user } = useAuth();
  const { photoURL, displayName } = user;
  const [menuOpen, setMenuOpen] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="page-wrapper">
      <div className="overlay" data-menu-open={menuOpen} data-sidebar-open={sidebarOpen} onClick={() => {setMenuOpen(false); setSidebarOpen(false)}}/>
      <div className="page-container" data-menu-open={menuOpen} data-sidebar-open={sidebarOpen}>
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
            <div className="nav-right" onClick={() => setSidebarOpen(prev => !prev)}>
              {photoURL ? (
                <img className="avatar" src={photoURL} alt={displayName} />
              ) : (
                <AccountCircle style={{ color: "white", fontSize: "3rem" }} />
              )}
            </div>
          </nav>
        </header>
        <main>{children}</main>
      </div>
    </div>
  );
};

export default Layout;
