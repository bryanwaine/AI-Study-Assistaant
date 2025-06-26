import { useEffect, useState, lazy, Suspense } from "react";

import { useLocation, Navigate, Link } from "react-router";

import DashboardOverviewSkeleton from "../../components/Skeleton/DashboardOverviewSkeleton";
import DashboardQuicklinksCard from "./DashboardQuicklinksCard";

import Button from "../../components/Button/Button";
import Layout from "../../components/Layout";
import ErrorState from "../../components/ErrorState/ErrorState";
import useAuth from "../../hooks/useAuth";
import { getAllSessions } from "../../utils/sessionService";
import handleAnthropicError from "../../utils/anthropicErrorHandler";
import { getAllDecks } from "../../utils/flashcardService";
import { getAllNotes } from "../../utils/noteService";
import handleGreeting from "../../utils/greetingHandler";
import firstNameFilter from "../../utils/firstNameFilter";

import "./Dashboard.css";
import BubbleBackground from "../../components/BubbleBg";

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

  useEffect(() => {
      const callback = (entries, observer) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("slide-up");
            observer.unobserve(entry.target);
          }
        });
      };
  
      const options = {
        threshold: 0.2,
      };
  
      const observer = new IntersectionObserver(callback, options);
  
      const animatedElements = document.querySelectorAll(".animate");
      animatedElements.forEach((el) => observer.observe(el));
    });

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return (
    <>
      <Layout userName={userName} />
      <div className="dashboard__wrapper ">
        <BubbleBackground />
        <h1 className="animate dark:text-gray-100 text-3xl !mb-6">Dashboard</h1>
        <div className="dashboard__container">
          <section className="animate dashboard-card rounded-xl bg-sky-100/20 dark:bg-neutral-100/10 border  border-sky-200/50 dark:border-none  backdrop-blur shadow-md ">
            <h2 className="dashboard-card__greeting dark:text-gray-100 ">
              {handleGreeting(firstNameFilter(userName))}
            </h2>
            <p className="dashboard-card__message dark:text-gray-100 ">
              Here's an overview of your study progress:
            </p>
            <Suspense fallback={<DashboardOverviewSkeleton />}>
              {loading ? (
                <DashboardOverviewSkeleton />
              ) : error ? (
                <ErrorState error={error} />
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
          <DashboardQuicklinksCard className="animate" />
        </div>
      </div>
    </>
  );
};

export default Dashboard;
