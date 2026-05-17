"use client";
import React, { useState, useEffect, useRef } from "react";
import { useLanguage } from "@/context/LanguageContext";
import { MessageCircle, X, Send, Mic, Headphones } from "lucide-react";

export default function Chatbot() {
  const { t, lang, toggleLanguage } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [langSelected, setLangSelected] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isOpen]);

  // Handle opening for the first time
  useEffect(() => {
    if (isOpen && messages.length === 0) {
      // First, ask for language preference
      setMessages([
        {
          role: "bot",
          content: "Please select your preferred language / कृपया अपनी पसंदीदा भाषा चुनें:",
          isLangSelect: true,
        },
      ]);
    }
  }, [isOpen, messages.length]);

  const handleLangSelect = (selectedLang) => {
    toggleLanguage(selectedLang);
    setLangSelected(true);
    // After selection, send welcome message in chosen language
    setTimeout(() => {
      const welcomeMsg = selectedLang === "en" 
        ? "Hello! I am your AI Heart Health Assistant. How can I help you today?" 
        : "नमस्ते! मैं आपका एआई हृदय स्वास्थ्य सहायक हूँ। मैं आज आपकी कैसे मदद कर सकता हूँ?";
      setMessages((prev) => [
        ...prev.filter(m => !m.isLangSelect),
        { role: "bot", content: welcomeMsg }
      ]);
    }, 300);
  };

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMsg = input.trim();
    setInput("");
    setMessages((prev) => [...prev, { role: "user", content: userMsg }]);

    // Simulated API call - Since we don't have a real API key provided yet, 
    // we use an intelligent mocked response based on the language.
    setTimeout(() => {
      let botReply = "";
      if (lang === "en") {
        if (userMsg.toLowerCase().includes("risk") || userMsg.toLowerCase().includes("predict")) {
          botReply = "To calculate your heart risk, please click on 'Start Prediction' and enter your medical indicators in the dashboard.";
        } else if (userMsg.toLowerCase().includes("diet") || userMsg.toLowerCase().includes("food")) {
          botReply = "A heart-healthy diet includes plenty of fruits, vegetables, whole grains, and lean proteins. You'll get personalized diet recommendations after taking the risk assessment!";
        } else {
          botReply = "I am an AI assistant for PredictForProtection. I can help answer questions about our platform or general heart health. Please note I am not a substitute for a doctor.";
        }
      } else {
        if (userMsg.includes("जोखिम") || userMsg.includes("भविष्यवाणी") || userMsg.includes("टेस्ट")) {
          botReply = "अपने हृदय जोखिम की गणना करने के लिए, कृपया 'विश्लेषण शुरू करें' पर क्लिक करें और डैशबोर्ड में अपने चिकित्सा संकेतक दर्ज करें।";
        } else if (userMsg.includes("आहार") || userMsg.includes("भोजन") || userMsg.includes("खाना")) {
          botReply = "हृदय-स्वस्थ आहार में भरपूर मात्रा में फल, सब्जियां, साबुत अनाज और लीन प्रोटीन शामिल होते हैं। जोखिम मूल्यांकन करने के बाद आपको व्यक्तिगत आहार सिफारिशें मिलेंगी!";
        } else {
          botReply = "मैं PredictForProtection के लिए एक एआई सहायक हूँ। मैं हमारे मंच या सामान्य हृदय स्वास्थ्य के बारे में सवालों के जवाब देने में मदद कर सकता हूँ। कृपया ध्यान दें कि मैं डॉक्टर का विकल्प नहीं हूँ।";
        }
      }

      setMessages((prev) => [...prev, { role: "bot", content: botReply }]);
    }, 1000);
  };

  return (
    <>
      {/* Floating Action Button */}
      <button
        onClick={() => setIsOpen(true)}
        className={`fixed bottom-6 right-6 w-14 h-14 bg-gradient-to-br from-rose-500 to-rose-600 rounded-full flex items-center justify-center shadow-lg shadow-rose-500/30 text-white hover:scale-110 transition-transform duration-300 z-50 ${isOpen ? "hidden" : "flex"}`}
        aria-label="Open Chatbot"
      >
        <Headphones size={26} />
      </button>

      {/* Chat Window */}
      {isOpen && (
        <div className="fixed bottom-6 right-6 w-80 md:w-96 bg-white/90 backdrop-blur-xl rounded-2xl shadow-2xl border border-gray-100 z-50 flex flex-col overflow-hidden animate-fade-in-up">
          {/* Header */}
          <div className="bg-gradient-to-r from-rose-500 to-rose-600 p-4 flex items-center justify-between text-white">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center">
                <Mic size={18} />
              </div>
              <div>
                <h3 className="font-heading font-semibold text-sm">AI Health Assistant</h3>
                <p className="text-[10px] opacity-80">Powered by Gemini AI</p>
              </div>
            </div>
            <button onClick={() => setIsOpen(false)} className="hover:bg-white/20 p-1 rounded-full transition-colors">
              <X size={20} />
            </button>
          </div>

          {/* Messages Area */}
          <div className="flex-1 h-80 p-4 overflow-y-auto bg-gray-50/50 flex flex-col gap-4">
            {messages.map((msg, i) => (
              <div key={i} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
                <div 
                  className={`max-w-[80%] rounded-2xl px-4 py-2.5 text-sm shadow-sm ${
                    msg.role === "user" 
                      ? "bg-rose-500 text-white rounded-tr-sm" 
                      : "bg-white text-gray-800 border border-gray-100 rounded-tl-sm"
                  }`}
                >
                  {msg.content}
                  
                  {/* Language Selection Buttons injected by bot */}
                  {msg.isLangSelect && (
                    <div className="mt-3 flex gap-2">
                      <button 
                        onClick={() => handleLangSelect("en")}
                        className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-800 py-1.5 rounded-lg text-xs font-semibold transition-colors"
                      >
                        English
                      </button>
                      <button 
                        onClick={() => handleLangSelect("hi")}
                        className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-800 py-1.5 rounded-lg text-xs font-semibold transition-colors"
                      >
                        हिंदी
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>

          {/* Input Area */}
          <div className="p-3 bg-white border-t border-gray-100 flex items-center gap-2">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSend()}
              placeholder={langSelected ? t.chat.inputPlaceholder : "..."}
              disabled={!langSelected}
              className="flex-1 bg-gray-100 text-sm rounded-full px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-rose-500/50 text-gray-800"
            />
            <button 
              onClick={handleSend}
              disabled={!langSelected || !input.trim()}
              className="w-10 h-10 rounded-full bg-rose-500 flex items-center justify-center text-white disabled:opacity-50 hover:bg-rose-600 transition-colors"
            >
              <Send size={18} className="ml-1" />
            </button>
          </div>
        </div>
      )}
    </>
  );
}
