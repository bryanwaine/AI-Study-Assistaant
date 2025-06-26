import React, { useEffect } from "react";

import MarkdownRenderer from "../../components/MarkdownRenderer";

const NoteContainer = ({ summary, metaData, aiMessageRef }) => {
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
    <div className="animate note__container">
      {metaData?.title && (
        <div className="note__title dark:text-gray-100">
          {metaData.title.toUpperCase()}
        </div>
      )}
      <div className="note text-sky-900 dark:text-sky-400">
        {summary?.map(
          (message) =>
            message.role === "assistant" && (
              <div key={message.id} className={`note__summary ${message.role}`}>
                <div ref={aiMessageRef}>
                  <MarkdownRenderer>{message.content}</MarkdownRenderer>
                </div>
              </div>
            )
        )}
      </div>
    </div>
  );
};

export default NoteContainer;
