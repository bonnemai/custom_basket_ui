import { useEffect, useMemo, useState } from 'react';
import { API_BASE_URL } from './useCreateBasket';
const STREAM_RESOURCE = 'baskets/stream';
export const BASKET_STREAM_ENDPOINT = `${API_BASE_URL}${STREAM_RESOURCE}`;
const supportsEventSource = () => {
    if (typeof window === 'undefined') {
        return false;
    }
    return typeof window.EventSource !== 'undefined';
};
export function useBasketStream() {
    const [state, setState] = useState({ baskets: [], connected: false });
    useEffect(() => {
        if (!supportsEventSource()) {
            return undefined;
        }
        const source = new window.EventSource(BASKET_STREAM_ENDPOINT);
        const handlePrices = (event) => {
            try {
                const payload = JSON.parse(event.data);
                setState({
                    baskets: payload.baskets,
                    asOf: payload.as_of,
                    connected: true
                });
            }
            catch (error) {
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
        source.addEventListener('prices', handlePrices);
        source.onopen = handleOpen;
        source.onerror = handleError;
        return () => {
            source.removeEventListener('prices', handlePrices);
            source.onopen = null;
            source.onerror = null;
            source.close();
        };
    }, []);
    const derivedState = useMemo(() => state, [state]);
    return derivedState;
}
