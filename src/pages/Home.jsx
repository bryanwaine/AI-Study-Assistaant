import { Link } from "react-router";
import Button from "../components/Button";

const Home = () => {
  return (
    <div className="home-container">
      <div className="home-navbar">
        <div className="home-navbar-left">
          <Link to="/" className="logo-container">
            <p className="logo home-logo">
              <span>Ai</span>demy
            </p>
            <p className="tagline home-tagline">Your AI Study Assistant</p>
          </Link>
        </div>
        <div className="home-navbar-right">
          <Link to="/login">
            <Button variant="secondary">Login</Button>
          </Link>
          <Link to="/signup">
            <Button variant="primary" >Sign Up</Button>
          </Link>
        </div>
      </div>
      <section className="home-content">
        <h1>Study Smarter with AI</h1>
        <p>
          Organise your notes, chat with AI tutors, and quiz yourself with smart
          flashcards.
        </p>
        <Link to="/signup">
            <Button variant="primary" >Get Started</Button>
          </Link>
        <div className="home-cards-container">
          <div className="home-card">
            <h2>AI Chat Assistant</h2>
            <p>Ask questions and get instant answers.</p>
          </div>
          <div className="home-card">
            <h2>Smart Notes</h2>
            <p>Take, summarize, and organise your study notes.</p>
          </div>
          <div className="home-card">
            <h2>Flashcards and Quizzes</h2>
            <p>Auto-generate flashcards and quizzes from your notes.</p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
