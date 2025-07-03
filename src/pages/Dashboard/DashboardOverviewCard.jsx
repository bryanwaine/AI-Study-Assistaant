import React from "react";
import { Link } from "react-router";

const DashboardOverviewCard = ({ sessions, notes, flashcards}) => {
  return (
    <div className="dashboard-card__overview">
      <Link to="/sessions" className="link">
        <div className=" flex flex-col items-center gap-2 !p-2 !h-[5rem] rounded-xl bg-neutral-100 dark:bg-gray-100/10 backdrop-blur shadow-md border border-neutral-200 dark:border-none">
          <span className="text-sm font-light text-sky-900 dark:text-sky-400 ">Sessions</span>
          <span className="text-2xl font-bold text-neutral-900 dark:text-gray-100">{sessions.length}</span>
        </div>
      </Link>
      <Link to="/notes" className="link">
         <div className=" flex flex-col items-center gap-2 !p-2 !h-[5rem] rounded-xl bg-neutral-100 dark:bg-gray-100/10 backdrop-blur shadow-md border border-neutral-200 dark:border-none">
          <span className="text-sm font-light text-sky-900 dark:text-sky-400 ">Notes</span>
          <span className="text-2xl font-bold text-neutral-900 dark:text-gray-100">{notes.length}</span>
        </div>
      </Link>
      <Link to="/decks" className="link">
        <div className=" flex flex-col items-center gap-2 !p-2 !h-[5rem] rounded-xl bg-neutral-100 dark:bg-gray-100/10 backdrop-blur shadow-md border border-neutral-200 dark:border-none">
          <span className="text-sm font-light text-sky-900 dark:text-sky-400 ">Decks</span>
          <span className="text-2xl font-bold text-neutral-900 dark:text-gray-100">
            {flashcards.length}
          </span>
        </div>
      </Link>
      <Link to="/quizzes" className="link">
       <div className=" flex flex-col items-center gap-2 !p-2 !h-[5rem] rounded-xl bg-neutral-100 dark:bg-gray-100/10 backdrop-blur shadow-md border border-neutral-200 dark:border-none">
          <span className="text-sm font-light text-sky-900 dark:text-sky-400 ">Quizzes</span>
          <span className="text-2xl font-bold text-neutral-900 dark:text-gray-100">0</span>
        </div>
      </Link>
    </div>
  );
};

export default DashboardOverviewCard;
