import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import CodeBlock from "./CodeBlock";
import rehypeHighlight from "rehype-highlight";
import "highlight.js/styles/github.css";

const MarkdownRenderer = (props) => {
  const { children } = props;
  return (
    // <ReactMarkdown
    //  remarkPlugins={[remarkGfm]}
    //   skipHtml
    //   components={{
    //     code({ inline, className, children, ...props }) {
    //       const match = /language-(\w+)/.exec(className || "");
    //       const language = match?.[1];
    //       return !inline ? (
    //         <CodeBlock language={language} value={String(children).trim()} />
    //       ) : (
    //         <code className={className} {...props}>
    //           {children}
    //         </code>
    //       );
    //     },
    //     p: ({ children }) => {
    //       // Check if children include only a code block, then don't wrap in <p>
    //       const isCodeBlockOnly =
    //         children.length === 1 && children[0]?.type === "code";
    //       return isCodeBlockOnly ? <>{children}</> : <p>{children}</p>;
    //     },
    //   }}
    // >
    //   {children}
    // </ReactMarkdown>
    <ReactMarkdown
      remarkPlugins={[remarkGfm]}
      rehypePlugins={[rehypeHighlight]}
      components={{
        code: CodeBlock,
      }}
      children={children}
    />
  );
};

export default MarkdownRenderer;
