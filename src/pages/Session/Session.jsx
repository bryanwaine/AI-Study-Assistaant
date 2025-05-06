import { useEffect, useRef, useState } from "react";
import { Navigate, useParams } from "react-router";
import { generateResponse } from "../../anthropic";
import "highlight.js/styles/github.css";
import TypingIndicator from "../../components/TypingIndicator/TypingIndicator";
import Layout from "../../components/Layout";
import useAuth from "../../hooks/useAuth";
import TextArea from "../../components/TextArea/TextArea";
import handleAnthropicError from "../../utils/anthropicErrorHandler";
import { getSession, updateSession } from "../../utils/sessionService";
import MarkdownRenderer from "../../components/MarkdownRenderer";
import ContentCopyOutlinedIcon from "@mui/icons-material/ContentCopyOutlined";
import CheckOutlinedIcon from "@mui/icons-material/CheckOutlined";
import Loader from "../../components/Loader/Loader";
import ScrollToBottom from "../../components/ScrollToBottom/ScrollToBottom";
import ErrorState from "../../components/ErrorState/ErrorState";
import "./Session.css";
const Session = () => {
  const [question, setQuestion] = useState("");
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(false);
  const [messages, setMessages] = useState([]);
  const [error, setError] = useState(null);
  const [retry, setRetry] = useState(null);
  const [partialContent, setPartialContent] = useState("");
  const [showScrollToBottom, setShowScrollToBottom] = useState(false);
  const [sessionId, setSessionId] = useState(null);
  const [isCopied, setIsCopied] = useState(false);
  const { user } = useAuth();
  const userName = user?.displayName || location.state?.userName;
  const messagesEndRef = useRef(null);
  const scrollToQuestionRef = useRef(false);
  const chatWindowRef = useRef(null);
  const aiMessageRef = useRef(null);
  const params = useParams();
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    const fetchSession = async () => {
      setFetching(true);
      try {
        const data = await getSession(user.uid, params.sessionId);
        setMessages(data.messages);
        setFetching(false);
      } catch (error) {
        setFetching(false);
        setError(handleAnthropicError(error).message);
      }
    };

    if (user) {
      fetchSession();
    }

    fetchSession();
  }, [params, user]);

  useEffect(() => {
    window.scrollTo({ top: document.body.scrollHeight, behavior: "smooth" });
  }, []);

  useEffect(() => {
    if (scrollToQuestionRef.current) {
      scrollToBottom();
    }
    scrollToQuestionRef.current = false;
  }, [messages]);

  useEffect(() => {
    if (error) {
      scrollToBottom();
    }
  }, [error]);

  useEffect(() => {
    const handleScroll = () => {
      const el = chatWindowRef.current;
      if (!el) return;
      const nearBottom = el.scrollHeight - el.scrollTop - el.clientHeight < 100;
      setShowScrollToBottom(!nearBottom);
    };

    const chatWindow = chatWindowRef.current;
    if (chatWindow) {
      chatWindow.addEventListener("scroll", handleScroll);
    }

    return () => {
      if (chatWindow) {
        chatWindow.removeEventListener("scroll", handleScroll);
      }
    };
  }, []);

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  const handleCopy = () => {
    if (aiMessageRef.current) {
      navigator.clipboard.writeText(aiMessageRef.current.textContent);
    }
    setIsCopied(true);
    setTimeout(() => {
      setIsCopied(false);
    }, 3000);
  };

  const onChange = (e) => {
    setQuestion(e.target.value);
  };

  const onSubmit = async (question) => {
    setError(false);
    if (!question.trim()) return;

    try {
      const userMessage = {
        id: Date.now(),
        role: "user",
        content: question,
      };

      setQuestion("");
      setLoading(true);
      const updatedMessages = [...messages, userMessage];
      setMessages(updatedMessages);
      scrollToQuestionRef.current = true;
      let newSessionId;
      if (!sessionId) {
        newSessionId = params.sessionId;
        setSessionId(newSessionId);
      }
      await updateSession(user.uid, sessionId || newSessionId, updatedMessages);

      const aiResponse = await generateResponse(question, updatedMessages);
      const words = aiResponse.split(" ");
      let currentWord = 0;
      setPartialContent("");
      const aiMessage = {
        id: Date.now() + 1,
        role: "assistant",
        content: aiResponse,
      };
      const finalMessages = [...updatedMessages, aiMessage];

      const interval = setInterval(() => {
        setPartialContent((prev) => prev + words[currentWord] + " ");
        currentWord++;

        if (currentWord >= words.length) {
          clearInterval(interval);
          setMessages(finalMessages);
          setPartialContent("");
          setLoading(false);
        }
      }, 30);
      await updateSession(user.uid, sessionId || newSessionId, finalMessages);
    } catch (error) {
      setError(handleAnthropicError(error).message);
    } finally {
      setLoading(false);
      setRetry(question);
    }
  };

  const onResubmit = () => {
    setError(false);
    messages.pop();
    onSubmit(retry);
  };

  return (
    <div className="session-wrapper">
      {fetching && <Loader />}
      <Layout userName={userName} />
      <div className="session-container">
        <div className="chat-window" ref={chatWindowRef}>
          {messages.map((message) => (
            <div key={message.id} className={`chat-message ${message.role}`}>
              <div ref={message.role === "assistant" ? aiMessageRef : null}>
                {message.role === "user" ? (
                  <p>{message.content}</p>
                ) : (
                  <MarkdownRenderer>{message.content}</MarkdownRenderer>
                )}
              </div>
              {message.role === "assistant" && (
                <span>
                  <button
                    className="action-button"
                    onClick={() => handleCopy()}
                    title="Copy code"
                  >
                    {isCopied ? (
                      <span>
                        <CheckOutlinedIcon style={{ fontSize: ".85rem" }} />
                        Copied!
                      </span>
                    ) : (
                      <span>
                        <ContentCopyOutlinedIcon
                          style={{ fontSize: ".85rem" }}
                        />{" "}
                        Copy
                      </span>
                    )}
                  </button>
                </span>
              )}
            </div>
          ))}
          {partialContent && (
            <div className="chat-message assistant typing-cursor">
              <MarkdownRenderer>{partialContent}</MarkdownRenderer>
            </div>
          )}
          {error && <ErrorState error={error} onResubmit={onResubmit} />}
          <div ref={messagesEndRef} />
          {loading && <TypingIndicator />}
        </div>
      </div>
      <ScrollToBottom
        showScrollToBottom={showScrollToBottom}
        scrollToBottom={scrollToBottom}
      />
      <TextArea
        value={question}
        onChange={onChange}
        onSubmit={() => onSubmit(question)}
        loading={loading}
      />
    </div>
  );
};

export default Session;
