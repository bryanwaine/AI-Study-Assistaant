import { Link } from "react-router";

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
            <button className="btn btn-light">Login</button>
          </Link>
          <Link to="/signup">
            <button className="btn btn-blue">Sign Up</button>
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
            <button className="btn btn-blue">Get Started</button>
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
