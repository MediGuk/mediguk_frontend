import { useState } from 'react';

type Props = {
  text: string;
  displayText?: string;
};

export const CopyToClipboard = ({ text, displayText }: Props) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 1000);
  };

  return (
    <button
      type="button"
      onClick={handleCopy}
      className="font-bold cursor-pointer hover:bg-gray-100 flex items-center gap-1 px-2 py-1 rounded transition-colors active:scale-95 text-gray-900"
      title="Copiar"
    >
      {displayText || text}
      <span className="w-4 h-4 flex items-center justify-center">
        {copied ? (
          <span className="text-green-500 text-sm font-bold leading-none">✓</span>
        ) : (
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4 text-gray-400 hover:text-gray-600 transition-colors">
            <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 17.25v3.375c0 .621-.504 1.125-1.125 1.125h-9.75a1.125 1.125 0 0 1-1.125-1.125V7.875c0-.621.504-1.125 1.125-1.125H6.75a9.06 9.06 0 0 1 1.5.058m7.5 10.317c-.58.057-1.164.088-1.75.088H10.5m5.25-10.405c-.58.057-1.164.088-1.75.088H10.5m5.25-10.405c-.58.057-1.164.088-1.75.088" />
            <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 6.75h9.75c.621 0 1.125.504 1.125 1.125v9.75c0 .621-.504 1.125-1.125 1.125h-9.75a1.125 1.125 0 0 1-1.125-1.125v-9.75c0-.621.504-1.125 1.125-1.125Z" />
          </svg>
        )}
      </span>
    </button>
  );
};
