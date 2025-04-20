import { useRef, useState } from "react";

const CodeBlock = ({ className, children }) => {
    const [isCopied, setIsCopied] = useState(false);
  const codeRef = useRef(null);
  const copyButtonRef = useRef(null);

  const handleCopy = () => {
    if (codeRef.current) {
      navigator.clipboard.writeText(codeRef.current.innerText);
    }
    setIsCopied(true);
    setTimeout(() => {
      setIsCopied(false);
    }, 3000);
  };

  return (
    <div className="code-block-container" style={{ position: "relative" }}>
      <button
        ref={copyButtonRef}
        className="copy-button"
        onClick={handleCopy}
        title="Copy code"
      >
       { isCopied ? "✓ Copied" : "⧉ Copy"}
      </button>
      <pre>
        <code ref={codeRef} className={className}>
          {children}
        </code>
      </pre>
    </div>
  );
};

export default CodeBlock;
