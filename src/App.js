import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from 'react';
import { Alert, Button, Card, Col, Form, Input, InputNumber, Row, Space, Tag, Typography } from 'antd';
import { useCreateBasket, API_BASE_URL } from './hooks/useCreateBasket';
import { useBasketStream } from './hooks/useBasketStream';
import PositionsGrid from './components/PositionsGrid';
import ExistingBasketsGrid from './components/ExistingBasketsGrid';
import { createInitialRequest } from './utils/defaults';
export const cleansePayload = (payload) => ({
    ...payload,
    positions: payload.positions.map((position) => {
        const metadataEntries = Object.entries(position.metadata ?? {});
        const filteredMetadata = Object.fromEntries(metadataEntries.filter(([key]) => key.trim().length > 0));
        return {
            ...position,
            weight: Number(position.weight),
            ...(Object.keys(filteredMetadata).length > 0 ? { metadata: filteredMetadata } : {})
        };
    }),
    notional: Number(Number(payload.notional).toFixed(2))
});
const DOCS_URL = `${API_BASE_URL}docs#/`;
const releaseDateTimeLabel = new Date(import.meta.env.VITE_RELEASE_TIMESTAMP ?? Date.now()).toLocaleString();
function App() {
    const [formData, setFormData] = useState(createInitialRequest);
    const { loading, data, error, addBasket } = useCreateBasket();
    const { baskets, asOf, connected, error: streamError } = useBasketStream();
    const { Title, Paragraph, Link, Text } = Typography;
    const handlePrimitiveChange = (field, value) => {
        setFormData((current) => ({
            ...current,
            [field]: value
        }));
    };
    const handlePositionsChange = (nextPositions) => {
        setFormData((current) => ({
            ...current,
            positions: nextPositions
        }));
    };
    const handleSubmit = async (event) => {
        event.preventDefault();
        const payload = cleansePayload(formData);
        await addBasket(payload);
    };
    const handleReset = () => {
        setFormData(createInitialRequest());
    };
    return (_jsx("main", { children: _jsxs(Space, { direction: "vertical", size: "large", style: { width: '100%' }, children: [_jsxs("div", { children: [_jsx(Title, { level: 2, children: "Custom Basket Builder" }), _jsx(Paragraph, { children: "Configure your basket and send it to the basket service for intraday pricing." })] }), _jsx(Form, { layout: "vertical", onSubmitCapture: handleSubmit, children: _jsxs(Space, { direction: "vertical", size: "large", style: { width: '100%' }, children: [_jsx(Card, { title: "Basket Configuration", children: _jsxs(Space, { direction: "vertical", size: "large", style: { width: '100%' }, children: [_jsxs(Row, { gutter: [16, 16], children: [_jsx(Col, { xs: 24, md: 12, lg: 8, children: _jsx(Form.Item, { label: "Basket Name", required: true, children: _jsx(Input, { value: formData.basket_name, onChange: (event) => handlePrimitiveChange('basket_name', event.target.value), required: true }) }) }), _jsx(Col, { xs: 24, md: 12, lg: 8, children: _jsx(Form.Item, { label: "Base Currency", required: true, children: _jsx(Input, { value: formData.base_currency, onChange: (event) => handlePrimitiveChange('base_currency', event.target.value), required: true }) }) }), _jsx(Col, { xs: 24, md: 12, lg: 8, children: _jsx(Form.Item, { label: "Notional", required: true, children: _jsx(InputNumber, { className: "notional-input-number", min: 0, step: 0.01, precision: 2, style: { width: '100%' }, formatter: (value) => {
                                                                if (value == null) {
                                                                    return '';
                                                                }
                                                                const [integer, decimal] = value.toString().split('.');
                                                                const withSeparators = integer.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
                                                                return decimal ? `${withSeparators}.${decimal}` : withSeparators;
                                                            }, parser: (value) => {
                                                                if (!value) {
                                                                    return 0;
                                                                }
                                                                const normalized = value.replace(/,/g, '');
                                                                const parsed = Number(normalized);
                                                                return Number.isFinite(parsed) ? parsed : 0;
                                                            }, value: formData.notional, onChange: (value) => handlePrimitiveChange('notional', Number(value ?? 0)) }) }) })] }), _jsx(PositionsGrid, { positions: formData.positions, onChange: handlePositionsChange }), _jsxs(Space, { children: [_jsx(Button, { type: "primary", htmlType: "submit", loading: loading, children: "Add Basket" }), _jsx(Button, { htmlType: "button", onClick: handleReset, disabled: loading, children: "Reset to sample" })] })] }) }), _jsx(Card, { title: "Live Basket Prices", extra: _jsx(Tag, { color: connected ? 'green' : 'red', children: connected ? 'Live' : 'Offline' }), children: _jsxs(Space, { direction: "vertical", size: "small", style: { width: '100%' }, children: [_jsxs(Text, { type: "secondary", children: ["Latest update: ", asOf ? new Date(asOf).toLocaleString() : '—'] }), _jsx(ExistingBasketsGrid, { baskets: baskets })] }) })] }) }), error && (_jsx(Alert, { type: "error", showIcon: true, message: "Add basket request failed", description: error.message })), streamError && (_jsx(Alert, { type: "warning", showIcon: true, message: "Basket stream", description: streamError })), _jsx("div", { style: { textAlign: 'center', marginTop: 24 }, children: _jsxs(Space, { direction: "vertical", size: "small", style: { width: '100%' }, children: [_jsx(Link, { href: DOCS_URL, target: "_blank", rel: "noreferrer noopener", children: "API documentation" }), _jsxs(Text, { type: "secondary", children: ["Release built: ", releaseDateTimeLabel] }), _jsx(Link, { href: "https://github.com/bonnemai/custom_basket_ui", target: "_blank", rel: "noreferrer noopener", children: "Olivier Bonnemaison" })] }) })] }) }));
}
export default App;
