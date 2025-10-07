import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { useCallback, useMemo, useRef } from 'react';
import { AgGridReact } from 'ag-grid-react';
import { Button, Space, Typography, message } from 'antd';
import { DeleteOutlined, PlusOutlined, SnippetsOutlined } from '@ant-design/icons';
import { createEmptyPosition } from '../utils/defaults';
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-quartz.css';
const numberOrZero = (value) => {
    const numeric = Number(value);
    return Number.isFinite(numeric) ? numeric : 0;
};
const parseClipboardText = (raw) => {
    if (!raw) {
        return [];
    }
    return raw
        .split(/\r?\n/)
        .map((line) => line.trim())
        .filter((line) => line.length > 0)
        .map((line) => line.split(/\t|,/).map((cell) => cell.trim()))
        .filter((cells) => cells.length > 0)
        .filter((cells, index) => {
        if (index === 0) {
            const header = cells.join(' ').toLowerCase();
            if (header.includes('ticker') && header.includes('weight')) {
                return false;
            }
        }
        return true;
    })
        .map((cells) => {
        const [ticker = '', weightCell = ''] = cells;
        const parsedWeight = Number(weightCell);
        const weight = Number.isFinite(parsedWeight) ? parsedWeight : 0;
        return {
            ...createEmptyPosition(),
            ticker,
            weight
        };
    })
        .filter((position) => position.ticker.length > 0);
};
export function PositionsGrid({ positions, onChange }) {
    const gridRef = useRef(null);
    const [messageApi, contextHolder] = message.useMessage();
    const columnDefs = useMemo(() => [
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
    ], []);
    const defaultColDef = useMemo(() => ({
        sortable: true,
        resizable: true,
        filter: true,
        suppressHeaderMenuButton: true,
        enableCellChangeFlash: true
    }), []);
    const handleCellValueChanged = useCallback((event) => {
        if (event.rowIndex == null || event.rowIndex < 0 || !event.data) {
            return;
        }
        const updated = positions.map((row, index) => index === event.rowIndex
            ? {
                ...row,
                ...event.data,
                weight: numberOrZero(event.data.weight)
            }
            : row);
        onChange(updated);
    }, [positions, onChange]);
    const handleAddRow = useCallback(() => {
        onChange([...positions, createEmptyPosition()]);
    }, [positions, onChange]);
    const handleRemoveSelected = useCallback(() => {
        const selectedNodes = gridRef.current?.api.getSelectedNodes() ?? [];
        const selectedIndexes = selectedNodes
            .map((node) => node.rowIndex)
            .filter((index) => index != null && index >= 0);
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
    const handlePasteFromClipboard = useCallback(async () => {
        try {
            if (!navigator.clipboard?.readText) {
                messageApi.warning('Clipboard access is not available. Try Ctrl/Cmd + V directly in the grid.');
                gridRef.current?.api.pasteFromClipboard();
                return;
            }
            const text = await navigator.clipboard.readText();
            const parsed = parseClipboardText(text);
            if (parsed.length === 0) {
                messageApi.info('No valid ticker/weight rows found in the clipboard.');
                return;
            }
            const shouldReplaceExisting = positions.length === 1 && positions[0]?.ticker === '' && positions[0]?.weight === 0;
            const nextPositions = shouldReplaceExisting ? parsed : [...positions, ...parsed];
            onChange(nextPositions);
            messageApi.success(`Added ${parsed.length} position${parsed.length > 1 ? 's' : ''} from clipboard.`);
        }
        catch (error) {
            messageApi.error('Unable to read clipboard contents.');
        }
    }, [messageApi, onChange, positions]);
    return (_jsxs(_Fragment, { children: [contextHolder, _jsxs("div", { className: "positions-grid", children: [_jsx(Typography.Paragraph, { type: "secondary", className: "positions-grid__description", children: "Use the grid to capture the basket tickers and their weights. Hold Shift to select multiple rows for removal." }), _jsxs(Space, { className: "positions-grid__controls", children: [_jsx(Button, { type: "primary", icon: _jsx(PlusOutlined, {}), onClick: handleAddRow, children: "Add Position" }), _jsx(Button, { icon: _jsx(SnippetsOutlined, {}), onClick: handlePasteFromClipboard, children: "Paste From Clipboard" }), _jsx(Button, { danger: true, icon: _jsx(DeleteOutlined, {}), onClick: handleRemoveSelected, disabled: positions.length <= 1, children: "Remove Selected" })] }), _jsx("div", { className: "ag-theme-quartz positions-grid__table", children: _jsx(AgGridReact, { ref: gridRef, rowData: positions, columnDefs: columnDefs, defaultColDef: defaultColDef, rowSelection: "multiple", animateRows: true, ensureDomOrder: true, enterNavigatesVerticallyAfterEdit: true, onCellValueChanged: handleCellValueChanged }) })] })] }));
}
export default PositionsGrid;
