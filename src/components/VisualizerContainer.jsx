import React, { useState, useCallback, useEffect } from 'react';
import { useNodesState, useEdgesState, useReactFlow, MarkerType } from 'reactflow';
import { Moon, Sun, Menu, X } from 'lucide-react';
import SidebarPanel from './SidebarPanel';
import VisualizationArea from './VisualizationArea';
import { SAMPLE_JSON, HORIZONTAL_SPACING, VERTICAL_SPACING } from '../utils/constants';
import { 
  generateNodesAndEdges, 
  findNodeByPath, 
  downloadTreeAsImage 
} from '../utils/jsonUtils';

export default function VisualizerContainer() {
  const [jsonInput, setJsonInput] = useState(JSON.stringify(SAMPLE_JSON, null, 2));
  const [jsonError, setJsonError] = useState('');
  const [searchPath, setSearchPath] = useState('');
  const [searchMessage, setSearchMessage] = useState('');
  const [darkMode, setDarkMode] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  const [reactFlowInstance, setReactFlowInstance] = useState(null);
  const { getNodes } = useReactFlow();

  const generateTree = useCallback(() => {
    const result = generateNodesAndEdges(jsonInput, darkMode, HORIZONTAL_SPACING, VERTICAL_SPACING);
    
    if (result.error) {
      setJsonError(result.error);
      setNodes([]);
      setEdges([]);
    } else {
      setJsonError('');
      setNodes(result.nodes);
      setEdges(result.edges);

      setTimeout(() => {
        if (reactFlowInstance) reactFlowInstance.fitView({ padding: 0.2, duration: 400 });
      }, 200);

      if (window.innerWidth < 768) {
        setSidebarOpen(false);
      }
    }
  }, [jsonInput, reactFlowInstance, darkMode, setNodes, setEdges]);

  const handleSearch = () => {
    if (!searchPath.trim()) {
      setSearchMessage('');
      setNodes((nds) =>
        nds.map((n) => ({ ...n, data: { ...n.data, highlighted: false } }))
      );
      return;
    }

    setNodes((nds) =>
      nds.map((n) => ({ ...n, data: { ...n.data, highlighted: false } }))
    );

    const matchedNode = findNodeByPath(searchPath, nodes);

    if (matchedNode) {
      setNodes((nds) =>
        nds.map((n) =>
          n.id === matchedNode.id
            ? { ...n, data: { ...n.data, highlighted: true } }
            : n
        )
      );

      if (reactFlowInstance) {
        reactFlowInstance.setCenter(
          matchedNode.position.x + 70,
          matchedNode.position.y + 30,
          { zoom: 1.2, duration: 800 }
        );
      }

      setSearchMessage('Match found!');
      if (window.innerWidth < 768) {
        setSidebarOpen(false);
      }
    } else {
      setSearchMessage('No match found');
    }
  };

  const handleClearAll = () => {
    setJsonInput('');
    setNodes([]);
    setEdges([]);
    setJsonError('');
    setSearchPath('');
    setSearchMessage('');
  };

  const handleDownloadImage = useCallback(() => {
    downloadTreeAsImage(reactFlowInstance, getNodes, nodes, edges, darkMode);
  }, [reactFlowInstance, getNodes, nodes, edges, darkMode]);

  useEffect(() => {
    generateTree();
  }, []);

  useEffect(() => {
    if (nodes.length > 0) {
      setNodes((nds) =>
        nds.map((n) => ({
          ...n,
          data: { ...n.data, darkMode },
        }))
      );
      setEdges((eds) =>
        eds.map((e) => ({
          ...e,
          style: { 
            ...e.style, 
            stroke: darkMode ? '#9ca3af' : '#111827' 
          },
          markerEnd: { 
            type: MarkerType.ArrowClosed, 
            color: darkMode ? '#9ca3af' : '#111827' 
          },
        }))
      );
    }
  }, [darkMode, setNodes, setEdges]);

  return (
    <div className={`h-screen flex flex-col ${darkMode ? 'bg-gradient-to-br from-gray-900 to-gray-800' : 'bg-gradient-to-br from-slate-50 to-slate-100'}`}>
      {/* Header */}
      <div className={`${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} shadow-md border-b p-3 md:p-4`}>
        <div className="flex items-center justify-between">
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className={`md:hidden p-2 rounded-lg transition-colors ${darkMode ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-200 hover:bg-gray-300'}`}
          >
            {sidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
          <h1 className={`text-xl md:text-3xl font-bold ${darkMode ? 'text-gray-100' : 'text-gray-800'} text-center flex-1`}>
            JSON Tree Visualizer
          </h1>
          <button
            onClick={() => setDarkMode(!darkMode)}
            className={`p-2 rounded-lg transition-colors ${darkMode ? 'bg-gray-700 hover:bg-gray-600 text-yellow-400' : 'bg-gray-200 hover:bg-gray-300 text-gray-700'}`}
            title="Toggle dark mode"
          >
            {darkMode ? <Sun className="w-4 h-4 md:w-5 md:h-5" /> : <Moon className="w-4 h-4 md:w-5 md:h-5" />}
          </button>
        </div>
      </div>

      <div className="flex-1 flex overflow-hidden relative">
        <SidebarPanel
          darkMode={darkMode}
          sidebarOpen={sidebarOpen}
          jsonInput={jsonInput}
          setJsonInput={setJsonInput}
          jsonError={jsonError}
          searchPath={searchPath}
          setSearchPath={setSearchPath}
          searchMessage={searchMessage}
          onGenerateTree={generateTree}
          onClearAll={handleClearAll}
          onSearch={handleSearch}
          onDownloadImage={handleDownloadImage}
          nodesCount={nodes.length}
          edgesCount={edges.length}
        />

        {sidebarOpen && (
          <div 
            className="md:hidden fixed inset-0 bg-black bg-opacity-50 z-10"
            onClick={() => setSidebarOpen(false)}
          />
        )}

        <VisualizationArea
          darkMode={darkMode}
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onInit={setReactFlowInstance}
        />
      </div>
    </div>
  );
}
