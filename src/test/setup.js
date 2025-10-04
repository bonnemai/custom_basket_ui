import '@testing-library/jest-dom/vitest';
if (!('ResizeObserver' in globalThis)) {
    class ResizeObserver {
        constructor(_callback) { }
        observe() { }
        unobserve() { }
        disconnect() { }
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
if (typeof window !== 'undefined' && typeof window.matchMedia !== 'function') {
    window.matchMedia = (query) => ({
        matches: false,
        media: query,
        onchange: null,
        addListener: () => { },
        removeListener: () => { },
        addEventListener: () => { },
        removeEventListener: () => { },
        dispatchEvent: () => false
    });
}
