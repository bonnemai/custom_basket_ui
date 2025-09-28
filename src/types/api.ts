export interface BasketPosition {
  ticker: string;
  weight: number;
  metadata?: Record<string, string>;
}

export interface BasketPositionSnapshot {
  ticker: string;
  weight: number;
  normalized_weight: number;
  price: number;
  price_currency: string;
  price_in_base: number;
  fx_rate_to_base: number;
  contribution: number;
  position_notional: number;
  quantity: number;
  currency: string;
}

export interface BasketSnapshot {
  basket_name: string;
  base_currency: string;
  weight_sum: number;
  basket_price: number;
  total_notional: number;
  positions: BasketPositionSnapshot[];
  messages: string[];
  basket_id: string;
  created_at: string;
  updated_at: string;
}

export interface BasketStreamPayload {
  as_of: string;
  baskets: BasketSnapshot[];
}

export interface CreateBasketRequest {
  basket_name: string;
  base_currency: string;
  positions: BasketPosition[];
  notional: number;
}

export interface CreateBasketResponse {
  basket_id?: string;
  [key: string]: unknown;
}

export interface ApiError {
  message: string;
  details?: unknown;
}
