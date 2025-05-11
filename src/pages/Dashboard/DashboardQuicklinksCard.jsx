import { Link } from "react-router";
import { NavigateNext } from "@mui/icons-material";

const DashboardQuicklinksCard = () => {
  return (
    <section className="dashboard-card card--blue">
      <h2>Quick Links</h2>
      <div className="dashboard__quicklinks">
        <Link to="/new-session" className="link dashboard__quicklink">
          <p>Ask a Question</p>
          <NavigateNext />
        </Link>
        <Link to="/new-note" className="link dashboard__quicklink">
          <p>Create a Note</p>
          <NavigateNext />
        </Link>
        <Link to="/new-quiz" className="link dashboard__quicklink">
          <p>Take a Quiz</p>
          <NavigateNext />
        </Link>
        <Link to="/new-deck" className="link dashboard__quicklink">
          <p>Create a deck of Flashcards</p>
          <NavigateNext />
        </Link>
      </div>
    </section>
  );
};

export default DashboardQuicklinksCard;
