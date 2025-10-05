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
    "What can you do?",
    "What's the weather like?",
    "Create a todo",
    "What time is it?"
  ];

  return (
    <div className="space-y-3">
      {/* Quick Actions */}
      <div className="flex flex-wrap gap-2">
        {quickActions.map((action) => (
          <button
            key={action}
            onClick={() => setText(action)}
            className="px-3 py-1 text-xs bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-full transition-colors"
          >
            {action}
          </button>
        ))}
      </div>

      {/* Input Form */}
      <form onSubmit={handleSubmit} className="flex gap-2 items-end">
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
            placeholder="Ask Kiki anything..."
            className="w-full px-4 py-3 pr-12 rounded-xl border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-none resize-none text-sm"
            rows={1}
            disabled={disabled}
          />
          
          {/* Voice Button */}
          {voiceEnabled && voiceManager && (
            <button
              type="button"
              onClick={handleVoiceInput}
              className={`absolute right-2 top-1/2 transform -translate-y-1/2 p-2 rounded-lg transition-colors ${
                isListening 
                  ? 'bg-red-100 text-red-600' 
                  : 'bg-gray-100 hover:bg-gray-200 text-gray-600'
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
          className="px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center gap-2"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          <Send className="w-4 h-4" />
          <span className="hidden sm:inline">Send</span>
        </motion.button>
      </form>

      {isListening && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center text-sm text-blue-600"
        >
          🎤 Listening... Speak now!
        </motion.div>
      )}
    </div>
  );
}