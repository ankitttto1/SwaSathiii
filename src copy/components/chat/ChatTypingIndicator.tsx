export default function ChatTypingIndicator() {
  return (
    <div className="flex justify-start" aria-live="polite" aria-label="Assistant is typing">
      <div className="flex items-center gap-1.5 rounded-2xl rounded-bl-md border border-green-100/80 bg-white/90 px-4 py-3 dark:border-gray-700 dark:bg-gray-800/90">
        <span className="eco-chat-dot h-2 w-2 rounded-full bg-green-500 dark:bg-green-400" />
        <span className="eco-chat-dot eco-chat-dot-delay-1 h-2 w-2 rounded-full bg-green-500 dark:bg-green-400" />
        <span className="eco-chat-dot eco-chat-dot-delay-2 h-2 w-2 rounded-full bg-green-500 dark:bg-green-400" />
      </div>
    </div>
  );
}
