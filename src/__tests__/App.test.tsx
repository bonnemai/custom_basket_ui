import { afterAll, beforeAll, describe, expect, it, vi } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import App, { cleansePayload } from '../App';
import type { CreateBasketRequest } from '../types/api';

describe('cleansePayload', () => {
  it('normalises numeric fields and removes empty metadata keys', () => {
    const payload: CreateBasketRequest = {
      basket_name: 'Test',
      base_currency: 'USD',
      notional: 1,
      positions: [
        {
          ticker: 'AAA',
          weight: 1.2345,
          metadata: {
            '': 'ignore me',
            valid: 'keep me'
          }
        }
      ]
    };

    const result = cleansePayload(payload);

    expect(result.positions[0].metadata).toEqual({ valid: 'keep me' });
    expect(result.notional).toBe(1);
  });
});

describe('App', () => {
  const originalFetch = globalThis.fetch;

  afterEach(() => {
    globalThis.fetch = originalFetch;
    vi.restoreAllMocks();
  });

  it('submits basket creation request and renders the response', async () => {
    const fetchSpy = vi
      .spyOn(globalThis, 'fetch')
      .mockImplementation(async () =>
        new Response(JSON.stringify({ basket_id: 'generated-basket' }), {
          status: 200,
          headers: { 'Content-Type': 'application/json' }
        })
      );

    render(<App />);

    const submitButton = screen.getByRole('button', { name: /add basket/i });
    fireEvent.click(submitButton);

    await waitFor(() => expect(fetchSpy).toHaveBeenCalledTimes(1));

    const firstCall = fetchSpy.mock.calls[0] ?? [];
    const options = (firstCall[1] ?? {}) as RequestInit;
    const payloadText =
      typeof options.body === 'string' ? options.body : JSON.stringify({});

    const body = JSON.parse(payloadText);
    expect(body.basket_name).toBeDefined();
    expect(body.positions).toHaveLength(1);

    await screen.findByText(/response/i);
    await screen.findByText(/generated-basket/i);
  });
});
