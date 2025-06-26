import { useEffect } from "react";
import BubbleBackground from "../../components/BubbleBg";
import EmptyState from "../../components/EmptyState/EmptyState";
import Layout from "../../components/Layout";
import useAuth from "../../hooks/useAuth";

import './Quizzes.css';

const Quizzes = () => {
  const { user } = useAuth();
  const userName = user?.displayName || location.state?.userName;

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
    <div className="quizzes__wrapper">
      <Layout userName={userName} />
       <BubbleBackground />
      <div className="animate quizzes__container">
        <h1 className=" dark:text-gray-100 text-3xl !mb-6">Your Quizzes</h1>
        <EmptyState page="quizzes" />
      </div>
    </div>
  );
};

export default Quizzes;
