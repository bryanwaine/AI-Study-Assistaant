import { useNavigate } from "react-router";
import useAuth from "../hooks/useAuth";
import { useState } from "react";
import useToast from "../hooks/useToast";
import firstNameFilter from "../utils/firstNameFilter";

import Header from "./Header";
import Menu from "./Menu";
import Sidebar from "./Sidebar";
import Overlay from "./Overlay";

const Layout = () => {
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
    <>
      <Overlay
        menuOpen={menuOpen}
        sidebarOpen={sidebarOpen}
        setMenuOpen={setMenuOpen}
        setSidebarOpen={setSidebarOpen}
      />
      <Menu menuOpen={menuOpen} setMenuOpen={setMenuOpen} />
      <Header
         setMenuOpen={setMenuOpen}
         setSidebarOpen={setSidebarOpen}
         photoURL={photoURL}
         displayName={displayName}
       />
      <Sidebar
        sidebarOpen={sidebarOpen}
        handleLogout={handleLogout}
        displayName={displayName}
        email={email}
      />
    </>
  );
};

export default Layout;
