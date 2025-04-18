import { Navigate } from "react-router";
import Layout from "../components/Layout";
import useAuth from "../hooks/useAuth";
import TextArea from "../components/TextArea";
import { useEffect, useState } from "react";
    
const Session = () => {
    const [question, setQuestion] = useState("");
    const { user } = useAuth();

    useEffect(() => {
        window.scrollTo({top: document.body.scrollHeight, behavior: 'smooth'});
    }, []);

    if (!user) {
        return <Navigate to="/login" replace />;
    }

    
    
    const onChange = (e) => {
        setQuestion(e.target.value);
    };
    const onSubmit = () => {
        console.log(question);
        setQuestion("");
    };
  return (
    <Layout>
          <div className="session-container">
              <div className="chat-container"></div>
              <TextArea
                  value={question}
                  onChange={onChange}
                  onSubmit={onSubmit}
              />
      </div>
    </Layout>
  );
};

export default Session;
