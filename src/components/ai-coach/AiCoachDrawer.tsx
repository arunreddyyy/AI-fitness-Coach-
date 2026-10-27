import React, { useState, useRef, useEffect } from 'react';
import {
  X,
  Bot,
  Send,
  Sparkles,
  Trash2,
  User,
} from 'lucide-react';
import { useFitness } from '../../context/FitnessContext';
import { askFitnessCoach, ChatMessage, isGeminiConfigured } from '../../services/gemini';

interface AiCoachDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AiCoachDrawer: React.FC<AiCoachDrawerProps> = ({ isOpen, onClose }) => {
  const { profile } = useFitness();
  const hasGeminiKey = isGeminiConfigured();

  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      role: 'assistant',
      content: `Hello ${profile.name}! I am your personal AI Fitness & Nutrition Coach. I have your profile loaded (Age: ${profile.age}, Goals: ${profile.fitnessGoals.join(', ')}). How can I assist your training or meal plan today?`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    },
  ]);
  const [inputText, setInputText] = useState('');
  const [isThinking, setIsThinking] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
    }
  }, [messages, isOpen]);

  const quickPrompts = [
    'How do I fix squat form with knee pain?',
    'What should I eat 1 hour before working out?',
    'Suggest 3 high-protein snacks under 200 calories',
    `Review my daily ${profile.dailyStepTarget.toLocaleString()} steps goal`,
  ];

  const handleSendMessage = async (textToSend?: string) => {
    const text = textToSend || inputText;
    if (!text.trim() || isThinking) return;

    const userMsg: ChatMessage = {
      role: 'user',
      content: text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputText('');
    setIsThinking(true);

    try {
      const reply = await askFitnessCoach(text, messages, profile);
      const coachMsg: ChatMessage = {
        role: 'assistant',
        content: reply,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages((prev) => [...prev, coachMsg]);
    } catch (e) {
      console.error(e);
      setMessages((prev) => [
        ...prev,
        {
          role: 'assistant',
          content: 'Sorry, I encountered an issue connecting to the AI service. Please verify your connection or check your Gemini API key in .env.',
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        },
      ]);
    } finally {
      setIsThinking(false);
    }
  };

  const clearChat = () => {
    setMessages([
      {
        role: 'assistant',
        content: `Chat cleared! What fitness or nutrition topic would you like to explore next, ${profile.name}?`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      },
    ]);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-slate-900/50 dark:bg-charcoal-950/70 backdrop-blur-sm animate-fade-in">
      <div className="relative w-full max-w-lg bg-white dark:bg-charcoal-900 border-l border-slate-200 dark:border-slate-800 h-full flex flex-col shadow-2xl">
        
        {/* Drawer Header */}
        <div className="p-4 sm:p-5 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between bg-slate-50/80 dark:bg-charcoal-950/80">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-emerald-500/10 text-emerald-600 dark:bg-lime-500/15 dark:text-lime-400 border border-emerald-500/20 dark:border-lime-500/30 flex items-center justify-center flex-shrink-0">
              <Bot className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-sm font-bold text-slate-900 dark:text-white">AuraFit AI Coach</h3>
                <span className="px-1.5 py-0.5 text-[9px] font-bold uppercase rounded bg-emerald-500/10 text-emerald-700 border border-emerald-500/20 dark:bg-lime-500/15 dark:text-lime-300 dark:border-lime-500/30">
                  {hasGeminiKey ? 'Gemini 1.5' : 'Smart Demo'}
                </span>
              </div>
              <p className="text-[11px] text-slate-500 dark:text-slate-400">Context: Age {profile.age} • {profile.fitnessGoals[0] || 'Fitness'}</p>
            </div>
          </div>

          <div className="flex items-center gap-1">
            <button
              onClick={clearChat}
              title="Clear chat"
              className="p-2 text-slate-400 hover:text-rose-500 hover:bg-slate-100 dark:hover:bg-charcoal-800 rounded-xl transition-colors"
            >
              <Trash2 className="w-4 h-4" />
            </button>
            <button
              onClick={onClose}
              className="p-2 text-slate-400 hover:text-slate-700 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-charcoal-800 rounded-xl transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Status notice if API key missing */}
        {!hasGeminiKey && (
          <div className="px-4 py-2 bg-emerald-500/10 border-b border-emerald-500/20 text-[11px] text-emerald-900 dark:bg-lime-500/10 dark:border-lime-500/20 dark:text-lime-300 flex items-center gap-2">
            <Sparkles className="w-3.5 h-3.5 text-emerald-600 dark:text-lime-400 flex-shrink-0" />
            <span>Interactive Demo Mode active. Add your Gemini API key in <code className="font-mono text-emerald-700 dark:text-lime-200">.env</code> for live custom reasoning.</span>
          </div>
        )}

        {/* Chat Messages List */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.map((msg, index) => {
            const isUser = msg.role === 'user';
            return (
              <div
                key={index}
                className={`flex gap-3 ${isUser ? 'justify-end' : 'justify-start'}`}
              >
                {!isUser && (
                  <div className="w-8 h-8 rounded-xl bg-slate-100 dark:bg-charcoal-800 border border-slate-200 dark:border-slate-700 text-emerald-600 dark:text-lime-400 flex items-center justify-center flex-shrink-0 mt-1">
                    <Bot className="w-4 h-4" />
                  </div>
                )}

                <div
                  className={`max-w-[85%] p-3.5 rounded-2xl text-xs leading-relaxed space-y-1 ${
                    isUser
                      ? 'bg-emerald-600 text-white font-medium rounded-tr-none shadow-sm dark:bg-lime-400 dark:text-charcoal-950'
                      : 'bg-slate-100 dark:bg-charcoal-800 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-100 rounded-tl-none whitespace-pre-wrap'
                  }`}
                >
                  <p>{msg.content}</p>
                  <span className={`text-[9px] block text-right mt-1 ${isUser ? 'text-emerald-100 dark:text-charcoal-900/70' : 'text-slate-400'}`}>
                    {msg.timestamp}
                  </span>
                </div>

                {isUser && (
                  <div className="w-8 h-8 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-700 dark:bg-lime-500/20 dark:text-lime-300 flex items-center justify-center flex-shrink-0 mt-1">
                    <User className="w-4 h-4" />
                  </div>
                )}
              </div>
            );
          })}

          {isThinking && (
            <div className="flex gap-3 justify-start animate-fade-in">
              <div className="w-8 h-8 rounded-xl bg-slate-100 dark:bg-charcoal-800 border border-slate-200 dark:border-slate-700 text-emerald-600 dark:text-lime-400 flex items-center justify-center flex-shrink-0">
                <Bot className="w-4 h-4" />
              </div>
              <div className="bg-slate-100 dark:bg-charcoal-800 border border-slate-200 dark:border-slate-700 p-3 rounded-2xl rounded-tl-none text-xs text-slate-600 dark:text-slate-300 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-500 dark:bg-lime-400 animate-pulse"></span>
                <span className="w-2 h-2 rounded-full bg-emerald-500 dark:bg-lime-400 animate-pulse delay-75"></span>
                <span className="w-2 h-2 rounded-full bg-emerald-500 dark:bg-lime-400 animate-pulse delay-150"></span>
                <span className="text-[11px] text-slate-500 dark:text-slate-400 ml-1">Analyzing fitness plan...</span>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Quick Prompts Bar */}
        <div className="p-3 border-t border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-charcoal-950/40">
          <p className="text-[10px] text-slate-500 dark:text-slate-400 uppercase tracking-wider font-semibold mb-2 px-1">
            Suggested Prompts:
          </p>
          <div className="flex gap-1.5 overflow-x-auto pb-1 scrollbar-none">
            {quickPrompts.map((prompt, i) => (
              <button
                key={i}
                onClick={() => handleSendMessage(prompt)}
                className="px-2.5 py-1 rounded-lg bg-white dark:bg-charcoal-800 hover:bg-slate-100 dark:hover:bg-charcoal-700 border border-slate-200 dark:border-slate-700 text-[11px] text-slate-700 dark:text-slate-300 whitespace-nowrap transition-colors shadow-xs"
              >
                {prompt}
              </button>
            ))}
          </div>
        </div>

        {/* Message Input Box */}
        <div className="p-4 border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-charcoal-950">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSendMessage();
            }}
            className="flex items-center gap-2"
          >
            <input
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder="Ask anything about workouts, diet, or form..."
              className="flex-1 px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-charcoal-900 border border-slate-300 dark:border-slate-700 focus:border-emerald-500 dark:focus:border-lime-400 focus:outline-none text-xs text-slate-900 dark:text-white placeholder-slate-400"
            />
            <button
              type="submit"
              disabled={isThinking || !inputText.trim()}
              className="brand-btn-primary p-2.5 rounded-xl disabled:opacity-50"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>

      </div>
    </div>
  );
};
