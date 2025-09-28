import '@testing-library/jest-dom/vitest';

if (!('ResizeObserver' in globalThis)) {
  class ResizeObserver {
    constructor(_callback: ResizeObserverCallback) {}
    observe() {}
    unobserve() {}
    disconnect() {}
  }

  Object.defineProperty(globalThis, 'ResizeObserver', {
    configurable: true,
    writable: true,
    value: ResizeObserver,
  });

  if (typeof window !== 'undefined') {
    Object.defineProperty(window, 'ResizeObserver', {
      configurable: true,
      writable: true,
      value: ResizeObserver,
    });
  }
}

export {};
