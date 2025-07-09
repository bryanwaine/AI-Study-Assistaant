import React, { useEffect } from "react";

import MarkdownRenderer from "../../components/MarkdownRenderer";

const NoteContainer = ({ summary, metaData, aiMessageRef }) => {
  useEffect(() => {
    const callback = (entries, slideObserver) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("slide-up");
          slideObserver.unobserve(entry.target);
        }
      });
    };

    const options = {
      threshold: 0.2,
    };

    const slideObserver = new IntersectionObserver(callback, options);

    const slideAnimatedElements = document.querySelectorAll(".animate-slide");
    slideAnimatedElements.forEach((el) => slideObserver.observe(el));
  });
  return (
    <div className="animate-slide note__container">
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
