import { Outlet } from "react-router";
import useAuth from "../hooks/useAuth";
import { Navigate } from "react-router";

/**
 * A protected route that will redirect to /login if the user is not
 * logged in.
 *
 * @returns {JSX.Element} The protected route
 */
const PrivateRoute = () => {
  const { user } = useAuth();

  return user ? <Outlet /> : <Navigate to="/login" replace />;
};

export default PrivateRoute;
