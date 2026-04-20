import { useRef } from "react";

const supportsVoice = !!(window.SpeechRecognition || window.webkitSpeechRecognition);

export default function ChatInput({
  input,
  setInput,
  onSend,
  loading,
  isListening,
  onVoiceToggle,
}) {
  const textareaRef = useRef(null);

  const handleKeyDown = e => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      onSend(input);
    }
  };

  return (
    <div className="flex items-end gap-2 p-3 border-t border-gray-100">
      <textarea
        ref={textareaRef}
        rows={1}
        value={input}
        onChange={e => setInput(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder="Ask ShoeBot anything..."
        disabled={loading}
        className="flex-1 resize-none rounded-xl border border-gray-200 px-3 py-2 text-sm
                   focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent
                   disabled:opacity-50 max-h-24 overflow-y-auto"
      />

      {supportsVoice && (
        <button
          onClick={onVoiceToggle}
          title={isListening ? "Stop listening" : "Voice input"}
          className={`p-2 rounded-xl transition-colors ${
            isListening
              ? "bg-red-500 text-white animate-pulse"
              : "bg-gray-100 text-gray-500 hover:bg-gray-200"
          }`}
        >
          🎤
        </button>
      )}

      <button
        onClick={() => onSend(input)}
        disabled={!input.trim() || loading}
        className="p-2 rounded-xl bg-black text-white hover:bg-gray-800
                   disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
      >
        {loading ? (
          <span className="block w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
        ) : (
          <svg
            className="w-4 h-4"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M6 12L3.269 3.126A59.768 59.768 0 0121.485 12 59.77 59.77 0 013.27 20.876L5.999 12zm0 0h7.5"
            />
          </svg>
        )}
      </button>
    </div>
  );
}
