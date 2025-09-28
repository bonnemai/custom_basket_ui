import { useState } from 'react';
import type { ApiError, CreateBasketRequest, CreateBasketResponse } from '../types/api';

const envBaseUrl = import.meta.env?.VITE_CUSTOM_BASKET_API_URL;

const ensureTrailingSlash = (value: string): string =>
  value.endsWith('/') ? value : `${value}/`;

const resolveBaseUrl = (candidate?: string): string => {
  if (typeof candidate === 'string' && candidate.trim().length > 0) {
    return ensureTrailingSlash(candidate.trim());
  }
  return 'http://localhost:8000/';
};

export const API_BASE_URL = resolveBaseUrl(envBaseUrl);
const CREATE_RESOURCE = 'baskets';

export const DEFAULT_ENDPOINT = `${API_BASE_URL}${CREATE_RESOURCE}`;

type CreateBasketState = {
  loading: boolean;
  data?: CreateBasketResponse;
  error?: ApiError;
};

export function useCreateBasket(endpoint = DEFAULT_ENDPOINT) {
  const [state, setState] = useState<CreateBasketState>({ loading: false });

  const addBasket = async (payload: CreateBasketRequest) => {
    setState({ loading: true });
    try {
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
      });

      if (!response.ok) {
        const message = await response.text();
        throw new Error(message || response.statusText);
      }

      const data: CreateBasketResponse = await response.json();
      setState({ loading: false, data });
      return data;
    } catch (error) {
      const err: ApiError = {
        message: error instanceof Error ? error.message : 'Unknown error',
        details: error
      };
      setState({ loading: false, error: err });
      throw error;
    }
  };

  return {
    ...state,
    addBasket
  };
}
