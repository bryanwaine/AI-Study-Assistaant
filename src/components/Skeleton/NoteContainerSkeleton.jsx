import React from "react";

import "./Skeleton.css";

const NoteContainerSkeleton = () => {
  const renderSkeletonParagraphs = () => {
    let paragraphs = [];
    for (let i = 0; i < 25; i++) {
      paragraphs.push(<p className="skeleton skeleton__paragraph" key={i}/>);
    }
    return paragraphs;
  };
  return (
    <div className="note__container">
      <div className="skeleton skeleton__title note__title" />
      <div className="note">{renderSkeletonParagraphs()}</div>
      <div className="skeleton skeleton__footer action-buttons-wrapper" />
    </div>
  );
};

export default NoteContainerSkeleton;
