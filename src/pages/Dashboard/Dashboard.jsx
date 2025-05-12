import { useEffect, useState, lazy, Suspense } from "react";

import { useLocation, Navigate, Link } from "react-router";

import DashboardOverviewSkeleton from "../../components/Skeleton/DashboardOverviewSkeleton";
import DashboardQuicklinksCard from "./DashboardQuicklinksCard";

import Button from "../../components/Button/Button";
import Layout from "../../components/Layout";
import useAuth from "../../hooks/useAuth";
import { getAllSessions } from "../../utils/sessionService";
import handleAnthropicError from "../../utils/anthropicErrorHandler";
import { getAllDecks } from "../../utils/flashcardService";
import { getAllNotes } from "../../utils/noteService";
import handleGreeting from "../../utils/greetingHandler";
import firstNameFilter from "../../utils/firstNameFilter";

import "./Dashboard.css";


// Lazy loaded components
const DashboardOverviewCard = lazy(() => import("./DashboardOverviewCard"));

const Dashboard = () => {
  const [loading, setLoading] = useState(true);
  const [sessions, setSessions] = useState([]);
  const [flashcards, setFlashcards] = useState([]);
  const [notes, setNotes] = useState([]);
  const [error, setError] = useState(null);

  const { user } = useAuth();
  const location = useLocation();
  const userName = user?.displayName || location.state?.userName;

  useEffect(() => {
    if (!user) return;

    const fetchData = async () => {
      try {
        const [notes, sessions, flashcards] = await Promise.all([
          getAllNotes(user.uid),
          getAllSessions(user.uid),
          getAllDecks(user.uid),
        ]);
        setNotes(notes);
        setSessions(sessions);
        setFlashcards(flashcards);
      } catch (error) {
        setError(handleAnthropicError(error).message);
      } finally {
        setLoading(false);
      }
    };

    if ("requestIdleCallback" in window) {
      requestIdleCallback(fetchData);
    } else {
      setTimeout(fetchData, 100);
    }
  }, [user]);

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return (
    <>
      <Layout userName={userName} />
      <div className="dashboard__wrapper">
        <h1>Dashboard</h1>
        <div className="dashboard__container">
          <section className="dashboard-card card--blue">
            <h2 className="dashboard-card__greeting">
              {handleGreeting(firstNameFilter(userName))}
            </h2>
            <p className="dashboard-card__message">
              Here's an overview of your study progress:
            </p>
            {!loading && error && (
              <p className="dashboard-card__error">{error}</p>
            )}
            <Suspense fallback={<DashboardOverviewSkeleton />}>
              {loading ? (
                <DashboardOverviewSkeleton />
              ) : (
                <DashboardOverviewCard
                  sessions={sessions}
                  notes={notes}
                  flashcards={flashcards}
                  userName={userName}
                />
              )}
            </Suspense>
            <Button variant="orange">
              <Link to="/new-session" className="btn--link">
                New Session
              </Link>
            </Button>
          </section>
          <DashboardQuicklinksCard/>
        </div>
      </div>
    </>
  );
};

export default Dashboard;
