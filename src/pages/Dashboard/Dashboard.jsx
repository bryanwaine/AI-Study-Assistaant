import { useEffect, useState, lazy, Suspense } from "react";

import { useLocation, Navigate } from "react-router";

import DashboardOverviewSkeleton from "./DashboardOverviewSkeleton";
import DashboardQuicklinksSkeleton from "./DashboardQuickLinksSkeleton";

import Layout from "../../components/Layout";
import Loader from "../../components/Loader/Loader";
import useAuth from "../../hooks/useAuth";
import { getAllSessions } from "../../utils/sessionService";
import handleAnthropicError from "../../utils/anthropicErrorHandler";
import { getAllDecks } from "../../utils/flashcardService";
import { getAllNotes } from "../../utils/noteService";

import "./Dashboard.css";

import "./DashboardSkeleton.css";

// Lazy loaded components
const DashboardOverviewCard = lazy(() => import("./DashboardOverviewCard"));
const DashboardQuicklinksCard = lazy(() => import("./DashboardQuicklinksCard"));

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
        {loading ? (
          <Loader />
        ) : error ? (
          <p>{error}</p>
        ) : (
          <div className="dashboard__container">
            <Suspense fallback={<DashboardOverviewSkeleton />}>
              <DashboardOverviewCard
                sessions={sessions}
                notes={notes}
                flashcards={flashcards}
                userName={userName}
              />
            </Suspense>
            <Suspense fallback={<DashboardQuicklinksSkeleton />}>
              <DashboardQuicklinksCard />
            </Suspense>
          </div>
        )}
      </div>
    </>
  );
};

export default Dashboard;
