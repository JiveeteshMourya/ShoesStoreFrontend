import SentimentBadge from "./SentimentBadge";
import SourcePill from "./SourcePill";

export default function ChatMessage({ message }) {
  const isUser = message.role === "user";

  return (
    <div className={`flex ${isUser ? "justify-end" : "justify-start"} mb-3`}>
      <div className={`max-w-[80%] ${isUser ? "items-end" : "items-start"} flex flex-col`}>
        {!isUser && message.sentiment && (
          <div className="mb-1">
            <SentimentBadge sentiment={message.sentiment} />
          </div>
        )}

        <div
          className={`px-4 py-2.5 rounded-2xl text-sm leading-relaxed whitespace-pre-wrap ${
            isUser ? "bg-black text-white rounded-br-sm" : "bg-gray-100 text-gray-900 rounded-bl-sm"
          }`}
        >
          {message.content}
        </div>

        {!isUser && <SourcePill sources={message.sources} />}
      </div>
    </div>
  );
}
