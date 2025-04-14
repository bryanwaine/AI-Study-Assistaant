import { useLocation, useNavigate } from "react-router";
import useAuth from "../hooks/useAuth";
import { useEffect } from "react";
const Dashboard = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
    const userName = user?.displayName || location.state?.userName;
    console.log('userName - ', userName);

    useEffect(() => {
      if (!user) {
        navigate("/login", { replace: true });
      }
    }, [user]);

  const handleLogout = () => {
    logout();
    navigate("/login", { replace: true });
  };
  return (
    <div>
      <h1>Dashboard</h1>
      <p>user: {userName}</p>
      <button onClick={handleLogout} className="btn btn-blue">
        Logout
      </button>
    </div>
  );
};

export default Dashboard;
