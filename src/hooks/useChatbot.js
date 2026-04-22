import { useState, useCallback, useRef } from "react";
import axios from "axios";

const getSessionId = () => {
  let id = sessionStorage.getItem("chatbot_session_id");
  if (!id) {
    id = crypto.randomUUID();
    sessionStorage.setItem("chatbot_session_id", id);
  }
  return id;
};

const API_BASE = "http://localhost:6969/api/v1";

export const useChatbot = () => {
  const [messages, setMessages] = useState([
    {
      role: "bot",
      content: "Hey! I'm ShoeBot 👟 Ask me anything — orders, sizing, product recs, or returns!",
      sentiment: "happy",
      sources: null,
    },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const sessionId = useRef(getSessionId());
  const recognitionRef = useRef(null);

  const sendMessage = useCallback(
    async text => {
      const trimmed = text?.trim();
      if (!trimmed || loading) return;

      setMessages(prev => [...prev, { role: "user", content: trimmed }]);
      setInput("");
      setLoading(true);

      try {
        const { data } = await axios.post(
          `${API_BASE}/chatbot/message`,
          { message: trimmed, sessionId: sessionId.current },
          { withCredentials: true, timeout: 60000 }
        );

        if (data.success) {
          setMessages(prev => [
            ...prev,
            {
              role: "bot",
              content: data.data.reply,
              sentiment: data.data.sentiment,
              sources: data.data.sources,
              tool_used: data.data.tool_used,
            },
          ]);
        }
      } catch {
        setMessages(prev => [
          ...prev,
          {
            role: "bot",
            content: "Something went wrong. Please try again!",
            sentiment: "neutral",
            sources: null,
          },
        ]);
      } finally {
        setLoading(false);
      }
    },
    [loading]
  );

  const clearSession = useCallback(async () => {
    await axios
      .post(
        `${API_BASE}/chatbot/clear-session`,
        { sessionId: sessionId.current },
        { withCredentials: true }
      )
      .catch(() => {});
    const newId = crypto.randomUUID();
    sessionStorage.setItem("chatbot_session_id", newId);
    sessionId.current = newId;
    setMessages([
      {
        role: "bot",
        content: "Chat cleared! Ask me anything.",
        sentiment: "neutral",
        sources: null,
      },
    ]);
  }, []);

  const toggleVoice = useCallback(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert("Voice input is only supported in Chrome.");
      return;
    }

    if (isListening) {
      recognitionRef.current?.stop();
      setIsListening(false);
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.lang = "en-IN";
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;

    recognition.onresult = e => {
      const transcript = e.results[0][0].transcript;
      sendMessage(transcript);
    };
    recognition.onerror = () => setIsListening(false);
    recognition.onend = () => setIsListening(false);

    recognitionRef.current = recognition;
    recognition.start();
    setIsListening(true);
  }, [isListening, sendMessage]);

  return {
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
  };
};
