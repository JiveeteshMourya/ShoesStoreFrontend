import { useEffect, useRef } from "react";
import ChatMessage from "./ChatMessage";
import ChatInput from "./ChatInput";

export default function ChatWindow({
  messages,
  input,
  setInput,
  loading,
  isListening,
  isSpeaking,
  voiceOutputEnabled,
  onSend,
  onVoiceToggle,
  onVoiceOutputToggle,
  onClear,
  onClose,
}) {
  const bottomRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  return (
    <div className="flex flex-col bg-white rounded-2xl shadow-2xl w-[380px] h-[560px] overflow-hidden">
      <div className="flex items-center justify-between px-4 py-3 bg-black text-white">
        <div className="flex items-center gap-2">
          <span className="text-xl">👟</span>
          <div>
            <div className="flex items-center gap-1.5">
              <p className="text-sm font-semibold leading-none">ShoeBot</p>
              <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
            </div>
            <p className="text-xs text-gray-400 mt-0.5">ShoesStore Support</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={onClear}
            title="Clear chat"
            className="text-gray-400 hover:text-white text-xs px-2 py-1 rounded hover:bg-gray-700 transition-colors"
          >
            Clear
          </button>
          <button onClick={onClose} className="text-gray-400 hover:text-white transition-colors">
            ✕
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto chat-scroll px-4 py-3 space-y-2">
        {messages.map((msg, i) => (
          <ChatMessage key={i} message={msg} />
        ))}

        {loading && (
          <div className="flex justify-start mb-3">
            <div className="bg-gray-100 rounded-2xl rounded-bl-sm px-4 py-3">
              <span className="flex gap-1">
                <span
                  className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce"
                  style={{ animationDelay: "0ms" }}
                />
                <span
                  className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce"
                  style={{ animationDelay: "150ms" }}
                />
                <span
                  className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce"
                  style={{ animationDelay: "300ms" }}
                />
              </span>
              <p className="text-xs text-gray-400 mt-1.5">ShoeBot is thinking...</p>
            </div>
          </div>
        )}

        <div ref={bottomRef} />
      </div>

      <ChatInput
        input={input}
        setInput={setInput}
        onSend={onSend}
        loading={loading}
        isListening={isListening}
        onVoiceToggle={onVoiceToggle}
        isSpeaking={isSpeaking}
        voiceOutputEnabled={voiceOutputEnabled}
        onVoiceOutputToggle={onVoiceOutputToggle}
      />
    </div>
  );
}
