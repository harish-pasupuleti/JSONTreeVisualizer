import React, { useState, useEffect, useCallback } from 'react';
import { useNodesState, useEdgesState, MarkerType, useReactFlow } from 'reactflow';
import 'reactflow/dist/style.css';

import FlowCanvas from './FlowCanvas';
import Header from './Header';
import Sidebar from './Sidebar';
import { exportCanvasAsImage } from '../utils/canvasExporter';
import { buildTree, SAMPLE_JSON } from '../utils/jsonUtils';

function JSONTreeVisualizerContent() {
  const [jsonInput, setJsonInput] = useState(JSON.stringify(SAMPLE_JSON, null, 2));
  const [jsonError, setJsonError] = useState('');
  const [searchPath, setSearchPath] = useState('');
  const [searchMessage, setSearchMessage] = useState('');
  const [darkMode, setDarkMode] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  const [reactFlowInstance, setReactFlowInstance] = useState(null);
  const { getNodes, fitView } = useReactFlow();

  const generateTree = useCallback(() => {
    try {
      const parsed = JSON.parse(jsonInput);
      setJsonError('');

      const { nodes: newNodes, edges: newEdges } = buildTree(parsed, darkMode);
      setNodes(newNodes);
      setEdges(newEdges);

      setTimeout(() => {
        if (reactFlowInstance) {
          fitView({ padding: 0.2, duration: 400 });
        }
      }, 200);

      if (window.innerWidth < 768) setSidebarOpen(false);
    } catch (err) {
      setJsonError(`Invalid JSON: ${err.message}`);
      setNodes([]);
      setEdges([]);
    }
  }, [jsonInput, reactFlowInstance, darkMode, setNodes, setEdges, fitView]);

  useEffect(() => {
    setNodes(nds => 
      Array.isArray(nds) ? nds.map(n => ({
        ...n,
        data: { ...n.data, darkMode }
      })) : []
    );

    setEdges(eds => 
      Array.isArray(eds) ? eds.map(e => ({
        ...e,
        style: { ...e.style, stroke: darkMode ? '#9ca3af' : '#111827' },
        markerEnd: { type: MarkerType.ArrowClosed, color: darkMode ? '#9ca3af' : '#111827' }
      })) : []
    );
  }, [darkMode, setNodes, setEdges]);

  const handleClear = () => {
    setJsonInput('');
    setNodes([]);
    setEdges([]);
    setJsonError('');
    setSearchMessage('');
    setSearchPath('');
  };

  const handleDownload = useCallback(() => {
    exportCanvasAsImage(reactFlowInstance, getNodes, nodes, edges, darkMode);
  }, [reactFlowInstance, getNodes, nodes, edges, darkMode]);

  const handleSearch = useCallback(() => {
    if (!searchPath.trim()) {
      setSearchMessage('Please enter a path to search');
      return;
    }

    const foundNode = nodes.find(n => n.data.path === searchPath.trim());
    
    if (foundNode) {
      setNodes(nds => nds.map(n => ({
        ...n,
        data: { ...n.data, highlighted: n.id === foundNode.id }
      })));

      setSearchMessage(`Found and highlighted: ${foundNode.data.label}`);

      setTimeout(() => {
        if (reactFlowInstance) {
          reactFlowInstance.setCenter(
            foundNode.position.x + 70,
            foundNode.position.y + 25,
            { zoom: 1.5, duration: 800 }
          );
        }
      }, 100);
    } else {
      setNodes(nds => nds.map(n => ({
        ...n,
        data: { ...n.data, highlighted: false }
      })));
      setSearchMessage('Path not found. Check your syntax (e.g., $.user.name)');
    }
  }, [searchPath, nodes, setNodes, reactFlowInstance]);

  useEffect(() => {
    generateTree();
  }, []);

  return (
    <div className={`h-screen flex flex-col ${darkMode ? 'bg-gray-900' : 'bg-slate-100'}`}>
      <Header 
        darkMode={darkMode} 
        setDarkMode={setDarkMode} 
        sidebarOpen={sidebarOpen} 
        setSidebarOpen={setSidebarOpen} 
      />
      <div className="flex flex-1 overflow-hidden">
        <Sidebar
          jsonInput={jsonInput}
          setJsonInput={setJsonInput}
          jsonError={jsonError}
          generateTree={generateTree}
          handleClear={handleClear}
          handleDownload={handleDownload}
          handleSearch={handleSearch}
          nodes={nodes}
          edges={edges}
          darkMode={darkMode}
          searchPath={searchPath}
          setSearchPath={setSearchPath}
          searchMessage={searchMessage}
          sidebarOpen={sidebarOpen}
          setSidebarOpen={setSidebarOpen}
        />
        <FlowCanvas
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          setReactFlowInstance={setReactFlowInstance}
          darkMode={darkMode}
        />
      </div>
    </div>
  );
}

export default JSONTreeVisualizerContent;