import EmptyState from "../components/EmptyState/EmptyState";
import Layout from "../components/Layout";
import useAuth from "../hooks/useAuth";

const Quizzes = () => {
  const { user } = useAuth();
  const userName = user?.displayName || location.state?.userName;
  return (
    <>
      <Layout userName={userName} />
      <div className="sessions-container">
        <h1>Your Quizzes</h1>
        <EmptyState page="quizzes" />
      </div>
    </>
  );
};

export default Quizzes;
