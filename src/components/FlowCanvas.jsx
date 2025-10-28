import React from 'react';
import ReactFlow, { Background, Controls, MiniMap } from 'reactflow';
import 'reactflow/dist/style.css';
import CustomNode from './CustomNode';

const nodeTypes = { custom: CustomNode };

const FlowCanvas = ({
  nodes,
  edges,
  onNodesChange,
  onEdgesChange,
  setReactFlowInstance,
  darkMode,
}) => (
  <div className={`flex-1 relative ${darkMode ? 'bg-gray-900' : 'bg-white'}`}>
    <ReactFlow
      nodes={nodes}
      edges={edges}
      onNodesChange={onNodesChange}
      onEdgesChange={onEdgesChange}
      onInit={setReactFlowInstance}
      nodeTypes={nodeTypes}
      fitView
    >
      <Background color={darkMode ? '#4b5563' : '#cbd5e1'} gap={16} />
      <Controls />
      <MiniMap
        nodeColor={(n) =>
          n.data.highlighted
            ? '#facc15'
            : n.data.nodeCategory === 'object'
            ? '#60a5fa'
            : '#5eead4'
        }
      />
    </ReactFlow>
  </div>
);

export default FlowCanvas;
