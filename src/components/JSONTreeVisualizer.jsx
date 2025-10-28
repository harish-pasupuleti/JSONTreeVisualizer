import React from 'react';
import { ReactFlowProvider } from 'reactflow';
import VisualizerContainer from './VisualizerContainer';

export default function JSONTreeVisualizer() {
  return (
    <ReactFlowProvider>
      <VisualizerContainer />
    </ReactFlowProvider>
  );
}
