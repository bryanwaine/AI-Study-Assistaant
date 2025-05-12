import { Link } from "react-router";

const DashboardOverviewCard = ({ sessions, notes, flashcards}) => {
  return (
    <div className="dashboard-card__overview">
      <Link to="/sessions" className="link">
        <div className="dashboard-card__item card--white">
          <span className="dashboard-card__item-label">Sessions</span>
          <span className="dashboard-card__item-value">{sessions.length}</span>
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
  );
};

export default DashboardOverviewCard;
