import { MarkerType } from 'reactflow';

export const parseJSONPath = (path) => {
  const cleanPath = path.replace(/^\$\.?/, '');
  if (!cleanPath) return [];

  const parts = [];
  let current = '';
  let inBracket = false;

  for (let i = 0; i < cleanPath.length; i++) {
    const char = cleanPath[i];
    if (char === '[') {
      if (current) {
        parts.push(current);
        current = '';
      }
      inBracket = true;
    } else if (char === ']') {
      if (current) {
        parts.push(parseInt(current));
        current = '';
      }
      inBracket = false;
    } else if (char === '.' && !inBracket) {
      if (current) {
        parts.push(current);
        current = '';
      }
    } else {
      current += char;
    }
  }

  if (current) parts.push(current);
  return parts;
};

export const findNodeByPath = (targetPath, nodes) => {
  const parts = parseJSONPath(targetPath);
  const searchPathStr = parts.join('.');

  for (const node of nodes) {
    const nodeParts = parseJSONPath(node.data.path);
    const nodePathStr = nodeParts.join('.');
    if (nodePathStr === searchPathStr) return node;
  }
  return null;
};

export const getTreeWidth = (obj) => {
  if (obj === null || typeof obj !== 'object') return 1;
  if (Array.isArray(obj)) return obj.reduce((sum, i) => sum + getTreeWidth(i), 0) || 1;
  return Object.values(obj).reduce((sum, v) => sum + getTreeWidth(v), 0) || 1;
};

export const generateNodesAndEdges = (jsonInput, darkMode, HORIZONTAL_SPACING, VERTICAL_SPACING) => {
  try {
    const parsed = JSON.parse(jsonInput);
    const newNodes = [];
    const newEdges = [];
    let nodeId = 0;

    const traverse = (obj, parentId = null, key = 'root', level = 0, path = '$', leftOffset = 0) => {
      const treeWidth = getTreeWidth(obj);
      const centerX = leftOffset + (treeWidth * HORIZONTAL_SPACING) / 2;

      if (obj === null || typeof obj !== 'object') {
        const keyNodeId = `node-${nodeId++}`;
        const valueNodeId = `node-${nodeId++}`;

        newNodes.push({
          id: keyNodeId,
          type: 'custom',
          position: { x: centerX, y: level * VERTICAL_SPACING },
          data: {
            label: key,
            nodeCategory: 'key',
            path,
            highlighted: false,
            darkMode,
          },
        });

        newNodes.push({
          id: valueNodeId,
          type: 'custom',
          position: { x: centerX, y: (level + 1) * VERTICAL_SPACING },
          data: {
            label: String(obj),
            nodeCategory: 'value',
            path,
            highlighted: false,
            darkMode,
          },
        });

        if (parentId) {
          newEdges.push({
            id: `edge-${parentId}-${keyNodeId}`,
            source: parentId,
            target: keyNodeId,
            type: 'smoothstep',
            style: { stroke: darkMode ? '#9ca3af' : '#111827', strokeWidth: 2.5 },
            markerEnd: { type: MarkerType.ArrowClosed, color: darkMode ? '#9ca3af' : '#111827' },
          });
        }

        newEdges.push({
          id: `edge-${keyNodeId}-${valueNodeId}`,
          source: keyNodeId,
          target: valueNodeId,
          type: 'smoothstep',
          style: { stroke: darkMode ? '#9ca3af' : '#111827', strokeWidth: 2.5 },
          markerEnd: { type: MarkerType.ArrowClosed, color: darkMode ? '#9ca3af' : '#111827' },
        });

        return treeWidth;
      }

      const currentId = `node-${nodeId++}`;
      const nodeCategory = Array.isArray(obj) ? 'array' : 'object';

      newNodes.push({
        id: currentId,
        type: 'custom',
        position: { x: centerX, y: level * VERTICAL_SPACING },
        data: {
          label: key,
          nodeCategory,
          path,
          highlighted: false,
          darkMode,
        },
      });

      if (parentId) {
        newEdges.push({
          id: `edge-${parentId}-${currentId}`,
          source: parentId,
          target: currentId,
          type: 'smoothstep',
          style: { stroke: darkMode ? '#9ca3af' : '#111827', strokeWidth: 2.5 },
          markerEnd: { type: MarkerType.ArrowClosed, color: darkMode ? '#9ca3af' : '#111827' },
        });
      }

      let currentOffset = leftOffset;

      if (Array.isArray(obj)) {
        obj.forEach((item, idx) => {
          const childWidth = getTreeWidth(item);
          traverse(item, currentId, `[${idx}]`, level + 1, `${path}[${idx}]`, currentOffset);
          currentOffset += childWidth * HORIZONTAL_SPACING;
        });
      } else {
        Object.entries(obj).forEach(([k, v]) => {
          const childWidth = getTreeWidth(v);
          traverse(v, currentId, k, level + 1, `${path}.${k}`, currentOffset);
          currentOffset += childWidth * HORIZONTAL_SPACING;
        });
      }

      return treeWidth;
    };

    traverse(parsed);
    return { nodes: newNodes, edges: newEdges, error: null };
  } catch (err) {
    return { nodes: [], edges: [], error: `Invalid JSON: ${err.message}` };
  }
};

