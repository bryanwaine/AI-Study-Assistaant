import { useLocation, useNavigate, Navigate } from "react-router";
import useAuth from "../hooks/useAuth";
import useToast from "../hooks/useToast";
import firstNameFilter from "../utils/firstNameFilter";
import dateComparison from "../utils/dateComparison";
const Dashboard = () => {
  const { user, logout } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();
  const location = useLocation();
  const userName = user?.displayName || location.state?.userName;

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  const handleLogout = () => {
    logout();
    showToast(`Goodbye ${firstNameFilter(userName)}!`, "success");
    navigate("/login", { replace: true });
  };
  return (
    <div>
      <h1>Dashboard</h1>
      <p>{`${dateComparison(user.creationTime)} ${firstNameFilter(
        userName
      )}`}</p>
      <button onClick={handleLogout} className="btn btn-blue">
        Logout
      </button>
    </div>
  );
};

export default Dashboard;
