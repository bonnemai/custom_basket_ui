import type { BasketPosition, CreateBasketRequest } from '../types/api';

export const createEmptyPosition = (): BasketPosition => ({
  ticker: '',
  weight: 0,
  metadata: {}
});

export const createInitialRequest = (): CreateBasketRequest => ({
  basket_name: 'Sample Basket',
  base_currency: 'USD',
  positions: [
    {
      ticker: 'AAPL',
      weight: 0.5
    }
  ],
  notional: 1_000_000
});
