import React from 'react';
import { Search, RefreshCw, Download } from 'lucide-react';

const SidebarPanel = ({
  darkMode,
  sidebarOpen,
  jsonInput,
  setJsonInput,
  jsonError,
  searchPath,
  setSearchPath,
  searchMessage,
  onGenerateTree,
  onClearAll,
  onSearch,
  onDownloadImage,
  nodesCount,
  edgesCount,
}) => {
  return (
    <div className={`
      ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
      md:translate-x-0
      fixed md:relative
      z-20
      w-80 md:w-96
      ${darkMode ? 'bg-gray-800 border-gray-700 text-gray-100' : 'bg-white border-gray-200'} 
      border-r flex flex-col p-4 overflow-y-auto
      transition-transform duration-300 ease-in-out
      h-[calc(100vh-64px)] md:h-auto
    `}>
      <textarea
        value={jsonInput}
        onChange={(e) => setJsonInput(e.target.value)}
        className={`w-full h-48 md:h-64 p-3 border rounded-lg font-mono text-xs md:text-sm focus:ring-2 focus:ring-blue-500 resize-none ${
          darkMode ? 'bg-gray-900 border-gray-600 text-gray-100' : 'border-gray-300'
        }`}
        placeholder="Paste your JSON here..."
      />
      {jsonError && <div className="text-red-500 text-xs mt-2">{jsonError}</div>}

      <div className="flex gap-2 my-3">
        <button
          onClick={onGenerateTree}
          className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 text-sm rounded-lg transition-colors"
        >
          Generate Tree
        </button>
        <button
          onClick={onClearAll}
          className={`${darkMode ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-500 hover:bg-gray-600'} text-white font-semibold py-2 px-3 rounded-lg transition-colors`}
          title="Clear all"
        >
          <RefreshCw className="w-4 h-4" />
        </button>
        <button
          onClick={onDownloadImage}
          className={`bg-purple-600 hover:bg-purple-700 text-white font-semibold py-2 px-3 rounded-lg transition-colors ${
            nodesCount === 0 ? 'opacity-50 cursor-not-allowed' : ''
          }`}
          title="Download as PNG"
          disabled={nodesCount === 0}
        >
          <Download className="w-4 h-4" />
        </button>
      </div>

      <input
        value={searchPath}
        onChange={(e) => setSearchPath(e.target.value)}
        onKeyPress={(e) => e.key === 'Enter' && onSearch()}
        placeholder="e.g. $.user.address.city"
        className={`p-2 border rounded-lg text-xs md:text-sm mb-2 ${
          darkMode ? 'bg-gray-900 border-gray-600 text-gray-100 placeholder-gray-500' : 'border-gray-300'
        }`}
      />

      <button
        onClick={onSearch}
        className="bg-green-600 hover:bg-green-700 text-white font-semibold py-2 px-4 rounded-lg flex items-center justify-center gap-2 transition-colors text-sm"
      >
        <Search className="w-4 h-4" />
        Search
      </button>

      {searchMessage && (
        <div
          className={`mt-2 p-2 text-xs rounded-lg ${
            searchMessage.includes('found')
              ? 'bg-green-100 text-green-800'
              : 'bg-yellow-100 text-yellow-800'
          }`}
        >
          {searchMessage}
        </div>
      )}

      <div className={`mt-4 text-xs ${darkMode ? 'text-gray-400' : 'text-gray-700'}`}>
        <strong>🟦 Nodes:</strong> {nodesCount}
        <br />
        <strong>🟥 Edges:</strong> {edgesCount}
        <br />
        <div className="mt-2 text-xs opacity-75">
          💡 Click any node to copy its path
        </div>
      </div>
    </div>
  );
};

export default SidebarPanel;
