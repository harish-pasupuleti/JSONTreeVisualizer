export const parseJSONPath = (path) => {
  const cleanPath = path.replace(/^\$\.?/, '');
  if (!cleanPath) return [];
  const parts = [];
  let current = '';
  let inBracket = false;

  for (let ch of cleanPath) {
    if (ch === '[') {
      if (current) parts.push(current), (current = '');
      inBracket = true;
    } else if (ch === ']') {
      if (current) parts.push(parseInt(current)), (current = '');
      inBracket = false;
    } else if (ch === '.' && !inBracket) {
      if (current) parts.push(current), (current = '');
    } else {
      current += ch;
    }
  }
  if (current) parts.push(current);
  return parts;
};
