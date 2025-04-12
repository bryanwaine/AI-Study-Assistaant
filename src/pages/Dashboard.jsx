import { useNavigate } from "react-router";
import useAuth from "../hooks/useAuth";
const Dashboard = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login", { replace: true });
  };
  return (
    <div>
      <h1>Dashboard</h1>
      <p>user: {user?.displayName}</p>
      <button onClick={handleLogout} className="btn btn-blue">
        Logout
      </button>
    </div>
  );
};

export default Dashboard;
