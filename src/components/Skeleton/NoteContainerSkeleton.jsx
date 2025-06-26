import React, { useEffect } from "react";

import "./Skeleton.css";

const NoteContainerSkeleton = () => {
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
  const renderSkeletonParagraphs = () => {
    let paragraphs = [];
    for (let i = 0; i < 25; i++) {
      paragraphs.push(<p className="skeleton skeleton__paragraph" key={i} />);
    }
    return paragraphs;
  };
  return (
    <div className="animate note__container">
      <div className="skeleton skeleton__title note__title" />
      <div className="note">{renderSkeletonParagraphs()}</div>
      <div className="skeleton skeleton__footer action-buttons-wrapper" />
    </div>
  );
};

export default NoteContainerSkeleton;
