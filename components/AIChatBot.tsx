
import React, { useState, useRef, useEffect } from 'react';
import { MessageSquare, X, Send, Sparkles, Loader2, Bot } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { getVisitorAssistantResponse } from '../services/aiService';

const AIChatBot: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<{role: 'user' | 'bot', text: string}[]>([
    { role: 'bot', text: "Hi! I'm Sohan's AI assistant. Ask me anything about his work or experience!" }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { data } = useApp();
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  useEffect(() => {
    if (isOpen && window.innerWidth < 640) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
  }, [isOpen]);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMsg = input.trim();
    setInput('');
    setMessages(prev => [...prev, { role: 'user', text: userMsg }]);
    setIsLoading(true);

    try {
      const response = await getVisitorAssistantResponse(userMsg, data);
      setMessages(prev => [...prev, { role: 'bot', text: response || "I'm sorry, I couldn't process that." }]);
    } catch (error) {
      setMessages(prev => [...prev, { role: 'bot', text: "Connection error. Please try later." }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed bottom-4 right-4 sm:bottom-8 sm:right-8 z-[100]">
      {isOpen ? (
        <div className="bg-white dark:bg-gray-900 fixed inset-0 sm:relative sm:inset-auto w-full h-full sm:w-[380px] sm:h-[550px] sm:rounded-[2.5rem] shadow-[0_25px_50px_-12px_rgba(0,0,0,0.25)] border-0 sm:border border-gray-100 dark:border-gray-800 flex flex-col overflow-hidden animate-in slide-in-from-bottom-6 duration-500">
          {/* Header */}
          <div className="bg-blue-600 p-6 flex justify-between items-center text-white shrink-0">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center shadow-lg">
                <Bot size={28} />
              </div>
              <div>
                <h3 className="font-black text-sm tracking-tight">AI Assistant</h3>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></div>
                  <span className="text-[10px] font-bold uppercase tracking-widest opacity-80">Online Now</span>
                </div>
              </div>
            </div>
            <button onClick={() => setIsOpen(false)} className="p-3 hover:bg-white/10 rounded-2xl transition-all active:scale-90">
              <X size={24} />
            </button>
          </div>

          {/* Messages */}
          <div ref={scrollRef} className="flex-1 overflow-y-auto p-6 space-y-6 custom-scrollbar scroll-smooth">
            {messages.map((msg, i) => (
              <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'} animate-in slide-in-from-bottom-2`}>
                <div className={`max-w-[85%] p-4 rounded-2xl text-sm leading-relaxed shadow-sm ${
                  msg.role === 'user' 
                  ? 'bg-blue-600 text-white rounded-tr-none' 
                  : 'bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-100 rounded-tl-none border border-gray-200/50 dark:border-gray-700/50'
                }`}>
                  {msg.text}
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="flex justify-start">
                <div className="bg-gray-100 dark:bg-gray-800 p-4 rounded-2xl rounded-tl-none flex items-center gap-2">
                  <Loader2 size={16} className="animate-spin text-blue-600" />
                  <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Thinking...</span>
                </div>
              </div>
            )}
          </div>

          {/* Input */}
          <form onSubmit={handleSend} className="p-6 bg-gray-50/50 dark:bg-gray-950/50 border-t border-gray-100 dark:border-gray-800 flex gap-3 pb-8 sm:pb-6">
            <input 
              value={input}
              onChange={e => setInput(e.target.value)}
              placeholder="Ask me something..."
              className="flex-1 px-5 py-3.5 bg-white dark:bg-gray-900 rounded-2xl text-sm font-medium outline-none focus:ring-4 focus:ring-blue-600/10 dark:focus:ring-blue-600/5 transition-all border border-gray-100 dark:border-gray-800"
            />
            <button type="submit" disabled={!input.trim() || isLoading} className="p-4 bg-blue-600 text-white rounded-2xl hover:bg-blue-700 disabled:opacity-40 transition-all shadow-xl shadow-blue-600/20 active:scale-90 flex items-center justify-center shrink-0">
              <Send size={20} />
            </button>
          </form>
        </div>
      ) : (
        <button 
          onClick={() => setIsOpen(true)}
          className="w-16 h-16 sm:w-20 sm:h-20 bg-blue-600 text-white rounded-[2rem] shadow-2xl flex items-center justify-center hover:scale-110 active:scale-90 transition-all group relative border-4 border-white dark:border-gray-900"
        >
          <div className="absolute top-0 right-0 w-5 h-5 bg-emerald-500 rounded-full border-4 border-white dark:border-gray-900 animate-pulse"></div>
          <Sparkles className="group-hover:rotate-12 transition-transform" size={32} />
        </button>
      )}
    </div>
  );
};

export default AIChatBot;
