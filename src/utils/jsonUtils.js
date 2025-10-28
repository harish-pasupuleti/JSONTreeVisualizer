import { MarkerType } from 'reactflow';

export const SAMPLE_JSON = {
  user: {
    id: 1,
    name: 'John Doe',
    email: 'john@example.com',
    address: {
      street: '123 Main St',
      city: 'New York',
      zipcode: '10001',
    },
    active: true,
  },
  items: [
    { id: 101, product: 'Laptop', price: 999.99 },
    { id: 102, product: 'Mouse', price: 29.99 },
  ],
  metadata: {
    version: '1.0',
    timestamp: '2025-01-15T10:30:00Z',
    features: ['search', 'export', 'analytics'],
  },
};

export function buildTree(parsed, darkMode = false) {
  const newNodes = [];
  const newEdges = [];
  let nodeId = 0;

  const HORIZONTAL_SPACING = 220;
  const VERTICAL_SPACING = 130;

  const getTreeWidth = (obj) => {
    if (obj === null || typeof obj !== 'object') return 1;
    if (Array.isArray(obj)) {
      if (obj.length === 0) return 1;
      return obj.reduce((sum, item) => sum + getTreeWidth(item), 0);
    }
    const entries = Object.entries(obj);
    if (entries.length === 0) return 1;
    return entries.reduce((sum, [, v]) => sum + getTreeWidth(v), 0);
  };

  const traverse = (obj, parentId = null, key = 'root', level = 0, path = '$', leftOffset = 0) => {
    const treeWidth = getTreeWidth(obj);
    const centerX = leftOffset + (treeWidth * HORIZONTAL_SPACING) / 2 - HORIZONTAL_SPACING / 2;

    if (obj === null || typeof obj !== 'object') {
      const keyNodeId = `node-${nodeId++}`;
      newNodes.push({
        id: keyNodeId,
        type: 'custom',
        position: { x: centerX, y: level * VERTICAL_SPACING },
        data: { label: key, nodeCategory: 'key', path, highlighted: false, darkMode },
      });

      const valueNodeId = `node-${nodeId++}`;
      newNodes.push({
        id: valueNodeId,
        type: 'custom',
        position: { x: centerX, y: (level + 1) * VERTICAL_SPACING },
        data: { label: String(obj), nodeCategory: 'value', path, highlighted: false, darkMode },
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
      data: { label: key, nodeCategory, path, highlighted: false, darkMode },
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
  return { nodes: newNodes, edges: newEdges };
}