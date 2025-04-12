import { Outlet } from "react-router";
import useAuth from "../hooks/useAuth";
import { Navigate } from "react-router";

const PrivateRoute = () => {
  const { user } = useAuth();

  return user ? <Outlet /> : <Navigate to="/login" replace />;
};

export default PrivateRoute;
