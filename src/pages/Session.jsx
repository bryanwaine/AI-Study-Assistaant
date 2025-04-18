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

const Session = () => {
  const [question, setQuestion] = useState("");
  const [loading, setLoading] = useState(false);
  const [messages, setMessages] = useState([]);
  const [partialContent, setPartialContent] = useState("");
  const { user } = useAuth();
  const messagesEndRef = useRef(null);

  useEffect(() => {
    window.scrollTo({ top: document.body.scrollHeight, behavior: "smooth" });
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, partialContent]);

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  const onChange = (e) => {
    setQuestion(e.target.value);
  };

  const onSubmit = async () => {
    if (!question.trim()) return;

    const userMessage = {
      id: Date.now(),
      role: "user",
      content: question,
    };
    setLoading(true);
    setMessages((prev) => [...prev, userMessage]);
    setQuestion("");

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
  };
  return (
    <Layout>
      <div className="session-container">
        <div className="chat-header"></div>
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
        <TextArea value={question} onChange={onChange} onSubmit={onSubmit} />
      </div>
    </Layout>
  );
};

export default Session;
