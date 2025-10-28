import React from 'react';
import { Search, RefreshCw, Download } from 'lucide-react';

const Sidebar = ({
  darkMode,
  sidebarOpen,
  jsonInput,
  setJsonInput,
  jsonError,
  generateTree,
  handleClearAll,
  downloadImage,
  searchPath,
  setSearchPath,
  handleSearch,
  searchMessage,
  nodes,
  edges,
}) => (
  <div
    className={`
      ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
      md:translate-x-0 fixed md:relative z-20
      w-80 md:w-96 border-r flex flex-col p-4 overflow-y-auto transition-transform duration-300 ease-in-out
      ${darkMode ? 'bg-gray-800 border-gray-700 text-gray-100' : 'bg-white border-gray-200'}
    `}
  >
    <textarea
      value={jsonInput}
      onChange={(e) => setJsonInput(e.target.value)}
      className={`w-full h-48 md:h-64 p-3 border rounded-lg font-mono text-xs md:text-sm ${
        darkMode ? 'bg-gray-900 border-gray-600 text-gray-100' : 'border-gray-300'
      }`}
    />
    {jsonError && <div className="text-red-500 text-xs mt-2">{jsonError}</div>}

    <div className="flex gap-2 my-3">
      <button onClick={generateTree} className="flex-1 bg-blue-600 text-white py-2 text-sm rounded-lg">
        Generate Tree
      </button>
      <button onClick={handleClearAll} className="bg-gray-500 text-white p-2 rounded-lg">
        <RefreshCw className="w-4 h-4" />
      </button>
      <button onClick={downloadImage} disabled={!nodes.length} className="bg-purple-600 text-white p-2 rounded-lg">
        <Download className="w-4 h-4" />
      </button>
    </div>

    <input
      value={searchPath}
      onChange={(e) => setSearchPath(e.target.value)}
      placeholder="e.g. $.user.address.city"
      className={`p-2 border rounded-lg text-xs md:text-sm mb-2 ${
        darkMode ? 'bg-gray-900 border-gray-600 text-gray-100' : 'border-gray-300'
      }`}
    />

    <button onClick={handleSearch} className="bg-green-600 text-white py-2 px-4 rounded-lg flex items-center gap-2 text-sm">
      <Search className="w-4 h-4" /> Search
    </button>

    {searchMessage && (
      <div
        className={`mt-2 p-2 text-xs rounded-lg ${
          searchMessage.includes('found') ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
        }`}
      >
        {searchMessage}
      </div>
    )}

    <div className={`mt-4 text-xs ${darkMode ? 'text-gray-400' : 'text-gray-700'}`}>
      🟦 Nodes: {nodes.length} <br /> 🟥 Edges: {edges.length}
    </div>
  </div>
);

export default Sidebar;
