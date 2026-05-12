export type ChatBubbleRole = 'user' | 'assistant';

interface Props {
  role: ChatBubbleRole;
  content: string;
}

export default function ChatMessageBubble({ role, content }: Props) {
  const isUser = role === 'user';

  return (
    <div className={`flex w-full ${isUser ? 'justify-end' : 'justify-start'}`}>
      <div
        className={`max-w-[min(100%,18rem)] rounded-2xl px-3.5 py-2.5 text-sm leading-relaxed shadow-sm ${
          isUser
            ? 'rounded-br-md bg-green-600 text-white dark:bg-green-500'
            : 'rounded-bl-md border border-green-100/80 bg-white/90 text-gray-800 dark:border-gray-700 dark:bg-gray-800/90 dark:text-gray-100'
        }`}
      >
        <p className="whitespace-pre-wrap break-words">{content}</p>
      </div>
    </div>
  );
}
