import React from 'react'

import MarkdownRenderer from '../../components/MarkdownRenderer'

const NoteContainer = ({ summary, metaData, aiMessageRef}) => {
  return (
    <div className="note__container">
    {metaData?.title && (
      <div className="note__title">{metaData.title.toUpperCase()}</div>
    )}
    <div className="note ">
      {summary?.map(
        (message) =>
          message.role === "assistant" && (
            <div
              key={message.id}
              className={`note__summary ${message.role}`}
            >
              <div ref={aiMessageRef}>
                <MarkdownRenderer>{message.content}</MarkdownRenderer>
              </div>
            </div>
          )
      )}
    </div>
  </div>
  )
}

export default NoteContainer