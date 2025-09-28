/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_CUSTOM_BASKET_API_URL?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