export const downloadTreeAsImage = (reactFlowInstance, getNodes, nodes, edges, darkMode) => {
  if (!reactFlowInstance || getNodes().length === 0) return;

  const nodesBounds = reactFlowInstance.getNodes().reduce((bounds, node) => {
    return {
      minX: Math.min(bounds.minX, node.position.x),
      minY: Math.min(bounds.minY, node.position.y),
      maxX: Math.max(bounds.maxX, node.position.x + 140),
      maxY: Math.max(bounds.maxY, node.position.y + 50),
    };
  }, { minX: Infinity, minY: Infinity, maxX: -Infinity, maxY: -Infinity });

  const padding = 100;
  const imageWidth = nodesBounds.maxX - nodesBounds.minX + padding * 2;
  const imageHeight = nodesBounds.maxY - nodesBounds.minY + padding * 2;

  const canvas = document.createElement('canvas');
  canvas.width = imageWidth;
  canvas.height = imageHeight;
  const ctx = canvas.getContext('2d');

  ctx.fillStyle = darkMode ? '#1e293b' : '#ffffff';
  ctx.fillRect(0, 0, imageWidth, imageHeight);

  ctx.strokeStyle = darkMode ? '#4b5563' : '#cbd5e1';
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

  edges.forEach((edge) => {
    const sourceNode = nodes.find((n) => n.id === edge.source);
    const targetNode = nodes.find((n) => n.id === edge.target);
    
    if (sourceNode && targetNode) {
      const sourceX = sourceNode.position.x - nodesBounds.minX + padding + 70;
      const sourceY = sourceNode.position.y - nodesBounds.minY + padding + 50;
      const targetX = targetNode.position.x - nodesBounds.minX + padding + 70;
      const targetY = targetNode.position.y - nodesBounds.minY + padding + 20;

      ctx.strokeStyle = darkMode ? '#9ca3af' : '#111827';
      ctx.lineWidth = 2.5;
      ctx.beginPath();
      ctx.moveTo(sourceX, sourceY);
      
      const midY = (sourceY + targetY) / 2;
      ctx.bezierCurveTo(
        sourceX, midY,
        targetX, midY,
        targetX, targetY
      );
      ctx.stroke();

      const arrowSize = 8;
      ctx.fillStyle = darkMode ? '#9ca3af' : '#111827';
      ctx.beginPath();
      ctx.moveTo(targetX, targetY);
      ctx.lineTo(targetX - arrowSize / 2, targetY - arrowSize);
      ctx.lineTo(targetX + arrowSize / 2, targetY - arrowSize);
      ctx.closePath();
      ctx.fill();
    }
  });

  nodes.forEach((node) => {
    const x = node.position.x - nodesBounds.minX + padding;
    const y = node.position.y - nodesBounds.minY + padding;
    
    const nodeWidth = 140;
    const nodeHeight = 50;
    const radius = 12;

    let bgColor, borderColor, textColor;
    
    if (node.data.highlighted) {
      bgColor = '#facc15';
      borderColor = '#ca8a04';
      textColor = '#000000';
    } else {
      switch (node.data.nodeCategory) {
        case 'key':
          bgColor = darkMode ? '#0d9488' : '#2dd4bf';
          borderColor = darkMode ? '#14b8a6' : '#0d9488';
          textColor = '#ffffff';
          break;
        case 'value':
          bgColor = darkMode ? '#ea580c' : '#fdba74';
          borderColor = darkMode ? '#f97316' : '#ea580c';
          textColor = darkMode ? '#f3f4f6' : '#1f2937';
          break;
        case 'object':
          bgColor = darkMode ? '#2563eb' : '#60a5fa';
          borderColor = darkMode ? '#3b82f6' : '#2563eb';
          textColor = '#ffffff';
          break;
        case 'array':
          bgColor = darkMode ? '#0d9488' : '#2dd4bf';
          borderColor = darkMode ? '#14b8a6' : '#0d9488';
          textColor = '#ffffff';
          break;
        default:
          bgColor = darkMode ? '#374151' : '#d1d5db';
          borderColor = darkMode ? '#4b5563' : '#9ca3af';
          textColor = darkMode ? '#f3f4f6' : '#1f2937';
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
    ctx.font = 'bold 14px sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    
    const label = String(node.data.label);
    const maxWidth = nodeWidth - 20;
    let displayText = label;
    
    if (ctx.measureText(label).width > maxWidth) {
      while (ctx.measureText(displayText + '...').width > maxWidth && displayText.length > 0) {
        displayText = displayText.slice(0, -1);
      }
      displayText += '...';
    }
    
    ctx.fillText(displayText, x + nodeWidth / 2, y + nodeHeight / 2);
  });

  canvas.toBlob((blob) => {
    const link = document.createElement('a');
    link.download = `json-tree-${Date.now()}.png`;
    link.href = URL.createObjectURL(blob);
    link.click();
  });
};
