/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly CUSTOM_BASKET_API_URL?: string;
  readonly VITE_PRICING_API_DOCS_URL?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
