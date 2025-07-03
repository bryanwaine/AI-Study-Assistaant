import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeHighlight from "rehype-highlight";

import CodeBlock from "./CodeBlock/CodeBlock";

import "highlight.js/styles/github.css";

const MarkdownRenderer = (props) => {
  const { children } = props;
  return (
    <ReactMarkdown
      remarkPlugins={[remarkGfm]}
      rehypePlugins={[rehypeHighlight]}
      components={{
        code: CodeBlock,
        p: ({ children }) => {
          // Check if children include only a code block, then don't wrap in <p>
          const isCodeBlockOnly =
            children.length === 1 && children[0]?.type === "code";
          return isCodeBlockOnly ? <>{children}</> : <p>{children}</p>;
        },
      }}
      children={children}
    />
  );
};

export default MarkdownRenderer;
