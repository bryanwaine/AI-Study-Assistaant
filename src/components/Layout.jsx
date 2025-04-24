import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import useAuth from "../hooks/useAuth";
import useToast from "../hooks/useToast";
import firstNameFilter from "../utils/firstNameFilter";

import Header from "./Header";
import Menu from "./Menu";
import Sidebar from "./Sidebar";
import Overlay from "./Overlay";
import { getAllSessions } from "../utils/sessionService";
import handleAnthropicError from "../utils/anthropicErrorHandler";

const Layout = (props) => {
  const { userName } = props;
  const { user, logout } = useAuth();
  const { photoURL, displayName, email } = user;
  const [menuOpen, setMenuOpen] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [sessions, setSessions] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const { showToast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchSessions = async () => {
      setLoading(true);
      try {
        const data = await getAllSessions(user.uid);
        setSessions(data);
      } catch (error) {
        setError(handleAnthropicError(error).message);
      } finally {
        setLoading(false);
      }
    };

    fetchSessions();
  }, []);

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
      <Menu menuOpen={menuOpen} setMenuOpen={setMenuOpen} sessions={sessions} loading={loading} error={error} />
      <Header
        setMenuOpen={setMenuOpen}
        setSidebarOpen={setSidebarOpen}
        photoURL={photoURL}
        userName={userName}
      />
      <Sidebar
        sidebarOpen={sidebarOpen}
        handleLogout={handleLogout}
        userName={userName}
        email={email}
      />
    </>
  );
};

export default Layout;
