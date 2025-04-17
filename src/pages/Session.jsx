import { Navigate } from "react-router";
import Layout from "../components/Layout";
import useAuth from "../hooks/useAuth";
    
const Session = () => {
    const { user } = useAuth();
    if (!user) {
        return <Navigate to="/login" replace />;
      }
  return (
    <Layout>
      <div>Session</div>
    </Layout>
  );
};

export default Session;
