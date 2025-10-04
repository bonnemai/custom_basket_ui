export const createEmptyPosition = () => ({
    ticker: '',
    weight: 0,
    metadata: {}
});
export const createInitialRequest = () => ({
    basket_name: 'Sample Basket',
    base_currency: 'USD',
    positions: [
        {
            ticker: 'AAPL',
            weight: 0.5
        }
    ],
    notional: 1000000
});
