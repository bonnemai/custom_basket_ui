import { useState } from 'react';
const envBaseUrl = import.meta.env?.VITE_CUSTOM_BASKET_API_URL;
const ensureTrailingSlash = (value) => value.endsWith('/') ? value : `${value}/`;
const resolveBaseUrl = (candidate) => {
    if (typeof candidate === 'string' && candidate.trim().length > 0) {
        return ensureTrailingSlash(candidate.trim());
    }
    return 'http://localhost:8000/';
};
export const API_BASE_URL = resolveBaseUrl(envBaseUrl);
const CREATE_RESOURCE = 'baskets';
export const DEFAULT_ENDPOINT = `${API_BASE_URL}${CREATE_RESOURCE}`;
export function useCreateBasket(endpoint = DEFAULT_ENDPOINT) {
    const [state, setState] = useState({ loading: false });
    const addBasket = async (payload) => {
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
            const data = await response.json();
            setState({ loading: false, data });
            return data;
        }
        catch (error) {
            const err = {
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
