import { getRectOfNodes } from "reactflow";

export const exportCanvasAsImage = (reactFlowInstance, getNodes, nodes, edges, darkMode) => {
  if (!reactFlowInstance || getNodes().length === 0) return;

  const nodesBounds = getRectOfNodes(getNodes());
  const padding = 100;
  const imageWidth = nodesBounds.width + padding * 2;
  const imageHeight = nodesBounds.height + padding * 2;

  const canvas = document.createElement("canvas");
  canvas.width = imageWidth;
  canvas.height = imageHeight;
  const ctx = canvas.getContext("2d");

  ctx.fillStyle = darkMode ? "#1e293b" : "#ffffff";
  ctx.fillRect(0, 0, imageWidth, imageHeight);

  // Draw grid
  ctx.strokeStyle = darkMode ? "#4b5563" : "#cbd5e1";
  ctx.lineWidth = 1;
  const gridSize = 16;
  for (let x = 0; x < imageWidth; x += gridSize) {
    ctx.beginPath();
    ctx.moveTo(x, 0);
    ctx.lineTo(x, imageHeight);
    ctx.stroke();
  }
  for (let y = 0; y < imageHeight; y += gridSize) {
    ctx.beginPath();
    ctx.moveTo(0, y);
    ctx.lineTo(imageWidth, y);
    ctx.stroke();
  }

  // Draw edges
  edges.forEach((edge) => {
    const sourceNode = nodes.find((n) => n.id === edge.source);
    const targetNode = nodes.find((n) => n.id === edge.target);

    if (sourceNode && targetNode) {
      const sourceX = sourceNode.position.x - nodesBounds.x + padding + 70;
      const sourceY = sourceNode.position.y - nodesBounds.y + padding + 50;
      const targetX = targetNode.position.x - nodesBounds.x + padding + 70;
      const targetY = targetNode.position.y - nodesBounds.y + padding + 20;

      ctx.strokeStyle = darkMode ? "#9ca3af" : "#111827";
      ctx.lineWidth = 2.5;
      ctx.beginPath();
      ctx.moveTo(sourceX, sourceY);
      const midY = (sourceY + targetY) / 2;
      ctx.bezierCurveTo(sourceX, midY, targetX, midY, targetX, targetY);
      ctx.stroke();

      // Arrow
      const arrowSize = 8;
      ctx.fillStyle = darkMode ? "#9ca3af" : "#111827";
      ctx.beginPath();
      ctx.moveTo(targetX, targetY);
      ctx.lineTo(targetX - arrowSize / 2, targetY - arrowSize);
      ctx.lineTo(targetX + arrowSize / 2, targetY - arrowSize);
      ctx.closePath();
      ctx.fill();
    }
  });

  // Draw nodes
  nodes.forEach((node) => {
    const x = node.position.x - nodesBounds.x + padding;
    const y = node.position.y - nodesBounds.y + padding;

    const nodeWidth = 140;
    const nodeHeight = 50;
    const radius = 12;
    let bgColor, borderColor, textColor;

    if (node.data.highlighted) {
      bgColor = "#facc15";
      borderColor = "#ca8a04";
      textColor = "#000000";
    } else {
      switch (node.data.nodeCategory) {
        case "key":
          bgColor = darkMode ? "#0d9488" : "#2dd4bf";
          borderColor = darkMode ? "#14b8a6" : "#0d9488";
          textColor = "#ffffff";
          break;
        case "value":
          bgColor = darkMode ? "#ea580c" : "#fdba74";
          borderColor = darkMode ? "#f97316" : "#ea580c";
          textColor = darkMode ? "#f3f4f6" : "#1f2937";
          break;
        case "object":
          bgColor = darkMode ? "#2563eb" : "#60a5fa";
          borderColor = darkMode ? "#3b82f6" : "#2563eb";
          textColor = "#ffffff";
          break;
        case "array":
          bgColor = darkMode ? "#0d9488" : "#2dd4bf";
          borderColor = darkMode ? "#14b8a6" : "#0d9488";
          textColor = "#ffffff";
          break;
        default:
          bgColor = darkMode ? "#374151" : "#d1d5db";
          borderColor = darkMode ? "#4b5563" : "#9ca3af";
          textColor = darkMode ? "#f3f4f6" : "#1f2937";
      }
    }

    ctx.fillStyle = bgColor;
    ctx.strokeStyle = borderColor;
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(x + radius, y);
    ctx.lineTo(x + nodeWidth - radius, y);
    ctx.quadraticCurveTo(x + nodeWidth, y, x + nodeWidth, y + radius);
    ctx.lineTo(x + nodeWidth, y + nodeHeight - radius);
    ctx.quadraticCurveTo(x + nodeWidth, y + nodeHeight, x + nodeWidth - radius, y + nodeHeight);
    ctx.lineTo(x + radius, y + nodeHeight);
    ctx.quadraticCurveTo(x, y + nodeHeight, x, y + nodeHeight - radius);
    ctx.lineTo(x, y + radius);
    ctx.quadraticCurveTo(x, y, x + radius, y);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();

    ctx.fillStyle = textColor;
    ctx.font = "bold 14px sans-serif";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";

    const label = String(node.data.label);
    const maxWidth = nodeWidth - 20;
    let displayText = label;

    if (ctx.measureText(label).width > maxWidth) {
      while (ctx.measureText(displayText + "...").width > maxWidth && displayText.length > 0) {
        displayText = displayText.slice(0, -1);
      }
      displayText += "...";
    }

    ctx.fillText(displayText, x + nodeWidth / 2, y + nodeHeight / 2);
  });

  canvas.toBlob((blob) => {
    const link = document.createElement("a");
    link.download = `json-tree-${Date.now()}.png`;
    link.href = URL.createObjectURL(blob);
    link.click();
  });
};
