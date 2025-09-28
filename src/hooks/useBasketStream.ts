import { useEffect, useMemo, useState } from 'react';
import type { BasketSnapshot, BasketStreamPayload } from '../types/api';
import { API_BASE_URL } from './useCreateBasket';

const STREAM_RESOURCE = 'baskets/stream';
export const BASKET_STREAM_ENDPOINT = `${API_BASE_URL}${STREAM_RESOURCE}`;

type BasketStreamState = {
  baskets: BasketSnapshot[];
  asOf?: string;
  connected: boolean;
  error?: string;
};

const supportsEventSource = (): boolean => {
  if (typeof window === 'undefined') {
    return false;
  }

  return typeof window.EventSource !== 'undefined';
};

export function useBasketStream() {
  const [state, setState] = useState<BasketStreamState>({ baskets: [], connected: false });

  useEffect(() => {
    if (!supportsEventSource()) {
      return undefined;
    }

    const source = new window.EventSource(BASKET_STREAM_ENDPOINT);

    const handlePrices = (event: MessageEvent<string>) => {
      try {
        const payload = JSON.parse(event.data) as BasketStreamPayload;
        setState({
          baskets: payload.baskets,
          asOf: payload.as_of,
          connected: true
        });
      } catch (error) {
        setState((current) => ({
          ...current,
          error: error instanceof Error ? error.message : 'Failed to parse basket stream payload'
        }));
      }
    };

    const handleOpen = () => {
      setState((current) => ({ ...current, connected: true, error: undefined }));
    };

    const handleError = () => {
      setState((current) => ({ ...current, connected: false, error: 'Lost connection to basket stream' }));
    };

    source.addEventListener('prices', handlePrices as EventListener);
    source.onopen = handleOpen;
    source.onerror = handleError;

    return () => {
      source.removeEventListener('prices', handlePrices as EventListener);
      source.onopen = null;
      source.onerror = null;
      source.close();
    };
  }, []);

  const derivedState = useMemo(() => state, [state]);

  return derivedState;
}
