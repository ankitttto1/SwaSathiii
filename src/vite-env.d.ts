/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_OPENAI_API_KEY?: string;
  /** Same-origin chat completions URL for production (avoids browser CORS). Dev: use Vite `/openai-v1` proxy on localhost. */
  readonly VITE_OPENAI_API_URL?: string;
}
