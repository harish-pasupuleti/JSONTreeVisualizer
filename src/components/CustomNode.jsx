import React, { useState } from 'react';
import { Handle, Position } from 'reactflow';
import { Copy, Check } from 'lucide-react';

const CustomNode = ({ data }) => {
  const [copied, setCopied] = useState(false);

  const truncateText = (text, maxLength = 30) =>
    String(text).length > maxLength
      ? String(text).substring(0, maxLength) + '...'
      : String(text);

  const handleCopyPath = (e) => {
    e.stopPropagation();
    navigator.clipboard.writeText(data.path);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const baseStyle =
    'px-4 py-2 md:px-6 md:py-3 rounded-xl shadow-lg border-2 min-w-[100px] md:min-w-[140px] max-w-[150px] md:max-w-[200px] text-center break-words cursor-pointer relative group transition-all hover:scale-105';

  const getNodeStyle = () => {
    if (data.highlighted)
      return `${baseStyle} bg-yellow-400 border-yellow-600 animate-pulse`;

    const theme = data.darkMode
      ? { text: 'text-white', gray: 'bg-gray-700 border-gray-500' }
      : { text: 'text-gray-800', gray: 'bg-gray-300 border-gray-500' };

    const styles = {
      key: `bg-teal-${data.darkMode ? 600 : 400} border-teal-${
        data.darkMode ? 400 : 600
      } ${theme.text}`,
      value: `${data.darkMode ? 'bg-orange-600 border-orange-400' : 'bg-orange-300 border-orange-500'} ${theme.text}`,
      object: `${data.darkMode ? 'bg-blue-600 border-blue-400' : 'bg-blue-400 border-blue-600'} ${theme.text}`,
      array: `${data.darkMode ? 'bg-teal-600 border-teal-400' : 'bg-teal-400 border-teal-600'} ${theme.text}`,
      default: theme.gray,
    };

    return `${baseStyle} ${styles[data.nodeCategory] || styles.default}`;
  };

  return (
    <div
      className={getNodeStyle()}
      onClick={handleCopyPath}
      title={`${data.label}\nPath: ${data.path}\nClick to copy`}
    >
      <Handle
        type="target"
        position={Position.Top}
        style={{
          background: data.darkMode ? '#f3f4f6' : '#111827',
          width: 8,
          height: 8,
          border: `1px solid ${data.darkMode ? '#111827' : 'white'}`,
        }}
      />
      <div className="font-bold text-xs md:text-sm leading-tight">
        {truncateText(data.label)}
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
          background: data.darkMode ? '#f3f4f6' : '#111827',
          width: 8,
          height: 8,
          border: `1px solid ${data.darkMode ? '#111827' : 'white'}`,
        }}
      />
    </div>
  );
};

export default CustomNode;
