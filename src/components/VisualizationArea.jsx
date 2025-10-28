import React from 'react';
import ReactFlow, { Background, Controls, MiniMap } from 'reactflow';
import CustomNode from './CustomNode';

const nodeTypes = { custom: CustomNode };

const VisualizationArea = ({
  darkMode,
  nodes,
  edges,
  onNodesChange,
  onEdgesChange,
  onInit,
}) => {
  return (
    <div className={`flex-1 relative ${darkMode ? 'bg-gray-900' : 'bg-white'}`}>
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onInit={onInit}
        nodeTypes={nodeTypes}
        fitView
        defaultEdgeOptions={{
          type: 'smoothstep',
          animated: false,
        }}
      >
        <Background 
          color={darkMode ? '#4b5563' : '#cbd5e1'} 
          gap={16} 
        />
        <Controls className={`${darkMode ? 'bg-gray-800 border-gray-600' : 'bg-white border-gray-300'} rounded-lg shadow-lg`} />
        <MiniMap
          nodeColor={(node) => {
            if (node.data.highlighted) return '#facc15';
            switch (node.data.nodeCategory) {
              case 'object':
                return darkMode ? '#2563eb' : '#60a5fa';
              case 'array':
                return darkMode ? '#14b8a6' : '#5eead4';
              case 'key':
                return darkMode ? '#14b8a6' : '#5eead4';
              case 'value':
                return darkMode ? '#ea580c' : '#fdba74';
              default:
                return darkMode ? '#374151' : '#e5e7eb';
            }
          }}
          className={`${darkMode ? 'bg-gray-800 border-gray-600' : 'bg-white border-gray-300'} rounded-lg shadow-lg`}
        />
      </ReactFlow>
    </div>
  );
};

export default VisualizationArea;
