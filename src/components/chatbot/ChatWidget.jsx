import { useChatbot } from "../../hooks/useChatbot";
import ChatWindow from "./ChatWindow";

export default function ChatWidget() {
  const {
    messages,
    input,
    setInput,
    loading,
    isOpen,
    setIsOpen,
    isListening,
    sendMessage,
    clearSession,
    toggleVoice,
  } = useChatbot();

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-3">
      {isOpen && (
        <ChatWindow
          messages={messages}
          input={input}
          setInput={setInput}
          loading={loading}
          isListening={isListening}
          onSend={sendMessage}
          onVoiceToggle={toggleVoice}
          onClear={clearSession}
          onClose={() => setIsOpen(false)}
        />
      )}

      <button
        onClick={() => setIsOpen(prev => !prev)}
        className="w-14 h-14 bg-black text-white rounded-full shadow-lg hover:scale-105
                   active:scale-95 transition-transform flex items-center justify-center text-2xl"
        title="Chat with ShoeBot"
      >
        {isOpen ? "✕" : "👟"}
      </button>
    </div>
  );
}
