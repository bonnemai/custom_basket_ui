import { jsx as _jsx } from "react/jsx-runtime";
import { useMemo, useCallback } from 'react';
import { AgGridReact } from 'ag-grid-react';
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-quartz.css';
const formatNumber = (value, fractionDigits = 2) => {
    if (typeof value !== 'number' || Number.isNaN(value)) {
        return '';
    }
    return value.toLocaleString(undefined, {
        minimumFractionDigits: fractionDigits,
        maximumFractionDigits: fractionDigits
    });
};
export function ExistingBasketsGrid({ baskets }) {
    const columnDefs = useMemo(() => [
        { field: 'basket_name', headerName: 'Basket Name', flex: 1, minWidth: 160 },
        { field: 'basket_id', headerName: 'Basket ID', flex: 1, minWidth: 160 },
        { field: 'base_currency', headerName: 'Base', width: 100 },
        {
            field: 'weight_sum',
            headerName: 'Weight Sum',
            width: 130,
            type: 'numericColumn',
            valueFormatter: ({ value }) => formatNumber(value, 3)
        },
        {
            field: 'basket_price',
            headerName: 'Basket Price',
            width: 150,
            type: 'numericColumn',
            valueFormatter: ({ value }) => formatNumber(value, 3)
        },
        {
            field: 'total_notional',
            headerName: 'Total Notional',
            width: 170,
            type: 'numericColumn',
            valueFormatter: ({ value }) => formatNumber(value, 0)
        },
        {
            field: 'positions',
            headerName: 'Positions',
            width: 120,
            type: 'numericColumn',
            valueFormatter: ({ value }) => Array.isArray(value) ? String(value.length) : '0'
        },
        {
            field: 'updated_at',
            headerName: 'Updated At',
            flex: 1,
            minWidth: 200,
            valueFormatter: ({ value }) => typeof value === 'string' ? new Date(value).toLocaleString() : ''
        }
    ], []);
    const getRowId = useCallback((params) => {
        const snapshot = params.data;
        if (snapshot?.basket_id) {
            return snapshot.basket_id;
        }
        if (snapshot?.basket_name) {
            return `name:${snapshot.basket_name}`;
        }
        if (typeof snapshot?.basket_price === 'number') {
            return `basket-price-${snapshot.basket_price}`;
        }
        if (snapshot) {
            return `snapshot-${JSON.stringify(snapshot)}`;
        }
        return 'basket-row-fallback';
    }, []);
    return (_jsx("div", { className: "ag-theme-quartz", style: { width: '100%', height: 320 }, children: _jsx(AgGridReact, { rowData: baskets, columnDefs: columnDefs, defaultColDef: { sortable: true, resizable: true, filter: true }, getRowId: getRowId, animateRows: true }) }));
}
export default ExistingBasketsGrid;
