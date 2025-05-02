import { useEffect, useState } from "react";
import Layout from "../components/Layout";
import useAuth from "../hooks/useAuth";
import handleAnthropicError from "../utils/anthropicErrorHandler";
import { getNote } from "../utils/noteService";
import MarkdownRenderer from "../components/MarkdownRenderer";
import { useLocation, useParams } from "react-router";
import Loader from "../components/Loader";

const Note = () => {
  const [fetching, setFetching] = useState(false);
  const [summary, setSummary] = useState([]);
  const [metaData, setMetaData] = useState({});
  const [error, setError] = useState(null);

  const location = useLocation();
  const { user } = useAuth();
  const userName = user?.displayName || location.state?.userName;
  const { noteId } = useParams();

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

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);
    

  if (!user) return <Navigate to="/login" replace />;

  return (
    <>
      <Layout userName={userName} />
      <div className="notes-wrapper">
        {fetching && <Loader />}
       { metaData?.title && <div className="notes-title">{metaData.title.toUpperCase()}</div>}
        <div className="notes-container">
          {error && (
            <div className="chat-error-container">
              <p className="error">Something went wrong. Please try again.</p>
            </div>
          )}
          {summary?.map(
            (obj) =>
              obj.role === "assistant" && (
                <div key={obj.id} className={`note-summary ${obj.role}`}>
                  <div>
                    <MarkdownRenderer>{obj.content}</MarkdownRenderer>
                  </div>
                </div>
              )
          )}
        </div>
      </div>
    </>
  );
};

export default Note;
