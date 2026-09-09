import React, { useState, useRef, useEffect } from 'react';
import {
  Sparkles,
  X,
  Send,
  Bot,
  User,
  PlusCircle,
  HelpCircle,
  ArrowRight,
  Maximize2,
  Minimize2,
} from 'lucide-react';
import { Trip, Activity } from '../types';
import { getSmartAssistantReply } from '../utils/aiService';

interface AIAssistantWidgetProps {
  trip: Trip;
  onAddActivityToCurrentDay?: (activity: Activity) => void;
  onOpenReplanModal?: () => void;
}

interface ChatMessage {
  id: string;
  sender: 'ai' | 'user';
  text: string;
  timestamp: string;
  action?: {
    type: 'add_activity' | 'open_replan';
    label: string;
    payload?: any;
  };
}

export const AIAssistantWidget: React.FC<AIAssistantWidgetProps> = ({
  trip,
  onAddActivityToCurrentDay,
  onOpenReplanModal,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [inputText, setInputText] = useState('');
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome-msg',
      sender: 'ai',
      text: `Hi! I'm your Travel Assistant for ${trip.destination}. Ask me about local transit, top restaurant spots, packing tips, or adding activities to your schedule!`,
      timestamp: 'Now',
    },
  ]);
  const [isTyping, setIsTyping] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isOpen]);

  const quickPrompts = [
    'Find halal ramen near Shinjuku',
    'Cheapest way to Haneda Airport?',
    'Can we fit an activity before dinner?',
    'What should I pack for Tokyo in September?',
  ];

  const handleSendMessage = (textToSend?: string) => {
    const query = textToSend || inputText;
    if (!query.trim()) return;

    const userMsg: ChatMessage = {
      id: `msg-${Date.now()}`,
      sender: 'user',
      text: query,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    if (!textToSend) setInputText('');
    setIsTyping(true);

    setTimeout(() => {
      const response = getSmartAssistantReply(query, trip);

      let action: ChatMessage['action'] | undefined = undefined;
      if (response.suggestedActivity) {
        action = {
          type: 'add_activity',
          label: `Add "${response.suggestedActivity.title}" to Itinerary`,
          payload: response.suggestedActivity,
        };
      } else if (query.toLowerCase().includes('fit') || query.toLowerCase().includes('change')) {
        action = {
          type: 'open_replan',
          label: 'Open AI Re-plan Tool',
        };
      }

      const aiMsg: ChatMessage = {
        id: `msg-${Date.now() + 1}`,
        sender: 'ai',
        text: response.reply,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        action,
      };

      setMessages((prev) => [...prev, aiMsg]);
      setIsTyping(false);
    }, 700);
  };

  const handleActionClick = (action: NonNullable<ChatMessage['action']>) => {
    if (action.type === 'add_activity' && onAddActivityToCurrentDay && action.payload) {
      onAddActivityToCurrentDay(action.payload);
      alert(`Added "${action.payload.title}" to Day 1 itinerary!`);
    } else if (action.type === 'open_replan' && onOpenReplanModal) {
      onOpenReplanModal();
    }
  };

  return (
    <div id="smart-ai-assistant-widget" className="fixed bottom-5 right-5 z-40">
      {/* Floating Toggle Button */}
      {!isOpen && (
        <button
          id="open-ai-chat-btn"
          onClick={() => setIsOpen(true)}
          className="group relative px-4 py-3 rounded-full bg-[#2563EB] hover:bg-blue-700 text-white shadow-xl shadow-blue-300 transition-all duration-300 flex items-center gap-2.5 cursor-pointer active:scale-95 border border-white/20"
        >
          <div className="relative">
            <Sparkles className="w-5 h-5 text-amber-300 animate-pulse" />
            <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-[#14B8A6] rounded-full ring-2 ring-[#2563EB]" />
          </div>
          <span className="text-xs font-bold tracking-wide">AI Travel Assistant</span>
        </button>
      )}

      {/* Floating Chat Window */}
      {isOpen && (
        <div className="bg-white rounded-3xl shadow-2xl border border-slate-200 w-80 sm:w-96 h-[500px] flex flex-col overflow-hidden animate-in zoom-in-95 duration-200">
          {/* Header */}
          <div className="bg-[#0F172A] p-4 text-white flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-white/10 flex items-center justify-center">
                <Bot className="w-5 h-5 text-teal-400" />
              </div>
              <div>
                <h4 className="text-xs font-bold leading-tight">AI Travel Concierge</h4>
                <span className="text-[10px] text-teal-300 flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#14B8A6]" />
                  Grounded in {trip.destination} data
                </span>
              </div>
            </div>

            <button
              onClick={() => setIsOpen(false)}
              className="p-1.5 rounded-lg hover:bg-white/10 text-white/80 hover:text-white transition-colors cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Chat Messages */}
          <div className="flex-1 p-4 overflow-y-auto space-y-3 bg-[#F8FAFC]">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex gap-2.5 ${
                  msg.sender === 'user' ? 'justify-end' : 'justify-start'
                }`}
              >
                {msg.sender === 'ai' && (
                  <div className="w-6 h-6 rounded-full bg-[#14B8A6] text-white flex items-center justify-center shrink-0 text-xs font-bold mt-0.5">
                    <Bot className="w-3.5 h-3.5" />
                  </div>
                )}

                <div
                  className={`max-w-[82%] p-3 rounded-2xl text-xs leading-relaxed space-y-2 ${
                    msg.sender === 'user'
                      ? 'bg-[#2563EB] text-white rounded-br-xs shadow-xs'
                      : 'bg-white text-[#0F172A] border border-slate-200 rounded-bl-xs shadow-2xs'
                  }`}
                >
                  <p className="whitespace-pre-line">{msg.text}</p>

                  {/* Action Button inside AI Bubble */}
                  {msg.action && (
                    <div className="pt-1.5 border-t border-slate-100">
                      <button
                        onClick={() => handleActionClick(msg.action!)}
                        className="w-full py-1.5 px-2.5 rounded-lg bg-blue-50 hover:bg-blue-100 text-[#2563EB] font-bold text-[11px] flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                      >
                        <PlusCircle className="w-3.5 h-3.5" />
                        <span>{msg.action.label}</span>
                      </button>
                    </div>
                  )}

                  <span
                    className={`text-[9px] block text-right font-medium ${
                      msg.sender === 'user' ? 'text-blue-100' : 'text-slate-400'
                    }`}
                  >
                    {msg.timestamp}
                  </span>
                </div>
              </div>
            ))}

            {isTyping && (
              <div className="flex items-center gap-2 text-slate-400 text-xs pl-8">
                <div className="w-1.5 h-1.5 rounded-full bg-[#2563EB] animate-bounce" />
                <div className="w-1.5 h-1.5 rounded-full bg-[#2563EB] animate-bounce delay-100" />
                <div className="w-1.5 h-1.5 rounded-full bg-[#2563EB] animate-bounce delay-200" />
                <span className="text-[10px]">Assistant is searching...</span>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Quick Prompts Carousel */}
          <div className="p-2 border-t border-slate-100 bg-white overflow-x-auto flex gap-1.5 scrollbar-none">
            {quickPrompts.map((prompt, i) => (
              <button
                key={i}
                onClick={() => handleSendMessage(prompt)}
                className="px-2.5 py-1 rounded-full bg-slate-100 hover:bg-blue-50 hover:text-[#2563EB] text-slate-600 text-[11px] whitespace-nowrap transition-colors cursor-pointer shrink-0"
              >
                {prompt}
              </button>
            ))}
          </div>

          {/* Message Input Box */}
          <div className="p-3 border-t border-slate-100 bg-white flex items-center gap-2">
            <input
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
              placeholder="Ask anything about your trip..."
              className="flex-1 text-xs bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 focus:ring-2 focus:ring-[#2563EB] focus:outline-none"
            />
            <button
              onClick={() => handleSendMessage()}
              disabled={!inputText.trim()}
              className="p-2.5 rounded-xl bg-[#2563EB] hover:bg-blue-700 disabled:opacity-40 text-white cursor-pointer transition-all active:scale-95"
            >
              <Send className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
