import { Link } from "react-router";

import "./Home.css";

import Button from "../../components/Button/Button";
import LogoSm from "../../components/LogoSm/LogoSm";

const Home = () => {
  return (
    <div className="home__container">
      <div className="home__navbar">
        <div className="home__navbar-left">
          <LogoSm variant="dark" />
        </div>
        <div className="home__navbar-right">
          <Link to="/login">
            <Button variant="light">Login</Button>
          </Link>
          <Link to="/signup">
            <Button variant="orange">Sign Up</Button>
          </Link>
        </div>
      </div>
      <section className="home__content">
        <h1 className="home__content-title">Study Smarter with AI</h1>
        <p className="home__content-subtitle">
          Summarize your notes, chat with AI tutors, and quiz yourself with
          smart flashcards.
        </p>
        <Link to="/signup">
          <Button variant="orange">Get Started</Button>
        </Link>
        <div className="home-cards__container">
          <div className="home-card card--blue">
            <h2 className="home-card__title">AI Chat Assistant</h2>
            <p className="home-card__description">Ask questions and get instant answers.</p>
          </div>
          <div className="home-card card--blue">
            <h2 className="home-card__title">Smart Notes</h2>
            <p className="home-card__description">Upload, summarize, and organise your study notes.</p>
          </div>
          <div className="home-card card--blue">
            <h2 className="home-card__title">Flashcards and Quizzes</h2>
            <p className="home-card__description">Auto-generate flashcards and quizzes from your notes.</p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
