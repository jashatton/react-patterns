import { useState } from 'react';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';

interface CodeBlockProps {
  code: string;
  language?: string;
  title?: string;
}

export function CodeBlock({ code, language = 'typescript', title }: CodeBlockProps) {
  const [copied, setCopied] = useState(false);
  const [collapsed, setCollapsed] = useState(false);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="my-4 rounded-lg overflow-hidden border border-gray-300">
      {title && (
        <div className="bg-gray-800 text-gray-100 px-4 py-2 flex justify-between items-center">
          <span className="text-sm font-semibold">{title}</span>
          <div className="flex gap-2">
            <button
              onClick={() => setCollapsed(!collapsed)}
              className="text-xs text-gray-400 hover:text-gray-200 transition-colors px-2 py-1 rounded"
            >
              {collapsed ? 'Expand' : 'Collapse'}
            </button>
            <button
              onClick={handleCopy}
              className="text-xs text-gray-400 hover:text-gray-200 transition-colors px-2 py-1 rounded"
            >
              {copied ? 'Copied!' : 'Copy'}
            </button>
          </div>
        </div>
      )}
      {!title && (
        <div className="bg-gray-800 px-4 py-2 flex justify-end">
          <button
            onClick={handleCopy}
            className="text-xs text-gray-400 hover:text-gray-200 transition-colors px-2 py-1 rounded"
          >
            {copied ? 'Copied!' : 'Copy'}
          </button>
        </div>
      )}
      {!collapsed && (
        <SyntaxHighlighter
          language={language}
          style={vscDarkPlus}
          customStyle={{
            margin: 0,
            borderRadius: 0,
            fontSize: '14px',
          }}
        >
          {code}
        </SyntaxHighlighter>
      )}
    </div>
  );
}
