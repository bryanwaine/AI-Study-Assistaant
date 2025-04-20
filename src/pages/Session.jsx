import { useEffect, useRef, useState } from "react";
import { Navigate } from "react-router";
import { generateResponse } from "../anthropic";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeHighlight from "rehype-highlight";
import "highlight.js/styles/github.css";
import TypingIndicator from "../components/TypingIndicator";
import Layout from "../components/Layout";
import useAuth from "../hooks/useAuth";
import TextArea from "../components/TextArea";
import handleAnthropicError from "../utils/anthropicErrorHandler";
import Button from "../components/Button";
import CodeBlock from "../components/CodeBlock";

const Session = () => {
  const [question, setQuestion] = useState("");
  const [loading, setLoading] = useState(false);
  const [messages, setMessages] = useState([]);
  const [error, setError] = useState(null);
  const [partialContent, setPartialContent] = useState("");
  const { user } = useAuth();
  const messagesEndRef = useRef(null);
  const scrollToQuestionRef = useRef(false);

  useEffect(() => {
    window.scrollTo({ top: document.body.scrollHeight, behavior: "smooth" });
  }, []);

  useEffect(() => {
    if (scrollToQuestionRef.current) {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }
    scrollToQuestionRef.current = false;
  }, [messages]);

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  const onChange = (e) => {
    setQuestion(e.target.value);
  };

  const onSubmit = async () => {
    if (!question.trim()) return;

    try {
      const userMessage = {
        id: Date.now(),
        role: "user",
        content: question,
      };
      setLoading(true);
      setMessages((prev) => [...prev, userMessage]);
      setQuestion("");
      scrollToQuestionRef.current = true;

      const aiResponse = await generateResponse(question, messages);
      const words = aiResponse.split(" ");
      let currentWord = 0;
      setPartialContent("");

      const interval = setInterval(() => {
        setPartialContent((prev) => prev + words[currentWord] + " ");
        currentWord++;

        if (currentWord >= words.length) {
          clearInterval(interval);
          const aiMessage = {
            id: Date.now() + 1,
            role: "assistant",
            content: aiResponse,
          };
          setMessages((prev) => [...prev, aiMessage]);
          setPartialContent("");
          setLoading(false);
        }
      }, 30);
    } catch (error) {
      setError(handleAnthropicError(error).message);
      setLoading(false);
    }
  };

  return (
    <div className="session-wrapper">
      <Layout />
      <div className="session-container">
        <div className="chat-window">
          {messages.map((message) => (
            <div key={message.id} className={`chat-message ${message.role}`}>
              <div>
                {message.role === "user" ? (
                  <p>{message.content}</p>
                ) : (
                  <ReactMarkdown
                    remarkPlugins={[remarkGfm]}
                    rehypePlugins={[rehypeHighlight]}
                    components={{
                      code: CodeBlock,
                    }}
                    children={message.content}
                  />
                )}
              </div>
            </div>
          ))}
          {partialContent && (
            <div className="chat-message assistant typing-cursor">
              <ReactMarkdown
                remarkPlugins={[remarkGfm]}
                rehypePlugins={[rehypeHighlight]}
              >
                {partialContent}
              </ReactMarkdown>
            </div>
          )}
          <div ref={messagesEndRef} />
          {loading && <TypingIndicator />}
        </div>
        {error && (
          <div className="chat-error-container">
            <p className="error">{error}</p>
            <Button variant="orange">Retry</Button>
          </div>
        )}
      </div>
      <TextArea
        value={question}
        onChange={onChange}
        onSubmit={onSubmit}
        loading={loading}
      />
    </div>
  );
};

export default Session;
