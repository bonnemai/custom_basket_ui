import { useEffect, useMemo, useState } from 'react';
import type { BasketSnapshot, BasketStreamPayload } from '../types/api';
import { API_BASE_URL } from './useCreateBasket';

const BASKETS_RESOURCE = 'baskets';
export const BASKETS_ENDPOINT = `${API_BASE_URL}${BASKETS_RESOURCE}`;
const POLLING_INTERVAL_MS = 1000; // Poll every second

type BasketStreamState = {
  baskets: BasketSnapshot[];
  asOf?: string;
  connected: boolean;
  error?: string;
};

export function useBasketStream() {
  const [state, setState] = useState<BasketStreamState>({ baskets: [], connected: false });

  useEffect(() => {
    let isActive = true;
    let timeoutId: NodeJS.Timeout | null = null;

    const fetchBaskets = async () => {
      try {
        const response = await fetch(BASKETS_ENDPOINT, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json'
          }
        });

        if (!response.ok) {
          throw new Error(`Failed to fetch baskets: ${response.statusText}`);
        }

        const data = await response.json();

        if (isActive) {
          // Handle both array response and wrapped response formats
          const baskets = Array.isArray(data) ? data : (data as BasketStreamPayload).baskets;
          const asOf = Array.isArray(data) ? new Date().toISOString() : (data as BasketStreamPayload).as_of;

          setState({
            baskets: baskets || [],
            asOf,
            connected: true,
            error: undefined
          });
        }
      } catch (error) {
        if (isActive) {
          setState((current) => ({
            ...current,
            connected: false,
            error: error instanceof Error ? error.message : 'Failed to fetch baskets'
          }));
        }
      } finally {
        if (isActive) {
          timeoutId = setTimeout(fetchBaskets, POLLING_INTERVAL_MS);
        }
      }
    };

    // Start polling immediately
    fetchBaskets();

    return () => {
      isActive = false;
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
    };
  }, []);

  const derivedState = useMemo(() => state, [state]);

  return derivedState;
}
