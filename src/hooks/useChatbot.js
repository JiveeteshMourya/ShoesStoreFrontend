import { useState, useCallback, useRef, useEffect } from "react";
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

const cleanForSpeech = text =>
  text
    .replace(/\[([^\]]+)\]\([^)]+\)/g, "$1")
    .replace(/[*_`#~>]/g, "")
    .replace(/\n+/g, ". ")
    .replace(/\s{2,}/g, " ")
    .trim();

const getEnglishVoice = () => {
  const voices = window.speechSynthesis?.getVoices() ?? [];
  return (
    voices.find(v => v.lang.startsWith("en") && v.name.toLowerCase().includes("google")) ??
    voices.find(v => v.lang.startsWith("en") && v.name.toLowerCase().includes("microsoft")) ??
    voices.find(v => v.lang.startsWith("en")) ??
    null
  );
};

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
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [voiceOutputEnabled, setVoiceOutputEnabled] = useState(
    () => localStorage.getItem("shoebot_voice_output") === "true"
  );
  const sessionId = useRef(getSessionId());
  const recognitionRef = useRef(null);

  const stopSpeaking = useCallback(() => {
    window.speechSynthesis?.cancel();
    setIsSpeaking(false);
  }, []);

  const speak = useCallback(text => {
    if (!window.speechSynthesis) return;
    window.speechSynthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(cleanForSpeech(text));
    utterance.lang = "en-IN";
    utterance.rate = 0.95;
    utterance.pitch = 1.0;

    const voice = getEnglishVoice();
    if (voice) {
      utterance.voice = voice;
    } else {
      // voices list loads async in Chrome — retry once after voices are ready
      window.speechSynthesis.onvoiceschanged = () => {
        const v = getEnglishVoice();
        if (v) utterance.voice = v;
        window.speechSynthesis.onvoiceschanged = null;
        window.speechSynthesis.speak(utterance);
      };
      utterance.onstart = () => setIsSpeaking(true);
      utterance.onend = () => setIsSpeaking(false);
      utterance.onerror = () => setIsSpeaking(false);
      return;
    }

    utterance.onstart = () => setIsSpeaking(true);
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);
    window.speechSynthesis.speak(utterance);
  }, []);

  const toggleVoiceOutput = useCallback(() => {
    setVoiceOutputEnabled(prev => {
      const next = !prev;
      localStorage.setItem("shoebot_voice_output", String(next));
      if (!next) {
        window.speechSynthesis?.cancel();
        setIsSpeaking(false);
      }
      return next;
    });
  }, []);

  // stop speech when chat window closes
  useEffect(() => {
    if (!isOpen) stopSpeaking();
  }, [isOpen, stopSpeaking]);

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
              suggested_products: data.data.suggested_products ?? null,
            },
          ]);
          if (voiceOutputEnabled) speak(data.data.reply);
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
    [loading, voiceOutputEnabled, speak]
  );

  const clearSession = useCallback(async () => {
    stopSpeaking();
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
  }, [stopSpeaking]);

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

    // stop any ongoing speech output before starting to listen
    stopSpeaking();

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
  }, [isListening, sendMessage, stopSpeaking]);

  return {
    messages,
    input,
    setInput,
    loading,
    isOpen,
    setIsOpen,
    isListening,
    isSpeaking,
    voiceOutputEnabled,
    sendMessage,
    clearSession,
    toggleVoice,
    toggleVoiceOutput,
    stopSpeaking,
  };
};
