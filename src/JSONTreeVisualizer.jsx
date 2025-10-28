import React from 'react';
import { ReactFlowProvider } from 'reactflow';
import JSONTreeVisualizerContent from './components/JSONTreeVisualizerContent';

export default function JSONTreeVisualizer() {
  return (
    <ReactFlowProvider>
      <JSONTreeVisualizerContent />
    </ReactFlowProvider>
  );
}
