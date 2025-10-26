"use client";

import { useState } from "react";
import { Send, Mic, MicOff } from "lucide-react";
import { motion } from "framer-motion";
import { VoiceManager } from "@/lib/voice-manager";

interface InputBoxProps {
  onSend: (text: string) => Promise<void>;
  disabled: boolean;
  voiceManager: VoiceManager | null;
  voiceEnabled: boolean;
}

export default function InputBox({ onSend, disabled, voiceManager, voiceEnabled }: InputBoxProps) {
  const [text, setText] = useState("");
  const [isListening, setIsListening] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!text.trim() || disabled) return;
    
    await onSend(text.trim());
    setText("");
  };

  const handleVoiceInput = () => {
    if (!voiceManager || !voiceEnabled) return;

    if (isListening) {
      voiceManager.stopListening();
      setIsListening(false);
    } else {
      const success = voiceManager.startListening(
        (transcript) => {
          setText(prev => prev ? `${prev} ${transcript}` : transcript);
          setIsListening(false);
        },
        (error) => {
          console.error("Voice recognition error:", error);
          setIsListening(false);
        }
      );
      
      if (success) {
        setIsListening(true);
      }
    }
  };

  const quickActions = [
    "Help me",
    "Weather",
    "Todo",
    "Time"
  ];

  return (
    <div className="space-y-3 w-full">
      {/* Quick Actions */}
      <div className="flex flex-wrap gap-1.5">
        {quickActions.map((action) => (
          <button
            key={action}
            onClick={() => setText(action)}
            className="premium-quick-action px-3 py-1.5 text-xs font-medium rounded-lg"
          >
            {action}
          </button>
        ))}
      </div>

      {/* Input Form */}
      <form onSubmit={handleSubmit} className="flex gap-2 items-end w-full">
        <div className="flex-1 relative">
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                handleSubmit(e);
              }
            }}
            placeholder="Ask me anything..."
            className="premium-input w-full px-4 py-3 pr-12 text-sm resize-none min-h-[44px]"
            rows={1}
            disabled={disabled}
          />
          {/* Voice Button */}
          {voiceEnabled && voiceManager && (
            <button
              type="button"
              onClick={handleVoiceInput}
              className={`absolute right-2 top-1/2 transform -translate-y-1/2 p-2 rounded-lg transition-all duration-200 ${
                isListening 
                  ? 'bg-red-100 text-red-600 border border-red-200' 
                  : 'bg-gray-100 text-gray-600 border border-gray-200 hover:bg-gray-200'
              }`}
              title={isListening ? "Stop listening" : "Voice input"}
            >
              {isListening ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
            </button>
          )}
        </div>

        <motion.button
          type="submit"
          disabled={!text.trim() || disabled}
          className="premium-send-button px-5 py-3 text-white font-medium min-h-[44px] flex items-center gap-2"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          <Send className="w-4 h-4" />
          <span className="hidden sm:inline text-sm">Send</span>
        </motion.button>
      </form>

      {isListening && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center text-sm text-blue-600 font-medium py-2 px-4 bg-blue-50 rounded-lg border border-blue-200"
        >
          🎤 Listening...
        </motion.div>
      )}
    </div>
  );
}