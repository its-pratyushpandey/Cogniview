"use client";

import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import MessageBubble from "./MessageBubble";
import InputBox from "./InputBox";
import TaskCard from "./TaskCard";
import { runAction } from "@/lib/chat-actions";
import { VoiceManager } from "@/lib/voice-manager";

interface ChatMessage {
  id: string;
  role: string;
  text: string;
  timestamp: string;
}

interface Task {
  id: string;
  action: string;
  params: Record<string, unknown>;
  status: "running" | "completed" | "error";
  result: unknown;
}

const STORAGE_KEY = "kiki_chat_history_v1";

export default function ChatWindow() {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [taskQueue, setTaskQueue] = useState<Task[]>([]);
  const [isTyping, setIsTyping] = useState(false);
  const [isConnected, setIsConnected] = useState(true);
  const [voiceEnabled, setVoiceEnabled] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const voiceManager = useRef<VoiceManager | null>(null);

  // Initialize voice manager
  useEffect(() => {
    if (typeof window !== 'undefined') {
      voiceManager.current = new VoiceManager();
    }
  }, []);

  // Load conversation history
  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        setMessages(JSON.parse(saved));
      } else {
        // Welcome message
        setMessages([{
          id: String(Date.now()),
          role: "assistant",
          text: "👋 Hi! I'm Kiki, your AI assistant for Cogniview! I can help you with:\n\n• Interview preparation and tips\n• GitHub repository analysis\n• Weather updates\n• Todo management\n• Calculations\n• Time zones\n• Career advice and job search strategies\n\nWhat would you like to know about today?",
          timestamp: new Date().toISOString()
        }]);
      }
    } catch (error) {
      console.error("Error loading chat history:", error);
    }
  }, []);

  // Save conversation history
  useEffect(() => {
    if (messages.length > 0) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(messages));
    }
    scrollRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
  }, [messages]);

  // Handle sending messages
  async function handleSend(text: string) {
    if (!text?.trim()) return;

    const userMsg: ChatMessage = {
      id: Date.now() + "-user",
      role: "user",
      text: text.trim(),
      timestamp: new Date().toISOString()
    };

    setMessages(prev => [...prev, userMsg]);
    setIsTyping(true);
    setIsConnected(true);

    try {
      const response = await fetch("/api/chat/gemini", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: [...messages, userMsg],
          maxTokens: 1000,
          temperature: 0.7
        })
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();
      
      // Check if it's a fallback response
      if (data.isFallback) {
        const aiMsg: ChatMessage = {
          id: Date.now() + "-ai",
          role: "assistant",
          text: data.output,
          timestamp: new Date().toISOString()
        };
        setMessages(prev => [...prev, aiMsg]);
        setIsConnected(false); // Show disconnected state
        return;
      }
      
      const aiResponse = data.output || data.content || "Sorry, I couldn't generate a response.";

      // Check if AI wants to execute an action
      let parsedAction = null;
      try {
        parsedAction = JSON.parse(aiResponse);
      } catch {
        // Not JSON, treat as regular response
      }

      if (parsedAction && parsedAction.type === "action") {
        // Show action intent message
        const intentMsg: ChatMessage = {
          id: Date.now() + "-intent",
          role: "assistant",
          text: `🔄 Executing: ${parsedAction.action}`,
          timestamp: new Date().toISOString()
        };
        setMessages(prev => [...prev, intentMsg]);

        // Create and run task
        const taskId = Date.now() + "-task";
        setTaskQueue(prev => [...prev, {
          id: taskId,
          action: parsedAction.action,
          params: parsedAction.params,
          status: "running",
          result: null
        }]);

        // Execute action
        const actionResult = await runAction(parsedAction.action, parsedAction.params);
        
        // Update task status
        setTaskQueue(prev => prev.map(task => 
          task.id === taskId 
            ? { ...task, status: "completed", result: actionResult }
            : task
        ));

        // Add result message
        const resultMsg: ChatMessage = {
          id: Date.now() + "-result",
          role: "assistant",
          text: `✅ Action completed!\n\n${typeof actionResult === 'string' ? actionResult : JSON.stringify(actionResult, null, 2)}`,
          timestamp: new Date().toISOString()
        };
        setMessages(prev => [...prev, resultMsg]);

        // Voice output for result
        if (voiceEnabled && voiceManager.current) {
          voiceManager.current.speak(`Action completed: ${parsedAction.action}`);
        }
      } else {
        // Regular AI response
        const aiMsg: ChatMessage = {
          id: Date.now() + "-ai",
          role: "assistant",
          text: aiResponse,
          timestamp: new Date().toISOString()
        };
        setMessages(prev => [...prev, aiMsg]);

        // Voice output for regular response
        if (voiceEnabled && voiceManager.current) {
          voiceManager.current.speak(aiResponse);
        }
      }

    } catch (error) {
      console.error("Chat error:", error);
      setIsConnected(false);
      
      let errorMessage = "❌ I'm having trouble connecting right now. ";
      
      if (error instanceof Error) {
        if (error.message.includes("500")) {
          errorMessage += "The AI service is temporarily unavailable. Please try again in a moment.";
        } else if (error.message.includes("Failed to fetch")) {
          errorMessage += "Please check your internet connection and try again.";
        } else {
          errorMessage += "Please try again.";
        }
      } else {
        errorMessage += "Please try again.";
      }
      
      const errorMsg: ChatMessage = {
        id: Date.now() + "-error",
        role: "error",
        text: errorMessage,
        timestamp: new Date().toISOString()
      };
      setMessages(prev => [...prev, errorMsg]);
    } finally {
      setIsTyping(false);
    }
  }

  // Clear conversation
  function clearConversation() {
    setMessages([]);
    setTaskQueue([]);
    localStorage.removeItem(STORAGE_KEY);
  }

  // Export conversation
  function exportConversation() {
    const data = {
      messages,
      exported: new Date().toISOString(),
      app: process.env.NEXT_PUBLIC_APP_NAME || "Cogniview AI Interview"
    };
    
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `kiki-chat-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
  }

  return (
    <div className="flex flex-col h-[60vh] max-h-[500px] bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-4 flex justify-between items-center">
        <div className="flex items-center gap-3">
          <div className="w-3 h-3 rounded-full bg-green-400 animate-pulse" />
          <div>
            <h3 className="font-semibold text-lg">Kiki AI Assistant</h3>
            <p className="text-xs text-blue-100">
              {isConnected ? "Connected" : "Disconnected"} • Powered by Gemini
            </p>
          </div>
        </div>
        
        <div className="flex gap-2">
          <button
            onClick={() => setVoiceEnabled(!voiceEnabled)}
            className={`p-2 rounded-lg transition-colors ${
              voiceEnabled ? 'bg-green-500' : 'bg-white/20'
            }`}
            title={voiceEnabled ? "Voice enabled" : "Voice disabled"}
          >
            🎤
          </button>
          <button
            onClick={exportConversation}
            className="p-2 rounded-lg bg-white/20 hover:bg-white/30 transition-colors"
            title="Export conversation"
          >
            📥
          </button>
          <button
            onClick={clearConversation}
            className="p-2 rounded-lg bg-white/20 hover:bg-white/30 transition-colors"
            title="Clear conversation"
          >
            🗑️
          </button>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 bg-gray-50 space-y-3 chat-messages">
        <AnimatePresence initial={false}>
          {messages.map((message) => (
            <motion.div
              key={message.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
            >
              <MessageBubble message={message} />
            </motion.div>
          ))}
        </AnimatePresence>

        {/* Typing indicator */}
        {isTyping && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex items-center gap-2 text-gray-500 text-sm"
          >
            <div className="flex space-x-1">
              <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" />
              <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{animationDelay: '0.1s'}} />
              <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{animationDelay: '0.2s'}} />
            </div>
            <span>Kiki is thinking...</span>
          </motion.div>
        )}

        <div ref={scrollRef} />
      </div>

      {/* Task Queue */}
      {taskQueue.length > 0 && (
        <div className="bg-white border-t border-gray-200 p-3 space-y-2 max-h-32 overflow-y-auto">
          {taskQueue.map((task) => (
            <TaskCard key={task.id} task={task} />
          ))}
        </div>
      )}

      {/* Input */}
      <div className="bg-white border-t border-gray-200 p-4">
        <InputBox 
          onSend={handleSend} 
          disabled={isTyping}
          voiceManager={voiceManager.current}
          voiceEnabled={voiceEnabled}
        />
      </div>
    </div>
  );
}