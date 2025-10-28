import React, { useState } from "react";
import { Handle, Position } from "reactflow";
import { Copy, Check } from "lucide-react";

const CustomNode = ({ data }) => {
  const [copied, setCopied] = useState(false);

  const truncateText = (text, maxLength = 30) => {
    const str = String(text);
    if (str.length <= maxLength) return str;
    return str.substring(0, maxLength) + "...";
  };

  const handleCopyPath = (e) => {
    e.stopPropagation();
    navigator.clipboard.writeText(data.path);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const getNodeStyle = () => {
    const baseStyle =
      "px-4 py-2 md:px-6 md:py-3 rounded-xl shadow-lg border-2 min-w-[100px] md:min-w-[140px] max-w-[150px] md:max-w-[200px] text-center break-words cursor-pointer relative group transition-all hover:scale-105";

    if (data.highlighted) {
      return `${baseStyle} bg-yellow-400 border-yellow-600 animate-pulse`;
    }

    switch (data.nodeCategory) {
      case "key":
        return `${baseStyle} ${
          data.darkMode
            ? "bg-teal-600 border-teal-400"
            : "bg-teal-400 border-teal-600"
        } text-white`;
      case "value":
        return `${baseStyle} ${
          data.darkMode
            ? "bg-orange-600 border-orange-400 text-gray-100"
            : "bg-orange-300 border-orange-500 text-gray-800"
        }`;
      case "object":
        return `${baseStyle} ${
          data.darkMode
            ? "bg-blue-600 border-blue-400"
            : "bg-blue-400 border-blue-600"
        } text-white`;
      case "array":
        return `${baseStyle} ${
          data.darkMode
            ? "bg-teal-600 border-teal-400"
            : "bg-teal-400 border-teal-600"
        } text-white`;
      default:
        return `${baseStyle} ${
          data.darkMode
            ? "bg-gray-700 border-gray-500"
            : "bg-gray-300 border-gray-500"
        }`;
    }
  };

  const displayLabel = truncateText(data.label, 30);

  return (
    <div
      className={getNodeStyle()}
      title={`${data.label}\nPath: ${data.path}\nClick to copy path`}
      onClick={handleCopyPath}
    >
      <Handle
        type="target"
        position={Position.Top}
        style={{
          background: data.darkMode ? "#f3f4f6" : "#111827",
          width: 8,
          height: 8,
          border: `1px solid ${data.darkMode ? "#111827" : "white"}`,
        }}
      />

      <div className="font-bold text-xs md:text-sm leading-tight">
        {displayLabel}
      </div>

      <div className="absolute -top-2 -right-2 opacity-0 group-hover:opacity-100 transition-opacity">
        {copied ? (
          <Check className="w-3 h-3 md:w-4 md:h-4 text-green-500 bg-white rounded-full p-0.5 shadow-md" />
        ) : (
          <Copy className="w-3 h-3 md:w-4 md:h-4 text-gray-600 bg-white rounded-full p-0.5 shadow-md" />
        )}
      </div>

      <Handle
        type="source"
        position={Position.Bottom}
        style={{
          background: data.darkMode ? "#f3f4f6" : "#111827",
          width: 8,
          height: 8,
          border: `1px solid ${data.darkMode ? "#111827" : "white"}`,
        }}
      />
    </div>
  );
};

export default CustomNode;