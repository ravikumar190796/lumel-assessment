import React from 'react';
import { computeVariancePercent, formatNumber } from '../utils/treeHelpers';

function Row({
  node,
  inputs,
  errors,
  onInputChange,
  onAllocationPercent,
  onAllocationValue,
}) {
  const variance = computeVariancePercent(
    node.currentValue,
    node.originalValue
  );

  const hasChildren = node.children && node.children.length > 0;
  const inputValue = inputs[node.id] ?? '';
  const error = errors[node.id];

  return (
    <>
      <tr className={hasChildren ? 'subtotal-row' : 'leaf-row'}>
        <td className="label-cell">
          <span
            className="label-text"
            style={{ paddingLeft: `${node.depth * 16}px` }}
          >
            {node.depth > 0 && <span className="label-prefix">-- </span>}
            {node.label}
          </span>
        </td>
        <td className="value-cell">
          {formatNumber(node.currentValue)}
        </td>
        <td className="input-cell">
          <div className="input-wrapper">
            <input
              type="number"
              className="value-input"
              value={inputValue}
              onChange={(e) => onInputChange(node.id, e.target.value)}
            />
            {error && (
              <div className="input-error">{error}</div>
            )}
          </div>
        </td>
        <td className="action-cell">
          <button
            type="button"
            className="btn btn-secondary"
            onClick={() => onAllocationPercent(node.id)}
          >
            Allocation %
          </button>
        </td>
        <td className="action-cell">
          <button
            type="button"
            className="btn btn-primary"
            onClick={() => onAllocationValue(node.id)}
          >
            Allocation Val
          </button>
        </td>
        <td className="variance-cell">
          {formatNumber(variance)}%
        </td>
      </tr>
      {hasChildren &&
        node.children.map((child) => (
          <Row
            key={child.id}
            node={child}
            inputs={inputs}
            errors={errors}
            onInputChange={onInputChange}
            onAllocationPercent={onAllocationPercent}
            onAllocationValue={onAllocationValue}
          />
        ))}
    </>
  );
}

export default Row;

