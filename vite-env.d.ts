interface ImportMetaEnv {
  // Define your variables here
  readonly VITE_TEMPORAL_UI_URL: string;
  readonly VITE_TEMPORAL_NAMESPACE: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
