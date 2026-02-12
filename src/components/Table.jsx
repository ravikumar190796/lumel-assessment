import React from 'react';
import Row from './Row';
import { computeVariancePercent, formatNumber } from '../utils/treeHelpers';

function Table({
  tree,
  inputs,
  errors,
  grandTotals,
  onInputChange,
  onAllocationPercent,
  onAllocationValue,
}) {
  const grandVariance = computeVariancePercent(
    grandTotals.current,
    grandTotals.original
  );

  return (
    <div className="table-wrapper">
      <table className="allocation-table">
        <thead>
          <tr>
            <th className="label-col">Label</th>
            <th className="value-col">Value</th>
            <th className="input-col">Input</th>
            <th className="action-col">Allocation %</th>
            <th className="action-col">Allocation Val</th>
            <th className="variance-col">Variance %</th>
          </tr>
        </thead>
        <tbody>
          {tree.map((node) => (
            <Row
              key={node.id}
              node={node}
              inputs={inputs}
              errors={errors}
              onInputChange={onInputChange}
              onAllocationPercent={onAllocationPercent}
              onAllocationValue={onAllocationValue}
            />
          ))}
          <tr className="grand-total-row">
            <td className="label-cell">Grand Total</td>
            <td className="value-cell">
              {formatNumber(grandTotals.current)}
            </td>
            <td className="input-cell" colSpan={3}></td>
            <td className="variance-cell">
              {formatNumber(grandVariance)}%
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}

export default Table;

