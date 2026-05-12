import { useCallback, useEffect, useId, useRef, useState } from 'react';
import type { EcoChatTurn } from './openaiEcoChat';
import { sendEcoChatMessage } from './openaiEcoChat';
import ChatMessageBubble from './ChatMessageBubble';
import ChatTypingIndicator from './ChatTypingIndicator';

const WELCOME =
  "Hi! I'm EcoSaathi. Ask me about waste segregation, recycling, sustainability, or eco-friendly habits — I'm here to help.";

export interface ChatLine {
  id: string;
  role: 'user' | 'assistant';
  content: string;
}

function newId() {
  return crypto.randomUUID();
}

export default function EcoChatAssistant() {
  const panelId = useId();
  const [open, setOpen] = useState(false);
  const [lines, setLines] = useState<ChatLine[]>([
    { id: newId(), role: 'assistant', content: WELCOME },
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const listRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const apiKey = import.meta.env.VITE_OPENAI_API_KEY as string | undefined;
  const hasKey = Boolean(apiKey?.trim());

  const scrollToBottom = useCallback(() => {
    const el = listRef.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [lines, loading, open, scrollToBottom]);

  useEffect(() => {
    if (!open) return;
    const t = window.setTimeout(() => inputRef.current?.focus(), 200);
    return () => window.clearTimeout(t);
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open]);

  const send = async () => {
    const text = input.trim();
    if (!text || loading) return;
    if (!hasKey) {
      setError('Add VITE_OPENAI_API_KEY to your .env file and restart the dev server.');
      return;
    }

    setError('');
    const turnsBefore: EcoChatTurn[] = lines.map((l) => ({ role: l.role, content: l.content }));
    const userLine: ChatLine = { id: newId(), role: 'user', content: text };
    setInput('');
    setLines((prev) => [...prev, userLine]);
    setLoading(true);

    try {
      const reply = await sendEcoChatMessage(apiKey!, turnsBefore, text);
      setLines((prev) => [...prev, { id: newId(), role: 'assistant', content: reply }]);
    } catch (e) {
      const msg = e instanceof Error ? e.message : 'Something went wrong.';
      setLines((prev) => [
        ...prev,
        {
          id: newId(),
          role: 'assistant',
          content: `I couldn't complete that request (${msg}). Please try again.`,
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    void send();
  };

  return (
    <div className="pointer-events-none fixed bottom-0 right-0 z-40 flex flex-col items-end p-4 sm:p-6 pb-[max(1rem,env(safe-area-inset-bottom))]">
      <div
        id={panelId}
        role="dialog"
        aria-modal="true"
        aria-label="Eco assistant chat"
        aria-hidden={!open}
        className={`pointer-events-auto mb-3 flex max-h-[min(70vh,520px)] w-[min(calc(100vw-2rem),22rem)] flex-col overflow-hidden rounded-2xl border border-white/50 bg-emerald-50/55 shadow-2xl shadow-green-900/15 backdrop-blur-xl transition-all duration-300 ease-out dark:border-white/10 dark:bg-gray-950/65 dark:shadow-black/40 ${
          open
            ? 'visible translate-y-0 scale-100 opacity-100'
            : 'invisible translate-y-6 scale-95 opacity-0 pointer-events-none'
        }`}
      >
        <header className="flex shrink-0 items-center justify-between gap-2 border-b border-green-200/60 bg-white/40 px-3 py-2.5 dark:border-gray-700/80 dark:bg-gray-900/40">
          <div className="flex min-w-0 items-center gap-2">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-green-500 to-emerald-600 text-lg shadow-md">
              🌿
            </div>
            <div className="min-w-0">
              <h2 className="truncate text-sm font-bold text-green-900 dark:text-green-100">EcoSaathi</h2>
              <p className="truncate text-[11px] text-green-700/80 dark:text-green-300/80">Waste & recycling help</p>
            </div>
          </div>
          <button
            type="button"
            onClick={() => setOpen(false)}
            className="rounded-lg p-1.5 text-green-800 transition-colors hover:bg-white/60 dark:text-green-200 dark:hover:bg-gray-800/80"
            aria-label="Close chat"
          >
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </header>

        {!hasKey && (
          <p className="shrink-0 border-b border-amber-200/80 bg-amber-50/90 px-3 py-2 text-xs text-amber-950 dark:border-amber-900/50 dark:bg-amber-950/40 dark:text-amber-100">
            Set <code className="rounded bg-black/5 px-1 dark:bg-white/10">VITE_OPENAI_API_KEY</code> in{' '}
            <code className="rounded bg-black/5 px-1 dark:bg-white/10">.env</code>, then restart Vite.
          </p>
        )}

        {error && (
          <p className="shrink-0 border-b border-red-200/80 bg-red-50/90 px-3 py-2 text-xs text-red-800 dark:border-red-900/50 dark:bg-red-950/35 dark:text-red-200">
            {error}
          </p>
        )}

        <div ref={listRef} className="min-h-0 flex-1 space-y-3 overflow-y-auto px-3 py-3 sm:max-h-[min(42vh,360px)] max-h-[50vh]">
          {lines.map((line) => (
            <ChatMessageBubble key={line.id} role={line.role} content={line.content} />
          ))}
          {loading && <ChatTypingIndicator />}
        </div>

        <form
          onSubmit={onSubmit}
          className="shrink-0 border-t border-green-200/60 bg-white/35 p-2 dark:border-gray-700/80 dark:bg-gray-900/35"
        >
          <div className="flex gap-2 rounded-xl border border-green-200/70 bg-white/70 p-1 dark:border-gray-600 dark:bg-gray-800/70">
            <input
              ref={inputRef}
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask about recycling, waste…"
              disabled={loading}
              maxLength={2000}
              className="min-w-0 flex-1 rounded-lg bg-transparent px-2.5 py-2 text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none dark:text-gray-100 dark:placeholder:text-gray-500"
              aria-label="Message"
            />
            <button
              type="submit"
              disabled={loading || !input.trim()}
              className="shrink-0 rounded-lg bg-green-600 px-3 py-2 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-green-700 disabled:opacity-40 dark:bg-green-500 dark:hover:bg-green-600"
            >
              Send
            </button>
          </div>
        </form>
      </div>

      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="pointer-events-auto relative flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-br from-green-500 to-emerald-600 text-2xl shadow-lg shadow-green-900/25 ring-2 ring-white/70 transition-transform hover:scale-105 active:scale-95 dark:ring-gray-800/80"
        aria-expanded={open}
        aria-controls={panelId}
        aria-label={open ? 'Close eco assistant' : 'Open eco assistant'}
      >
        {open ? (
          <span className="text-xl leading-none">✕</span>
        ) : (
          <span className="animate-float text-2xl leading-none">💬</span>
        )}
        {!open && (
          <span className="absolute -right-0.5 -top-0.5 flex h-3 w-3">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-300 opacity-60" />
            <span className="relative inline-flex h-3 w-3 rounded-full bg-emerald-200 ring-2 ring-white dark:ring-gray-900" />
          </span>
        )}
      </button>
    </div>
  );
}
