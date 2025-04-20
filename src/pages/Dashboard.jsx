import { useLocation, Navigate, Link } from "react-router";
import useAuth from "../hooks/useAuth";
import firstNameFilter from "../utils/firstNameFilter";
import Layout from "../components/Layout";
import handleGreeting from "../utils/greetingHandler";
import Button from "../components/Button";
import { NavigateNext } from "@mui/icons-material";
import { Fragment } from "react";
const Dashboard = () => {
  const { user } = useAuth();
  const location = useLocation();
  const userName = user?.displayName || location.state?.userName;

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return (
    <>
      <Layout />
        <div className="dashboard-container">
          <h1>Dashboard</h1>
          <section className="card--blue">
            <h2>{handleGreeting(firstNameFilter(userName))}</h2>
            <p className="dashboard-message">
              Here's an overview of your study progress:
            </p>
            <div className="dashboard-overview">
              <div className="dashboard-item card--white">
                <span className="dashboard-label">Sessions</span>
                <span className="dashboard-value">3</span>
              </div>
              <div className="dashboard-item card--white">
                <span className="dashboard-label">Notes</span>
                <span className="dashboard-value">5</span>
              </div>
              <div className="dashboard-item card--white">
                <span className="dashboard-label">Quizzes</span>
                <span className="dashboard-value">2</span>
              </div>
            </div>
            <Button variant="orange">
              <Link to="/new-session" className="btn--link">
                New Session
              </Link>
            </Button>
          </section>
          <section className="card--blue">
            <h2>Quick Links</h2>
            <div className="dashboard-quicklinks">
              <Link to="/new-session" className="link quicklink">
                <p>Ask a Question</p>
                <NavigateNext />
              </Link>
              <Link to="/new-note" className="link quicklink">
                <p>Create a Note</p>
                <NavigateNext />
              </Link>
              <Link to="/new-quiz" className="link quicklink">
                <p>Take a Quiz</p>
                <NavigateNext />
              </Link>
            </div>
          </section>
        </div>
      {/* </div> */}
    </>
  );
};

export default Dashboard;
