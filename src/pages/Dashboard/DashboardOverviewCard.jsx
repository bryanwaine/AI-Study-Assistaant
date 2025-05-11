import { Link } from "react-router";

import Button from "../../components/Button/Button";
import handleGreeting from "../../utils/greetingHandler";
import firstNameFilter from "../../utils/firstNameFilter";

const DashboardOverviewCard = ({ sessions, notes, flashcards, userName }) => {
  return (
    <section className="dashboard-card card--blue">
      <h2 className="dashboard-card__greeting">
        {handleGreeting(firstNameFilter(userName))}
      </h2>
      <p className="dashboard-card__message">
        Here's an overview of your study progress:
      </p>
      <div className="dashboard-card__overview">
        <Link to="/sessions" className="link">
          <div className="dashboard-card__item card--white">
            <span className="dashboard-card__item-label">Sessions</span>
            <span className="dashboard-card__item-value">
              {sessions.length}
            </span>
          </div>
        </Link>
        <Link to="/notes" className="link">
          <div className="dashboard-card__item card--white">
            <span className="dashboard-card__item-label">Notes</span>
            <span className="dashboard-card__item-value">{notes.length}</span>
          </div>
        </Link>
        <Link to="/decks" className="link">
          <div className="dashboard-card__item card--white">
            <span className="dashboard-card__item-label">Decks</span>
            <span className="dashboard-card__item-value">
              {flashcards.length}
            </span>
          </div>
        </Link>
        <Link to="/quizzes" className="link">
          <div className="dashboard-card__item card--white">
            <span className="dashboard-card__item-label">Quizzes</span>
            <span className="dashboard-card__item-value">0</span>
          </div>
        </Link>
      </div>
      <Button variant="orange">
        <Link to="/new-session" className="btn--link">
          New Session
        </Link>
      </Button>
    </section>
  );
};

export default DashboardOverviewCard;
