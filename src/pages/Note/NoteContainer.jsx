import React from 'react'

import ContentCopyOutlinedIcon from "@mui/icons-material/ContentCopyOutlined";
import CheckOutlinedIcon from "@mui/icons-material/CheckOutlined";
import StyleOutlinedIcon from "@mui/icons-material/StyleOutlined";
import QuizOutlinedIcon from "@mui/icons-material/QuizOutlined";

import MarkdownRenderer from '../../components/MarkdownRenderer'

const NoteContainer = ({ summary, metaData, isCopied, handleCopy, aiMessageRef, handleCreateFlashcards, handleCreateQuiz}) => {
  return (
    <div className="note__container">
    {metaData?.title && (
      <div className="note__title">{metaData.title.toUpperCase()}</div>
    )}
    <div className="note  card--blue">
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
    <div className="action-buttons-wrapper">
      <button
        className="action-button"
        onClick={() => handleCopy()}
        title="Copy code"
      >
        {isCopied ? (
          <span>
            <CheckOutlinedIcon style={{ fontSize: ".85rem" }} /> Copied!
          </span>
        ) : (
          <span>
            <ContentCopyOutlinedIcon style={{ fontSize: ".85rem" }} />
            Copy
          </span>
        )}
      </button>

      <button
        className="action-button"
        title="Create flashcards"
        onClick={handleCreateFlashcards}
      >
        <span>
          <StyleOutlinedIcon style={{ fontSize: ".85rem" }} />
          Flashcards
        </span>
      </button>
      <button
        className="action-button"
        title="Create quiz"
        onClick={handleCreateQuiz}
      >
        <span>
          <QuizOutlinedIcon style={{ fontSize: ".85rem" }} />
          Quiz
        </span>
      </button>
    </div>
  </div>
  )
}

export default NoteContainer