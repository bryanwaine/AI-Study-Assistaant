import { useEffect, useRef, useState } from "react";
import Layout from "../components/Layout";
import useAuth from "../hooks/useAuth";
import handleAnthropicError from "../utils/anthropicErrorHandler";
import { getNote } from "../utils/noteService";
import MarkdownRenderer from "../components/MarkdownRenderer";
import { useLocation, useParams } from "react-router";
import Loader from "../components/Loader";
import ContentCopyOutlinedIcon from "@mui/icons-material/ContentCopyOutlined";
import CheckOutlinedIcon from "@mui/icons-material/CheckOutlined";
import StyleOutlinedIcon from "@mui/icons-material/StyleOutlined";
import QuizOutlinedIcon from "@mui/icons-material/QuizOutlined";

const Note = () => {
  const [fetching, setFetching] = useState(false);
  const [summary, setSummary] = useState([]);
  const [metaData, setMetaData] = useState({});
  const [error, setError] = useState(null);

  const [isCopied, setIsCopied] = useState(false);
  const location = useLocation();
  const { user } = useAuth();
  const userName = user?.displayName || location.state?.userName;
  const { noteId } = useParams();
  const aiMessageRef = useRef(null);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  useEffect(() => {
    const fetchNote = async () => {
      setFetching(true);
      try {
        const data = await getNote(user.uid, noteId);
        setSummary(data.summary);
        setMetaData(data.metadata);
      } catch (error) {
        setError(handleAnthropicError(error).message);
      } finally {
        setFetching(false);
      }
    };

    if (user) {
      fetchNote();
    }
  }, [noteId, user]);

  if (!user) return <Navigate to="/login" replace />;

  const handleCopy = () => {
    if (aiMessageRef.current) {
      navigator.clipboard.writeText(aiMessageRef.current.textContent);
    }
    setIsCopied(true);
    setTimeout(() => {
      setIsCopied(false);
    }, 3000);
  };

  return (
    <>
      <Layout userName={userName} />
      <div className="notes-wrapper">
        {fetching && <Loader />}
        {metaData?.title && (
          <div className="notes-title">{metaData.title.toUpperCase()}</div>
        )}
        <div className="notes-container">
          {error && (
            <div className="chat-error-container">
              <p className="error">Something went wrong. Please try again.</p>
            </div>
          )}
          {summary?.map(
            (message) =>
              message.role === "assistant" && (
                <div
                  key={message.id}
                  className={`note-summary ${message.role}`}
                >
                  <div ref={aiMessageRef}>
                    <MarkdownRenderer>{message.content}</MarkdownRenderer>
                  </div>
                </div>
              )
          )}
        </div>
        <div className="notes-wrapper-action-buttons">
          <button
            className="message-copy-button"
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

          <button className="message-copy-button" title="Create flashcards">
            <span>
              <StyleOutlinedIcon style={{ fontSize: ".85rem" }} />
               Flashcards
            </span>
          </button>
          <button className="message-copy-button" title="Ask a question">
            <span>
                          <QuizOutlinedIcon style={{ fontSize: ".85rem" }} />
                          Quiz
            </span>
          </button>
        </div>
      </div>
    </>
  );
};

export default Note;
