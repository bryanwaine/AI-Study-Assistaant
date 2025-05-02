import { useState } from "react";
import { generateNoteSummary } from "../anthropic";
import FileUploadProcessor from "../components/FileUploadProcessor/FileUploadProcessor";
import Layout from "../components/Layout";
import TypingIndicator from "../components/TypingIndicator";
import useAuth from "../hooks/useAuth";
import handleAnthropicError from "../utils/anthropicErrorHandler";
import { saveNote, updateNote } from "../utils/noteService";
import MarkdownRenderer from "../components/MarkdownRenderer";
import Button from "../components/Button";

const NewNote = () => {
  const [loading, setLoading] = useState(false);
  const [summary, setSummary] = useState([]);
  const [error, setError] = useState(null);
  const [noteId, setNoteId] = useState(null);
  const [partialContent, setPartialContent] = useState("");
  const [fileUploadProps, setFileUploadProps] = useState({});

  const [title, setTitle] = useState("");
  const { user } = useAuth();
  const userName = user?.displayName || location.state?.userName;

  const onChange = (e) => {
    setTitle(e.target.value);
  };

  const onsubmit = async (fileUploadProps) => {
    const { text, setStatus, setFileName } = fileUploadProps;
    if (!text || !title) {
      console.log("No text or title provided");
      return;
    };
    try {
      const userMessage = {
        id: Date.now(),
        role: "user",
        content: text,
      };
      setTitle("");
      setFileName("");
      setStatus(null);
      setLoading(true);
      const updatedSummary = [...summary, userMessage];
      setSummary(updatedSummary);
      let newNoteId;
      if (!noteId) {
        newNoteId = await saveNote(user.uid, updatedSummary, title);
        setNoteId(newNoteId);
      } else {
        await updateNote(user.uid, noteId || newNoteId, updatedSummary);
      }

      const aiResponse = await generateNoteSummary(text);
      const words = aiResponse.split(" ");
      let currentWord = 0;
      setPartialContent("");
      const aiMessage = {
        id: Date.now() + 1,
        role: "assistant",
        content: aiResponse,
      };
      const finalSummary = [...updatedSummary, aiMessage];

      const interval = setInterval(() => {
        setPartialContent((prev) => prev + words[currentWord] + " ");
        currentWord++;

        if (currentWord >= words.length) {
          clearInterval(interval);
          setSummary(finalSummary);
          setPartialContent("");
          setLoading(false);
        }
      }, 30);
      await updateNote(user.uid, noteId || newNoteId, finalSummary);
    } catch (error) {
      setError(handleAnthropicError(error).message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Layout userName={userName} />
      <div className="notes-wrapper">
        <FileUploadProcessor
          onExtractedText={(text, setFileName, setStatus) =>
            setFileUploadProps({
              text,
              setFileName,
              setStatus,
            })
          }
        />
        <div className="input-container">
          <label htmlFor="title">Title</label>
          <input
            type="text"
            name="topic"
            placeholder="Enter a title for your notes"
            id="title"
            value={title}
            onChange={onChange}
            required
          />
        </div>
        <Button
          variant="orange"
          disabled={!fileUploadProps.text || !title}
          onClick={() => onsubmit(fileUploadProps)}
        >
          {loading ? "Generating summary..." : "Generate summary"}  
        </Button>
        <div className="notes-container">
          {loading && <TypingIndicator />}
          {summary.map(
            (obj) =>
              obj.role === "assistant" && (
                <div key={obj.id} className={`note-summary ${obj.role}`}>
                  <div>
                    <MarkdownRenderer>{obj.content}</MarkdownRenderer>
                  </div>
                </div>
              )
          )}
          {partialContent && (
            <div>
              <MarkdownRenderer>{partialContent}</MarkdownRenderer>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default NewNote;
