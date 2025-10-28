import React from 'react';
import ReactFlow, { Background, Controls, MiniMap } from 'reactflow';
import CustomNode from './CustomNode';

const nodeTypes = { custom: CustomNode };

export default function FlowCanvas({ nodes, edges, onNodesChange, onEdgesChange, setReactFlowInstance, darkMode }) {
  return (
    <div className={`flex-1 relative ${darkMode ? 'bg-gray-900' : 'bg-white'}`}>
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onInit={setReactFlowInstance}
        nodeTypes={nodeTypes}
        fitView
        fitViewOptions={{ padding: 0.2 }}
      >
        <Background color={darkMode ? '#4b5563' : '#cbd5e1'} gap={16} />
        <Controls className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-lg shadow-lg`} />
        <MiniMap 
          className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-lg shadow-lg`}
          nodeColor={node => {
            if (node.data.highlighted) return '#facc15';
            switch (node.data.nodeCategory) {
              case 'key': return darkMode ? '#0d9488' : '#2dd4bf';
              case 'value': return darkMode ? '#ea580c' : '#fdba74';
              case 'object': return darkMode ? '#2563eb' : '#60a5fa';
              case 'array': return darkMode ? '#0d9488' : '#2dd4bf';
              default: return darkMode ? '#374151' : '#d1d5db';
            }
          }}
        />
      </ReactFlow>
    </div>
  );
}
