import { useEffect } from "react";
import { Link } from "react-router";

import Button from "../../components/Button/Button";
import LogoSm from "../../components/LogoSm/LogoSm";

import "./Home.css";

const Home = () => {
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

  return (
    <div className="bg-[#f5f5f5] dark:bg-[#001826] flex flex-col h-screen overflow-y-auto">
      <div className="fixed top-0 left-0 w-full !py-4 z-50 flex justify-between items-center bg-transparent backdrop-blur-md">
        <div className="flex items-center !ml-4 w-1/2">
          <LogoSm variant="dark" />
        </div>
        <div className="home__navbar-right flex justify-end gap-3 w-1/2 !mr-4 items-center">
          <Link to="/login">
            <Button variant="ghost--orange">Login</Button>
          </Link>
          <Link to="/signup">
            <Button variant="orange">Sign Up</Button>
          </Link>
        </div>
      </div>
      <section className="home__content w-full">
        <h1 className="animate text-3xl font-bold text-[#111111] dark:text-gray-100 !mb-4">
          Study Smarter with AI
        </h1>
        <p className="animate text-lg text-[#111111] dark:text-gray-400 !mb-4">
          Summarize your notes, chat with AI tutors, and quiz yourself with
          smart flashcards.
        </p>
        <Link to="/signup" className="animate w-full !mb-10">
          <Button variant="orange" className="!mt-4 ">
            Get Started
          </Button>
        </Link>
        <div className="flex flex-col justify-center items-center gap-8 !mt-10">
          <div className="flex flex-col justify-center items-center">
            <div className="home-card__text">
              <h2 className="animate text-2xl font-bold text-[#111111] dark:text-gray-100 !mb-4">
                AI Chat Assistant
              </h2>
              <p className="animate text-lg text-[#111111] dark:text-gray-400">
                Ask questions and get instant answers.
              </p>
            </div>
            <div className="animate home-card__image !-mt-16" />
          </div>
          <div className="flex flex-col justify-center items-center">
            <div className="home-card__text">
              <h2 className="animate text-2xl font-bold text-[#111111] dark:text-gray-100 !mb-4">
                Smart Notes
              </h2>
              <p className="animate text-lg text-[#111111] dark:text-gray-400">
                Upload, summarize, and organise your study notes.
              </p>
            </div>
            <div className="animate home-card__image !-mt-16" />
          </div>
          <div className="flex flex-col justify-center items-center">
            <div className="home-card__text">
              <h2 className="animate text-2xl font-bold text-[#111111] dark:text-gray-100 !mb-4">
                Flashcards and Quizzes
              </h2>
              <p className="animate text-lg text-[#111111] dark:text-gray-400">
                Upload, summarize, and organise your study notes.
              </p>
            </div>
            <di className="animate home-card__image !-mt-16" />
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
