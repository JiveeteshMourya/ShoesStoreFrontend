const SENTIMENT_CONFIG = {
  angry: { label: "Angry", color: "bg-red-100 text-red-700" },
  frustrated: { label: "Frustrated", color: "bg-orange-100 text-orange-700" },
  happy: { label: "Happy", color: "bg-green-100 text-green-700" },
  neutral: { label: "Neutral", color: "bg-gray-100 text-gray-600" },
};

export default function SentimentBadge({ sentiment }) {
  if (!sentiment || sentiment === "neutral") return null;
  const config = SENTIMENT_CONFIG[sentiment] || SENTIMENT_CONFIG.neutral;
  return (
    <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${config.color}`}>
      {config.label}
    </span>
  );
}
