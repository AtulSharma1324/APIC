import React, { useState, useRef, useEffect } from 'react';
import { Send, User as UserIcon, Sparkles, FileText, Loader2 } from 'lucide-react';
import { AIChatMessage } from '../types';
import { api } from '../services/api';
import { Logo } from './Logo';

interface AIChatProps {
  showHeader?: boolean;
}

export const AIChat: React.FC<AIChatProps> = ({ showHeader = true }) => {
  const [messages, setMessages] = useState<AIChatMessage[]>([
    {
      id: '1',
      sender: 'ai',
      text: 'Hello! I am your AI Academic Assistant. Ask me anything about your academic programs, specializations, course codes, subjects, credits, syllabus, or Continuous Assessment (CA) rules!',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }
  ]);

  const [inputQuery, setInputQuery] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);

  const suggestedPrompts = [
    'What is the syllabus of MCA201?',
    'What subjects are in MCA AI/ML Semester 2?',
    'How many CAs are required for MCA Semester 1?',
    'What are the total credits for MCA101?'
  ];

  const scrollToBottom = () => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  const handleSend = async (queryText?: string) => {
    const textToSend = queryText || inputQuery;
    if (!textToSend.trim() || isTyping) return;

    const userMsg: AIChatMessage = {
      id: Date.now().toString(),
      sender: 'user',
      text: textToSend.trim(),
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, userMsg]);
    if (!queryText) setInputQuery('');
    setIsTyping(true);

    try {
      const response = await api.post('/ai/chat', { message: textToSend });
      if (response.data.success && response.data.data) {
        const aiMsg: AIChatMessage = {
          id: (Date.now() + 1).toString(),
          sender: 'ai',
          text: response.data.data.text,
          sources: response.data.data.sources || [],
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        };
        setMessages(prev => [...prev, aiMsg]);
      } else {
        throw new Error(response.data.message || 'AI request failed');
      }
    } catch (err: any) {
      const errorMsg: AIChatMessage = {
        id: (Date.now() + 1).toString(),
        sender: 'ai',
        text: 'I could not find this information in the academic database. Please contact the administrator or academic department.',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setMessages(prev => [...prev, errorMsg]);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <div className="flex flex-col h-full min-h-[480px] bg-white rounded-3xl border border-orange-100 shadow-xl overflow-hidden">
      
      {/* Optional Standalone Header */}
      {showHeader && (
        <div className="p-4 bg-sunset-header text-white flex items-center justify-between border-b border-orange-200/40 shadow-sm shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-white rounded-2xl flex items-center justify-center p-0.5 shadow-md border border-white shrink-0">
              <Logo size="sm" showText={false} disableLink={true} />
            </div>
            <div>
              <h3 className="text-sm font-black text-white tracking-tight">AI Academic Assistant</h3>
              <p className="text-[10px] text-orange-100/90 font-medium mt-0.5">Powered by Gemini AI</p>
            </div>
          </div>

          <div className="hidden sm:flex items-center gap-1.5 text-[11px] text-white bg-white/15 px-3 py-1.5 rounded-xl backdrop-blur-xs border border-white/20 font-bold">
            <Sparkles className="w-3.5 h-3.5 text-amber-300" />
            <span>Gemini AI</span>
          </div>
        </div>
      )}

      {/* Suggested Prompts */}
      <div className="p-3 bg-slate-50 border-b border-orange-100/80 overflow-x-auto">
        <div className="flex items-center gap-2 text-xs">
          <span className="text-[10px] font-extrabold uppercase text-slate-400 shrink-0">Try asking:</span>
          {suggestedPrompts.map((prompt, i) => (
            <button
              key={i}
              onClick={() => handleSend(prompt)}
              className="px-3 py-1 bg-white border border-orange-200/80 rounded-full text-[11px] font-semibold text-slate-700 hover:border-brand-500 hover:text-brand-600 hover:bg-orange-50/60 transition shrink-0 shadow-2xs"
            >
              {prompt}
            </button>
          ))}
        </div>
      </div>

      {/* Chat Messages */}
      <div className="flex-1 p-4 sm:p-6 overflow-y-auto space-y-4 bg-slate-50/50">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex gap-3 max-w-[85%] ${
              msg.sender === 'user' ? 'ml-auto flex-row-reverse' : ''
            }`}
          >
            <div
              className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 shadow-2xs overflow-hidden ${
                msg.sender === 'user'
                  ? 'bg-slate-900 text-white'
                  : 'bg-white border border-orange-200 p-0.5'
              }`}
            >
              {msg.sender === 'user' ? (
                <UserIcon className="w-4 h-4" />
              ) : (
                <Logo size="sm" showText={false} disableLink={true} />
              )}
            </div>

            <div
              className={`p-4 rounded-2xl text-xs sm:text-sm leading-relaxed ${
                msg.sender === 'user'
                  ? 'bg-sunset-header text-white rounded-tr-none shadow-md shadow-orange-500/20 font-medium'
                  : 'bg-white text-slate-800 border border-orange-100 rounded-tl-none shadow-2xs'
              }`}
            >
              <div className="whitespace-pre-wrap font-sans">{msg.text}</div>

              {msg.sources && msg.sources.length > 0 && (
                <div className="mt-3 pt-2.5 border-t border-slate-100 flex flex-wrap items-center gap-1 text-[10px] text-slate-500">
                  <FileText className="w-3 h-3 text-brand-500" />
                  <span className="font-bold text-slate-700">Database Sources:</span>
                  {msg.sources.map((src, idx) => (
                    <span key={idx} className="bg-orange-50 text-brand-700 px-2 py-0.5 rounded border border-orange-200 font-semibold">
                      {src}
                    </span>
                  ))}
                </div>
              )}

              <div
                className={`text-[10px] mt-2 font-semibold ${
                  msg.sender === 'user' ? 'text-orange-100 text-right' : 'text-slate-400'
                }`}
              >
                {msg.timestamp}
              </div>
            </div>
          </div>
        ))}

        {isTyping && (
          <div className="flex gap-3 max-w-[80%]">
            <div className="w-8 h-8 bg-white border border-orange-200 rounded-xl p-0.5 flex items-center justify-center shrink-0">
              <Logo size="sm" showText={false} disableLink={true} />
            </div>
            <div className="p-4 bg-white border border-orange-200 rounded-2xl rounded-tl-none shadow-xs flex items-center gap-2 text-xs text-slate-600 font-medium">
              <Loader2 className="w-4 h-4 animate-spin text-brand-600" />
              <span>Searching database & generating grounded answer...</span>
            </div>
          </div>
        )}

        <div ref={chatEndRef} />
      </div>

      {/* Input Area */}
      <div className="p-3.5 sm:p-4 bg-white border-t border-orange-100">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSend();
          }}
          className="flex items-center gap-2"
        >
          <input
            type="text"
            value={inputQuery}
            onChange={(e) => setInputQuery(e.target.value)}
            placeholder="Ask about subjects, credits, syllabus, CA rules (e.g. 'What is MCA101?')..."
            className="flex-1 px-4 py-3 text-xs sm:text-sm bg-slate-50 border border-orange-200/80 rounded-2xl focus:bg-white focus:border-brand-500 focus:outline-none transition-all text-slate-800 placeholder-slate-400 font-medium"
          />
          <button
            type="submit"
            disabled={!inputQuery.trim() || isTyping}
            className="px-5 py-3 bg-sunset-header text-white font-bold rounded-2xl hover:opacity-95 disabled:opacity-50 transition shadow-md shadow-orange-500/20 flex items-center justify-center"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>
      </div>

    </div>
  );
};
