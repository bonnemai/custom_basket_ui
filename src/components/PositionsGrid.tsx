import { useCallback, useMemo, useRef } from 'react';
import type { CellValueChangedEvent, ColDef } from 'ag-grid-community';
import { AgGridReact } from 'ag-grid-react';
import type { AgGridReact as AgGridReactType } from 'ag-grid-react';
import { Button, Space, Typography } from 'antd';
import { DeleteOutlined, PlusOutlined } from '@ant-design/icons';
import type { BasketPosition } from '../types/api';
import { createEmptyPosition } from '../utils/defaults';

import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-quartz.css';

type PositionsGridProps = {
  positions: BasketPosition[];
  onChange: (positions: BasketPosition[]) => void;
};

const numberOrZero = (value: unknown): number => {
  const numeric = Number(value);
  return Number.isFinite(numeric) ? numeric : 0;
};

export function PositionsGrid({ positions, onChange }: PositionsGridProps) {
  const gridRef = useRef<AgGridReactType<BasketPosition>>(null);

  const columnDefs = useMemo<ColDef<BasketPosition>[]>(
    () => [
      {
        field: 'ticker',
        headerName: 'Ticker',
        editable: true,
        minWidth: 140,
        flex: 1
      },
      {
        field: 'weight',
        headerName: 'Weight',
        editable: true,
        minWidth: 120,
        valueParser: (params) => numberOrZero(params.newValue),
        valueFormatter: (params) => String(params.value ?? 0),
        type: 'numericColumn'
      }
    ],
    []
  );

  const defaultColDef = useMemo<ColDef>(() => ({
    sortable: true,
    resizable: true,
    filter: true,
    suppressHeaderMenuButton: true
  }), []);

  const handleCellValueChanged = useCallback(
    (event: CellValueChangedEvent<BasketPosition>) => {
      if (event.rowIndex == null || event.rowIndex < 0 || !event.data) {
        return;
      }

      const updated = positions.map((row, index) =>
        index === event.rowIndex
          ? {
              ...row,
              ...event.data,
              weight: numberOrZero(event.data.weight)
            }
          : row
      );

      onChange(updated);
    },
    [positions, onChange]
  );

  const handleAddRow = useCallback(() => {
    onChange([...positions, createEmptyPosition()]);
  }, [positions, onChange]);

  const handleRemoveSelected = useCallback(() => {
    const selectedNodes = gridRef.current?.api.getSelectedNodes() ?? [];
    const selectedIndexes = selectedNodes
      .map((node) => node.rowIndex)
      .filter((index): index is number => index != null && index >= 0);

    if (selectedIndexes.length === 0) {
      return;
    }

    const indexSet = new Set(selectedIndexes);
    const updated = positions.filter((_, index) => !indexSet.has(index));

    if (updated.length === 0) {
      return;
    }

    onChange(updated);
  }, [positions, onChange]);

  return (
    <div className="positions-grid">
      <Typography.Paragraph type="secondary" className="positions-grid__description">
        Use the grid to capture the basket tickers and their weights. Hold Shift to select multiple
        rows for removal.
      </Typography.Paragraph>

      <Space className="positions-grid__controls">
        <Button type="primary" icon={<PlusOutlined />} onClick={handleAddRow}>
          Add Position
        </Button>
        <Button
          danger
          icon={<DeleteOutlined />}
          onClick={handleRemoveSelected}
          disabled={positions.length <= 1}
        >
          Remove Selected
        </Button>
      </Space>

      <div className="ag-theme-quartz positions-grid__table">
        <AgGridReact<BasketPosition>
          ref={gridRef}
          rowData={positions}
          columnDefs={columnDefs}
          defaultColDef={defaultColDef}
          rowSelection="multiple"
          animateRows
          onCellValueChanged={handleCellValueChanged}
        />
      </div>
    </div>
  );
}

export default PositionsGrid;
