import { useRef, useState } from "react";

import ContentCopyOutlinedIcon from "@mui/icons-material/ContentCopyOutlined";
import CheckOutlinedIcon from "@mui/icons-material/CheckOutlined";

import "./CodeBlock.css";

const CodeBlock = ({ className, children }) => {
  const [isCopied, setIsCopied] = useState(false);
  const codeRef = useRef(null);
  const copyButtonRef = useRef(null);
  const language = className?.replace("hljs language-", "") || "code";

  const handleCopy = () => {
    if (codeRef.current) {
      navigator.clipboard.writeText(codeRef.current.innerText);
    }
    setIsCopied(true);
    setTimeout(() => {
      setIsCopied(false);
    }, 3000);
  };

  return language === "code" ? (
    <code className="hyphens-auto text-[0.85rem] bg-[#dddddd] dark:bg-[#333333] !px-1 break-words" lang="en">{children}</code>
  ) : (
    <span className="code-block-container">
      <span className="code-block-language">{language}</span>
      <button
        ref={copyButtonRef}
        className="code-copy-button"
        onClick={handleCopy}
        title="Copy code"
      >
        {isCopied ? (
          <span>
            <CheckOutlinedIcon style={{ fontSize: ".85rem" }} />
            Copied!
          </span>
        ) : (
          <span>
            <ContentCopyOutlinedIcon style={{ fontSize: ".85rem" }} /> Copy
          </span>
        )}
      </button>
      <code ref={codeRef} className={`${className} w-full text-[0.85rem] rounded-b-[0.75rem] bg-[#e6f1f6] text-[#111111]`}>
        {children}
      </code>
    </span>
  );
};

export default CodeBlock;
