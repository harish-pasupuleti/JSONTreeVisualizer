import React from 'react';
import { RefreshCw, Download, Search } from 'lucide-react';

export default function Sidebar({
  jsonInput, setJsonInput, jsonError,
  generateTree, handleClear, handleDownload, handleSearch,
  nodes, edges, darkMode,
  searchPath, setSearchPath, searchMessage,
  sidebarOpen, setSidebarOpen
}) {
  return (
    <>
      {/* Sidebar Panel */}
      <div
        className={`
          md:relative fixed md:translate-x-0
          ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
          left-0 top-[64px] md:top-0 z-30
          w-80 md:w-96 border-r flex flex-col p-4 overflow-y-auto
          ${darkMode ? 'bg-gray-800 border-gray-700 text-gray-100' : 'bg-white border-gray-200'}
          transition-transform duration-300 ease-in-out
          h-[calc(100vh-64px)] md:h-auto
        `}
      >
        <textarea
          value={jsonInput}
          onChange={e => setJsonInput(e.target.value)}
          className={`w-full h-48 p-3 border rounded-lg font-mono text-xs resize-none ${
            darkMode
              ? 'bg-gray-900 border-gray-600 text-gray-100'
              : 'border-gray-300'
          }`}
          placeholder="Paste your JSON here..."
        />
        {jsonError && <p className="text-red-500 text-xs mt-2">{jsonError}</p>}

        <div className="flex gap-2 my-3">
          <button
            onClick={generateTree}
            className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 rounded-lg"
          >
            Generate Tree
          </button>
          <button
            onClick={handleClear}
            className={`${
              darkMode ? 'bg-gray-700' : 'bg-gray-500'
            } hover:bg-gray-600 text-white py-2 px-3 rounded-lg`}
            title="Clear"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
          <button
            onClick={handleDownload}
            className={`bg-purple-600 hover:bg-purple-700 text-white py-2 px-3 rounded-lg ${
              nodes.length === 0 ? 'opacity-50 cursor-not-allowed' : ''
            }`}
            disabled={nodes.length === 0}
            title="Download as PNG"
          >
            <Download className="w-4 h-4" />
          </button>
        </div>

        <input
          value={searchPath}
          onChange={e => setSearchPath(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && handleSearch()}
          placeholder="e.g. $.user.address.city"
          className={`p-2 border rounded-lg text-xs mb-2 ${
            darkMode
              ? 'bg-gray-900 border-gray-600 text-gray-100'
              : 'border-gray-300'
          }`}
        />

        <button 
          onClick={handleSearch}
          className="bg-green-600 hover:bg-green-700 text-white py-2 px-4 rounded-lg flex items-center justify-center gap-2 text-sm"
        >
          <Search className="w-4 h-4" /> Search Path
        </button>

        {searchMessage && (
          <div
            className={`mt-2 p-2 text-xs rounded-lg ${
              searchMessage.includes('found') || searchMessage.includes('Highlighted')
                ? 'bg-green-100 text-green-800'
                : 'bg-yellow-100 text-yellow-800'
            }`}
          >
            {searchMessage}
          </div>
        )}

        <div className={`mt-4 text-xs ${darkMode ? 'text-gray-400' : 'text-gray-700'}`}>
           Nodes: {nodes.length} <br />
           Edges: {edges.length}
        </div>
      </div>

      {/* Background dim effect (keep tree visible) */}
      {sidebarOpen && (
        <div
          className="
            fixed top-[64px] left-0 right-0 bottom-0 
            backdrop-blur-[2px] bg-black/30 
            z-20 md:hidden transition-opacity duration-300
          "
          onClick={() => setSidebarOpen(false)}
        />
      )}
    </>
  );
}
