import React, { useState } from 'react';
import { ReactFlowProvider, useNodesState, useEdgesState } from 'reactflow';
import SAMPLE_JSON from './data/sampleJSON';
import Header from './components/Header';
import Sidebar from './components/Sidebar';
import FlowCanvas from './components/FlowCanvas';
import { exportToPNG } from './utils/canvasExporter';

const JSONTreeVisualizerContent = () => {
  const [jsonInput, setJsonInput] = useState(JSON.stringify(SAMPLE_JSON, null, 2));
  const [jsonError, setJsonError] = useState('');
  const [searchPath, setSearchPath] = useState('');
  const [searchMessage, setSearchMessage] = useState('');
  const [darkMode, setDarkMode] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  const [reactFlowInstance, setReactFlowInstance] = useState(null);


  return (
    <div className={`h-screen flex flex-col ${darkMode ? 'bg-gray-900' : 'bg-slate-100'}`}>
      <Header {...{ darkMode, setDarkMode, sidebarOpen, setSidebarOpen }} />
      <div className="flex flex-1 overflow-hidden">
        <Sidebar
          {...{
            darkMode,
            sidebarOpen,
            jsonInput,
            setJsonInput,
            jsonError,
            generateTree: () => {}, 
            handleClearAll: () => {},
            downloadImage: () =>
              exportToPNG(reactFlowInstance, nodes, edges, darkMode),
            searchPath,
            setSearchPath,
            handleSearch: () => {},
            searchMessage,
            nodes,
            edges,
          }}
        />
        <FlowCanvas
          {...{ nodes, edges, onNodesChange, onEdgesChange, setReactFlowInstance, darkMode }}
        />
      </div>
    </div>
  );
};

export default function JSONTreeVisualizer() {
  return (
    <ReactFlowProvider>
      <JSONTreeVisualizerContent />
    </ReactFlowProvider>
  );
}
