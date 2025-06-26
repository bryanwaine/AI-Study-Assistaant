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
    <div className="bg-[#f5f5f5] dark:bg-[#001826] flex flex-col items-center h-screen overflow-y-auto">
      <div className="fixed top-0 left-0 w-full !py-4 z-50 flex justify-between items-center bg-transparent backdrop-blur-md">
        <div className="flex items-center !ml-4 w-1/2">
          <LogoSm variant="dark" />
        </div>
        <div className="home__navbar-right flex justify-end gap-6 w-1/2 !mr-4 items-center">
          <Link to="/login">
            <Button variant="ghost--orange">Login</Button>
          </Link>
          <Link to="/signup">
            <Button variant="orange">Sign Up</Button>
          </Link>
        </div>
      </div>
      <section className="home__content w-full !px-12 !py-30">
        <h1 className="animate text-4xl font-bold text-[#111111] dark:text-gray-100 !mb-4">
          Study Smarter with AI
        </h1>
        <p className="animate text-lg text-[#111111] dark:text-gray-400 !mb-4">
          Summarize your notes, chat with an AI tutor, and quiz yourself with
          smart flashcards.
        </p>
        <Link to="/signup" className="animate w-full md:w-1/5 !mb-20">
          <Button variant="orange" className="!mt-4 ">
            Get Started
          </Button>
        </Link>
        <div className="md:w-full flex flex-col justify-center items-center gap-8 md:gap-2 !mt-20">
          <div className="flex flex-col md:flex-row md:w-full justify-center items-center">
            <div className="md:h-full flex flex-col justify-center items-center !px-6 ">
              <h2 className="animate text-2xl font-bold text-[#111111] dark:text-gray-100 !mb-4">
                AI Chat Assistant
              </h2>
              <p className="animate md:w-2/3 text-lg text-[#111111] dark:text-gray-400">
                Got a question? Ask about any topic and get instant answers from your AI tutor.
              </p>
            </div>
            <div className="animate home-card__image bg-[url('/images/iPhone-chat-screen.png')] w-full !-mt-16 !md:mt-10" />
          </div>
           <div className="flex flex-col md:flex-row md:w-full justify-center items-center">
            <div className="md:h-full flex flex-col justify-center items-center !px-6 ">
              <h2 className="animate text-2xl font-bold text-[#111111] dark:text-gray-100 !mb-4">
                Smart Notes
              </h2>
              <p className="animate md:w-2/3 text-lg text-[#111111] dark:text-gray-400">
                Upload, summarize, and organise your study notes to make studying easier and more effective.
              </p>
            </div>
            <div className="animate home-card__image bg-[url('/images/iPhone-notes-screen.png')] md:order-first !-mt-16" />
          </div>
           <div className="flex flex-col md:flex-row md:w-full justify-center items-center">
            <div className="md:h-full flex flex-col justify-center items-center !px-6 ">
              <h2 className="animate text-2xl font-bold text-[#111111] dark:text-gray-100 !mb-4">
                Flashcards and Quizzes
              </h2>
              <p className="animate md:w-2/3 text-lg text-[#111111] dark:text-gray-400">
                Create and practice flashcards and quizzes from your notes with AI.
              </p>
            </div>
            <div className="animate home-card__image bg-[url('/images/iPhone-flashcards-screen.png')] !-mt-16" />
          </div>
        </div>
        <Link to="/signup" className="animate w-full md:w-1/5 !mb-20">
          <Button variant="orange" className="!mt-4 !mb-20">
            Start Studying
          </Button>
        </Link>
      </section>
    </div>
  );
};

export default Home;
