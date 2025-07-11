import { useEffect, useRef, useState } from "react";

import { Navigate, useParams } from "react-router";
import "highlight.js/styles/github.css";

import TypingIndicator from "../../components/TypingIndicator/TypingIndicator";
import Loader from "../../components/Loader/Loader";
import ScrollToBottom from "../../components/ScrollToBottom/ScrollToBottom";
import ErrorState from "../../components/ErrorState/ErrorState";
import Layout from "../../components/Layout";
import TextArea from "../../components/TextArea/TextArea";
import ActionButtons from "../../components/ActionButtons/ActionButtons";
import MarkdownRenderer from "../../components/MarkdownRenderer";
import useAuth from "../../hooks/useAuth";
import handleAnthropicError from "../../utils/anthropicErrorHandler";
import { getSession, updateSession } from "../../utils/sessionService";
import { generateResponse } from "../../anthropic";

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
    <div className="session__wrapper">
      {fetching && <Loader />}
      <Layout userName={userName} />
      <div className="animate-slide session__container">
        <div className="chat-window" ref={chatWindowRef}>
          {messages.map((message) => (
            <div
              key={message.id}
              className={`chat-message ${message.role} ${message.role === "assistant" && "dark:text-gray-100"}`}
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
            <span className="chat-message assistant dark:text-gray-100">
              <MarkdownRenderer>{partialContent}</MarkdownRenderer>
            </span>
          )}
          {error && <ErrorState error={error} onResubmit={onResubmit} />}
          <div ref={messagesEndRef} />
          {loading && (
            <div className="chat-window__loading">
              <TypingIndicator />
            </div>
          )}
        </div>
      </div>
      <div className="fixed bottom-0 left-0 md:left-[20%] right-0 z-20 h-[8.75rem] ">
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
    </div>
  );
};

export default Session;
