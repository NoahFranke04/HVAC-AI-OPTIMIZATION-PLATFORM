import { MessageSquare, Send, Bot, User as UserIcon, Award, Zap, Loader2 } from 'lucide-react';
import { useState, useEffect, useRef } from 'react';
import { useSubscription } from './SubscriptionProvider';
import { GoogleGenAI } from '@google/genai';
import { User } from 'firebase/auth';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { trackEvent } from '../lib/analytics';

export default function AIAssistant({ user }: { user: User }) {
  const [messages, setMessages] = useState([
    { role: 'assistant', content: 'Hello! I am your HVAC AI Consultant. I have analyzed your property data. How can I help you optimize your energy spend today?' }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [homeData, setHomeData] = useState<any>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [chatSession, setChatSession] = useState<any>(null);

  useEffect(() => {
    const fetchHome = async () => {
      const q = query(collection(db, 'homes'), where('userId', '==', user.uid));
      const snapshot = await getDocs(q);
      if (!snapshot.empty) {
        setHomeData(snapshot.docs[0].data());
      }
    };
    fetchHome();
  }, [user.uid]);

  useEffect(() => {
    const initChat = async () => {
        try {
            const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
            
            let context = "You are an expert HVAC and energy efficiency consultant. ";
            if (homeData) {
                context += `The user's home has ${homeData.squareFootage} sqft, built in ${homeData.yearBuilt}, located in ZIP ${homeData.zipCode}. They currently have ${homeData.hvacType} with ${homeData.insulationLevel} insulation. `;
            }
            context += "Provide concise, actionable, and financially-focused advice. Focus on ROI, savings, and practical steps. Do not use markdown formatting like bolding or lists, keep it plain text.";

            const chat = ai.chats.create({
                model: "gemini-3-flash-preview",
                config: {
                    systemInstruction: context,
                }
            });
            setChatSession(chat);
        } catch (error) {
            console.error("Failed to initialize chat session", error);
        }
    };
    if (homeData !== null) {
        initChat();
    }
  }, [homeData]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || isLoading || !chatSession) return;
    
    const userMessage = input;
    setMessages(prev => [...prev, { role: 'user', content: userMessage }]);
    setInput('');
    setIsLoading(true);
    trackEvent('ai_assistant_message_sent');

    try {
        const response = await chatSession.sendMessage({ message: userMessage });
        
        setMessages(prev => [...prev, { 
            role: 'assistant', 
            content: response.text || "I'm sorry, I couldn't process that request." 
        }]);

    } catch (error) {
        console.error("Error calling Gemini API:", error);
        setMessages(prev => [...prev, { 
            role: 'assistant', 
            content: "I'm currently experiencing technical difficulties. Please try again later." 
        }]);
    } finally {
        setIsLoading(false);
    }
  };

  return (
    <div className="h-[calc(100vh-12rem)] flex flex-col bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden">
      {/* Header */}
      <div className="bg-slate-950/50 border-b border-slate-800 p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-blue-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-900/40">
            <Bot className="w-6 h-6 text-white" />
            </div>
            <div>
            <h1 className="text-xl font-bold text-white">AI Energy Consultant</h1>
            <p className="text-sm text-slate-400">Context-aware optimization advice</p>
            </div>
        </div>
        <div className="flex items-center gap-3 bg-slate-900 border border-slate-800 px-4 py-2 rounded-xl">
            <div className="flex items-center gap-2">
                <Award className="w-4 h-4 text-yellow-400" />
                <span className="text-sm font-bold text-white">1,250 pts</span>
            </div>
            <div className="w-px h-4 bg-slate-700" />
            <div className="flex items-center gap-2">
                <Zap className="w-4 h-4 text-green-400" />
                <span className="text-xs text-slate-400">Eco Warrior Level 3</span>
            </div>
        </div>
      </div>

      {/* Chat Area */}
      <div className="flex-1 overflow-y-auto p-6 space-y-6">
        {messages.map((msg, i) => (
          <div key={i} className={`flex gap-4 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}>
            <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${
              msg.role === 'user' ? 'bg-slate-700' : 'bg-blue-600'
            }`}>
              {msg.role === 'user' ? <UserIcon className="w-4 h-4 text-white" /> : <Bot className="w-4 h-4 text-white" />}
            </div>
            <div className={`max-w-[80%] rounded-2xl p-4 ${
              msg.role === 'user' 
                ? 'bg-blue-600 text-white rounded-tr-none' 
                : 'bg-slate-800 text-slate-200 rounded-tl-none border border-slate-700'
            }`}>
              <p className="text-sm leading-relaxed whitespace-pre-wrap">{msg.content}</p>
            </div>
          </div>
        ))}
        {isLoading && (
            <div className="flex gap-4">
                <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center shrink-0">
                    <Bot className="w-4 h-4 text-white" />
                </div>
                <div className="bg-slate-800 rounded-2xl rounded-tl-none border border-slate-700 p-4 flex items-center gap-2">
                    <Loader2 className="w-4 h-4 text-blue-400 animate-spin" />
                    <span className="text-sm text-slate-400">Analyzing...</span>
                </div>
            </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="p-4 bg-slate-950/50 border-t border-slate-800">
        <div className="relative flex items-center">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            placeholder="Ask about ROI, upgrades, or how to lower your bill..."
            className="w-full bg-slate-900 border border-slate-700 rounded-xl py-4 pl-4 pr-14 text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 transition-colors"
            disabled={isLoading || !chatSession}
          />
          <button 
            onClick={handleSend}
            disabled={isLoading || !input.trim() || !chatSession}
            className="absolute right-2 p-2 bg-blue-600 hover:bg-blue-500 disabled:bg-slate-700 disabled:text-slate-500 text-white rounded-lg transition-colors"
          >
            <Send className="w-5 h-5" />
          </button>
        </div>
        <div className="flex gap-2 mt-3 overflow-x-auto pb-2 scrollbar-hide">
          {['What upgrade gives best ROI?', 'How to lower my bill this month?', 'Explain my current efficiency score'].map((suggestion, i) => (
            <button 
              key={i}
              onClick={() => setInput(suggestion)}
              className="whitespace-nowrap text-xs bg-slate-800 hover:bg-slate-700 text-slate-300 px-3 py-1.5 rounded-full border border-slate-700 transition-colors"
            >
              {suggestion}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
