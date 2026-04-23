import SentimentBadge from "./SentimentBadge";
import ProductCard from "./ProductCard";

export default function ChatMessage({ message }) {
  const isUser = message.role === "user";
  const hasProducts = !isUser && message.suggested_products?.length > 0;

  return (
    <div className={`flex ${isUser ? "justify-end" : "justify-start"} mb-3`}>
      <div className={`flex flex-col ${isUser ? "items-end" : "items-start"} gap-1`}>
        {!isUser && message.sentiment && <SentimentBadge sentiment={message.sentiment} />}

        <div
          className={`max-w-[80%] px-4 py-2.5 rounded-2xl text-sm leading-relaxed whitespace-pre-wrap ${
            isUser ? "bg-black text-white rounded-br-sm" : "bg-gray-100 text-gray-900 rounded-bl-sm"
          }`}
        >
          {message.content}
        </div>

        {hasProducts && (
          <div
            className="flex gap-2 overflow-x-auto pb-1 max-w-75
                       [&::-webkit-scrollbar]:h-1
                       [&::-webkit-scrollbar-thumb]:bg-gray-300
                       [&::-webkit-scrollbar-thumb]:rounded-full
                       [&::-webkit-scrollbar-track]:bg-transparent"
          >
            {message.suggested_products.map(p => (
              <ProductCard key={p._id} product={p} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
