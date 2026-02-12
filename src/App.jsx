import React, { useMemo, useState } from 'react';
import './App.css';
import { initialData, prepareInitialTree, collectLeafNodes, findNodeById, updateTreeWithLeafValues } from './utils/treeHelpers';
import Table from './components/Table';

function App() {
  const [tree, setTree] = useState(() => prepareInitialTree(initialData.rows));
  const [inputs, setInputs] = useState({});
  const [errors, setErrors] = useState({});

  const grandTotals = useMemo(() => {
    return tree.reduce(
      (acc, node) => {
        acc.current += node.currentValue;
        acc.original += node.originalValue;
        return acc;
      },
      { current: 0, original: 0 }
    );
  }, [tree]);

  const handleInputChange = (id, value) => {
    setInputs((prev) => ({
      ...prev,
      [id]: value,
    }));

    if (value === '') {
      setErrors((prev) => {
        const next = { ...prev };
        delete next[id];
        return next;
      });
      return;
    }

    const parsed = parseFloat(value);
    if (!Number.isFinite(parsed)) {
      setErrors((prev) => ({
        ...prev,
        [id]: 'Enter a valid number',
      }));
    } else {
      setErrors((prev) => {
        const next = { ...prev };
        delete next[id];
        return next;
      });
    }
  };

  const handleAllocationPercent = (id) => {
    const raw = inputs[id];
    const percent = parseFloat(raw);

    if (!Number.isFinite(percent)) {
      setErrors((prev) => ({
        ...prev,
        [id]: 'Enter a valid percentage',
      }));
      return;
    }

    setErrors((prev) => {
      const next = { ...prev };
      delete next[id];
      return next;
    });

    setTree((prevTree) => {
      const node = findNodeById(prevTree, id);
      if (!node) return prevTree;

      if (!node.children || node.children.length === 0) {
        const newLeafValue = node.currentValue * (1 + percent / 100);
        const leafUpdates = { [id]: newLeafValue };
        return updateTreeWithLeafValues(prevTree, leafUpdates);
      }

      const leaves = collectLeafNodes(node);
      if (!leaves.length) return prevTree;

      const factor = 1 + percent / 100;
      const leafUpdates = {};
      leaves.forEach((leaf) => {
        leafUpdates[leaf.id] = leaf.currentValue * factor;
      });

      return updateTreeWithLeafValues(prevTree, leafUpdates);
    });
  };

  const handleAllocationValue = (id) => {
    const raw = inputs[id];
    const value = parseFloat(raw);

    if (!Number.isFinite(value)) {
      setErrors((prev) => ({
        ...prev,
        [id]: 'Enter a valid value',
      }));
      return;
    }

    setErrors((prev) => {
      const next = { ...prev };
      delete next[id];
      return next;
    });

    setTree((prevTree) => {
      const node = findNodeById(prevTree, id);
      if (!node) return prevTree;

      if (!node.children || node.children.length === 0) {
        const leafUpdates = { [id]: value };
        return updateTreeWithLeafValues(prevTree, leafUpdates);
      }

      const leaves = collectLeafNodes(node);
      if (!leaves.length) return prevTree;

      const currentTotal = leaves.reduce(
        (total, leaf) => total + leaf.currentValue,
        0
      );

      const leafUpdates = {};

      if (currentTotal === 0) {
        const evenShare = value / leaves.length;
        leaves.forEach((leaf) => {
          leafUpdates[leaf.id] = evenShare;
        });
      } else {
        leaves.forEach((leaf) => {
          const contribution = leaf.currentValue / currentTotal;
          const newLeafValue = value * contribution;
          leafUpdates[leaf.id] = newLeafValue;
        });
      }

      return updateTreeWithLeafValues(prevTree, leafUpdates);
    });
  };

  return (
    <div className="App">
      <div className="app-container">
        <Table
          tree={tree}
          inputs={inputs}
          errors={errors}
          grandTotals={grandTotals}
          onInputChange={handleInputChange}
          onAllocationPercent={handleAllocationPercent}
          onAllocationValue={handleAllocationValue}
        />
      </div>
    </div>
  );
}

export default App;

