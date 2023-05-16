import { useState, useCallback, useRef } from "react";
import { useCopy } from "./useCopy";

type CodeBlockProps = {
  children: React.ReactNode;
};

const CodeBlock = ({ children }: CodeBlockProps) => {
  const [copy, copied] = useCopy();

  const handleCopyClick = () => {
    copy((children as any).props.children);
  };

  return (
    <div className="relative my-8">
      <pre className="p-4 bg-gray-800 text-white rounded-xl overflow-x-auto">
        <code>{children}</code>
      </pre>
      <button
        onClick={handleCopyClick}
        className="btn btn-accent absolute top-0 right-0 m-2 p-2 rounded-lg"
      >
        {copied ? "Copied!" : "Copy"}
      </button>
    </div>
  );
};

export default CodeBlock;
