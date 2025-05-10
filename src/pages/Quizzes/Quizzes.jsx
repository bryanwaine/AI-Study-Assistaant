import EmptyState from "../../components/EmptyState/EmptyState";
import Layout from "../../components/Layout";
import useAuth from "../../hooks/useAuth";

import './Quizzes.css';

const Quizzes = () => {
  const { user } = useAuth();
  const userName = user?.displayName || location.state?.userName;
  return (
    <div className="quizzes__wrapper">
      <Layout userName={userName} />
      <div className="quizzes__container">
        <h1>Your Quizzes</h1>
        <EmptyState page="quizzes" />
      </div>
    </div>
  );
};

export default Quizzes;
