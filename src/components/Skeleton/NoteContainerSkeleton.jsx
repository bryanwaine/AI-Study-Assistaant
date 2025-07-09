import React, { useEffect } from "react";

import "./Skeleton.css";

const NoteContainerSkeleton = () => {
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
  const renderSkeletonParagraphs = () => {
    let paragraphs = [];
    for (let i = 0; i < 25; i++) {
      paragraphs.push(<p className="skeleton skeleton__paragraph" key={i} />);
    }
    return paragraphs;
  };
  return (
    <div className="animate-slide note__container">
      <div className="skeleton skeleton__title note__title" />
      <div className="note">{renderSkeletonParagraphs()}</div>
      <div className="skeleton skeleton__footer action-buttons-wrapper" />
    </div>
  );
};

export default NoteContainerSkeleton;
