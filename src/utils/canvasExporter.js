import { getRectOfNodes } from 'reactflow';

export const exportToPNG = (reactFlowInstance, nodes, edges, darkMode) => {
  if (!reactFlowInstance || nodes.length === 0) return;
  const bounds = getRectOfNodes(nodes);
  const padding = 100;

  const canvas = document.createElement('canvas');
  canvas.width = bounds.width + padding * 2;
  canvas.height = bounds.height + padding * 2;
  const ctx = canvas.getContext('2d');

  ctx.fillStyle = darkMode ? '#1e293b' : '#ffffff';
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  edges.forEach((edge) => {
    const src = nodes.find((n) => n.id === edge.source);
    const tgt = nodes.find((n) => n.id === edge.target);
    if (!src || !tgt) return;
    const sx = src.position.x - bounds.x + padding + 70;
    const sy = src.position.y - bounds.y + padding + 50;
    const tx = tgt.position.x - bounds.x + padding + 70;
    const ty = tgt.position.y - bounds.y + padding + 20;
    ctx.strokeStyle = darkMode ? '#9ca3af' : '#111827';
    ctx.lineWidth = 2.5;
    ctx.beginPath();
    ctx.moveTo(sx, sy);
    ctx.bezierCurveTo(sx, (sy + ty) / 2, tx, (sy + ty) / 2, tx, ty);
    ctx.stroke();
  });

  
  nodes.forEach((node) => {
    const x = node.position.x - bounds.x + padding;
    const y = node.position.y - bounds.y + padding;
    const label = String(node.data.label);
    ctx.fillStyle = darkMode ? '#60a5fa' : '#60a5fa';
    ctx.fillRect(x, y, 140, 50);
    ctx.fillStyle = darkMode ? '#f3f4f6' : '#1f2937';
    ctx.font = 'bold 14px sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText(label, x + 70, y + 25);
  });

  canvas.toBlob((blob) => {
    const a = document.createElement('a');
    a.download = `json-tree-${Date.now()}.png`;
    a.href = URL.createObjectURL(blob);
    a.click();
  });
};
