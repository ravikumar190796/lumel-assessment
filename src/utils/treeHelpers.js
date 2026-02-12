export const initialData = {
  rows: [
    {
      id: 'electronics',
      label: 'Electronics',
      value: 1500,
      children: [
        {
          id: 'phones',
          label: 'Phones',
          value: 800,
        },
        {
          id: 'laptops',
          label: 'Laptops',
          value: 700,
        },
      ],
    },
    {
      id: 'furniture',
      label: 'Furniture',
      value: 1000,
      children: [
        {
          id: 'tables',
          label: 'Tables',
          value: 300,
        },
        {
          id: 'chairs',
          label: 'Chairs',
          value: 700,
        },
      ],
    },
  ],
};

export function roundToTwo(value) {
  return Math.round((value + Number.EPSILON) * 100) / 100;
}

export function prepareInitialTree(rows, depth = 0, parentId = null) {
  return rows.map((row) => {
    const hasChildren = Array.isArray(row.children) && row.children.length > 0;
    const baseNode = {
      id: row.id,
      label: row.label,
      depth,
      parentId,
      originalValue: 0,
      currentValue: 0,
      children: [],
    };

    if (!hasChildren) {
      const value = Number(row.value) || 0;
      return {
        ...baseNode,
        originalValue: value,
        currentValue: value,
        children: [],
      };
    }

    const preparedChildren = prepareInitialTree(row.children, depth + 1, row.id);
    const sum = preparedChildren.reduce((total, child) => total + child.currentValue, 0);

    return {
      ...baseNode,
      originalValue: sum,
      currentValue: sum,
      children: preparedChildren,
    };
  });
}

export function findNodeById(nodes, id) {
  for (const node of nodes) {
    if (node.id === id) return node;
    if (node.children && node.children.length > 0) {
      const found = findNodeById(node.children, id);
      if (found) return found;
    }
  }
  return null;
}

export function collectLeafNodes(node, acc = []) {
  if (!node.children || node.children.length === 0) {
    acc.push(node);
    return acc;
  }
  node.children.forEach((child) => collectLeafNodes(child, acc));
  return acc;
}

export function updateTreeWithLeafValues(nodes, leafTargetValues) {
  return nodes.map((node) => {
    if (!node.children || node.children.length === 0) {
      const override = Object.prototype.hasOwnProperty.call(leafTargetValues, node.id)
        ? leafTargetValues[node.id]
        : node.currentValue;

      return {
        ...node,
        currentValue: roundToTwo(override),
      };
    }

    const updatedChildren = updateTreeWithLeafValues(node.children, leafTargetValues);
    const sum = updatedChildren.reduce((total, child) => total + child.currentValue, 0);

    return {
      ...node,
      children: updatedChildren,
      currentValue: roundToTwo(sum),
    };
  });
}

export function formatNumber(value) {
  return value.toLocaleString(undefined, {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
}

export function computeVariancePercent(current, original) {
  if (!original) {
    return 0;
  }
  return ((current - original) / original) * 100;
}

