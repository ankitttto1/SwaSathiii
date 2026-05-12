import { ECO_CHAT_SYSTEM_PROMPT } from './ecoChatSystemPrompt';

export type EcoChatTurn = { role: 'user' | 'assistant'; content: string };

interface OpenAIErrorBody {
  error?: { message?: string };
}

interface OpenAIChatResponse {
  choices?: Array<{ message?: { content?: string | null } }>;
}

function chatCompletionsUrl(): string {
  const override = (import.meta.env.VITE_OPENAI_API_URL as string | undefined)?.trim();
  if (override) return override;
  const host = typeof window !== 'undefined' ? window.location.hostname : '';
  const local = host === 'localhost' || host === '127.0.0.1';
  if (local) return '/openai-v1/v1/chat/completions';
  return 'https://api.openai.com/v1/chat/completions';
}

const MODEL = 'gpt-4o-mini';

export async function sendEcoChatMessage(
  apiKey: string,
  priorTurns: EcoChatTurn[],
  userMessage: string,
): Promise<string> {
  const messages: Array<{ role: 'system' | 'user' | 'assistant'; content: string }> = [
    { role: 'system', content: ECO_CHAT_SYSTEM_PROMPT },
    ...priorTurns.map((t) => ({ role: t.role, content: t.content })),
    { role: 'user', content: userMessage },
  ];

  const res = await fetch(chatCompletionsUrl(), {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: MODEL,
      messages,
      max_tokens: 700,
      temperature: 0.35,
    }),
  });

  const raw = await res.text();
  let json: OpenAIChatResponse & OpenAIErrorBody;
  try {
    json = JSON.parse(raw) as OpenAIChatResponse & OpenAIErrorBody;
  } catch {
    throw new Error('Unexpected response from AI service.');
  }

  if (!res.ok) {
    const msg = json.error?.message || `Request failed (${res.status})`;
    throw new Error(msg);
  }

  const text = json.choices?.[0]?.message?.content?.trim();
  if (!text) {
    throw new Error('No reply was returned. Please try again.');
  }

  return text;
}
