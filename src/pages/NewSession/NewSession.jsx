import { useEffect, useRef, useState } from "react";

import { Navigate } from "react-router";
import ContentCopyOutlinedIcon from "@mui/icons-material/ContentCopyOutlined";
import CheckOutlinedIcon from "@mui/icons-material/CheckOutlined";
import "highlight.js/styles/github.css";

import TypingIndicator from "../../components/TypingIndicator/TypingIndicator";
import Layout from "../../components/Layout";
import TextArea from "../../components/TextArea/TextArea";
import MarkdownRenderer from "../../components/MarkdownRenderer";
import ScrollToBottom from "../../components/ScrollToBottom/ScrollToBottom";
import ErrorState from "../../components/ErrorState/ErrorState";
import { generateResponse } from "../../anthropic";
import useAuth from "../../hooks/useAuth";
import handleAnthropicError from "../../utils/anthropicErrorHandler";
import { saveSession, updateSession } from "../../utils/sessionService";

import "./NewSession.css";
import ActionButtons from "../../components/ActionButtons/ActionButtons";
const NewSession = () => {
  const [question, setQuestion] = useState("");
  const [loading, setLoading] = useState(false);
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
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const welcomeMessage = [
    {
      id: Date.now(),
      role: "assistant",
      content:
        "👋 Hi there! I'm Auxiliaire, your AI study assistant. How can I help you today?",
    },
  ];

  const renderWelcomeMessage = () => {
    const words = welcomeMessage[0].content.split(" ");
    let currentWord = 0;
    setPartialContent("");

    const interval = setInterval(() => {
      setPartialContent((prev) => prev + " " + words[currentWord] + " ");
      currentWord++;

      if (currentWord >= words.length) {
        clearInterval(interval);
        setMessages(welcomeMessage);
        setPartialContent("");
      }
    }, 100);
  };

  useEffect(() => {
    renderWelcomeMessage();
    window.scrollTo({ top: 0, behavior: "smooth" });
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
        newSessionId = await saveSession(user.uid, updatedMessages);
        setSessionId(newSessionId);
      } else {
        await updateSession(
          user.uid,
          sessionId || newSessionId,
          updatedMessages
        );
      }

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
        setPartialContent((prev) => prev + " " + words[currentWord] + " ");
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
    <div className="new-session__wrapper">
      <Layout userName={userName} />
      <div className="animate new-session__container">
        <div className="new-chat-window" ref={chatWindowRef}>
          {messages.map((message) => (
            <div
              key={message.id}
              className={`new-chat-message ${message.role} dark:text-gray-100`}
            >
              <div ref={message.role === "assistant" ? aiMessageRef : null}>
                {message.role === "user" ? (
                  <p>{message.content}</p>
                ) : (
                  <MarkdownRenderer>{message.content}</MarkdownRenderer>
                )}
              </div>
              {message.role === "assistant" && (
                <ActionButtons handleCopy={handleCopy} isCopied={isCopied} />
              )}
            </div>
          ))}
          {partialContent && (
            <div className="new-chat-message assistant dark:text-gray-100">
              <MarkdownRenderer>{partialContent}</MarkdownRenderer>
            </div>
          )}
          {error && <ErrorState error={error} onResubmit={onResubmit} />}
          <div ref={messagesEndRef} />
          {loading && (
            <div className="new-chat-window__loading">
              <TypingIndicator />
            </div>
          )}
        </div>
        <ScrollToBottom
          showScrollToBottom={showScrollToBottom}
          scrollToBottom={scrollToBottom}
        />
      </div>
      <TextArea
        value={question}
        onChange={onChange}
        onSubmit={() => onSubmit(question)}
        loading={loading}
      />
    </div>
  );
};

export default NewSession;
