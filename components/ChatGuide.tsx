
import React, { useState, useRef, useEffect } from 'react';
import { generateArtGuideResponse } from '../services/geminiService';
import { ChatMessage } from '../types';
import { Send, Sparkles, X, Volume2, Square, User as UserIcon, ChevronDown, Flag, AlertTriangle } from 'lucide-react';
import { TextToSpeech } from '@capacitor-community/text-to-speech';
import { Capacitor } from '@capacitor/core';
import { useTypewriter } from '../hooks/useTypewriter';

// Componente interno para el texto con efecto
const TypingMessage: React.FC<{ text: string; onComplete: () => void }> = ({ text, onComplete }) => {
  const { displayedText, isTyping } = useTypewriter(text, 15);
  
  useEffect(() => {
    if (!isTyping) onComplete();
  }, [isTyping, onComplete]);

  return <>{displayedText}{isTyping && <span className="inline-block w-1.5 h-4 ml-1 bg-mnac-red align-middle animate-pulse"></span>}</>;
};

const ChatGuide: React.FC<{ isOpen: boolean; onClose: () => void }> = ({ isOpen, onClose }) => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome',
      role: 'model',
      text: '¡Hola! Soy Palau, tu guía personal del MNAC. ¿Te gustaría saber más sobre alguna obra o necesitas ayuda con tu visita?',
      timestamp: new Date(),
    },
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [speakingMessageId, setSpeakingMessageId] = useState<string | null>(null);
  const [activeMessageId, setActiveMessageId] = useState<string | null>(null); 
  const [reportedMessages, setReportedMessages] = useState<string[]>([]);
  
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen) {
      setTimeout(scrollToBottom, 300);
    } else {
      stopSpeaking();
    }
  }, [messages, isOpen, isLoading]);

  const stopSpeaking = async () => {
    if (Capacitor.isNativePlatform()) {
       await TextToSpeech.stop();
    } else {
       window.speechSynthesis.cancel();
    }
    setSpeakingMessageId(null);
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const handleSendMessage = async (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!inputValue.trim() || isLoading) return;

    stopSpeaking();

    const userText = inputValue.trim();
    setInputValue('');
    
    const newMessage: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      text: userText,
      timestamp: new Date(),
    };
    
    setMessages(prev => [...prev, newMessage]);
    setIsLoading(true);

    try {
      const history = messages.map(m => ({
        role: m.role,
        parts: [{ text: m.text }]
      }));
      const responseText = await generateArtGuideResponse(history.slice(-10), userText);

      const aiMsgId = (Date.now() + 1).toString();
      setActiveMessageId(aiMsgId); 

      setMessages(prev => [
        ...prev,
        {
          id: aiMsgId,
          role: 'model',
          text: responseText,
          timestamp: new Date(),
        }
      ]);
    } catch (error) {
      console.error("Chat error", error);
      setMessages(prev => [
        ...prev,
        {
          id: Date.now().toString(),
          role: 'model',
          text: "Lo siento, he perdido la conexión momentáneamente.",
          timestamp: new Date(),
        }
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSpeak = async (text: string, id: string) => {
    if (speakingMessageId === id) {
      await stopSpeaking();
      return;
    }

    await stopSpeaking();
    setSpeakingMessageId(id);

    if (Capacitor.isNativePlatform()) {
       try {
         await TextToSpeech.speak({
            text: text,
            lang: 'es-ES',
            rate: 1.0,
            pitch: 1.0,
            category: 'ambient',
         });
       } catch (e) {
         console.error("TTS Error", e);
         setSpeakingMessageId(null);
       }
    } else {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'es-ES'; 
      utterance.onend = () => setSpeakingMessageId(null);
      utterance.onerror = () => setSpeakingMessageId(null);
      window.speechSynthesis.speak(utterance);
    }
  };

  const handleReport = (id: string) => {
    if (confirm("¿Quieres reportar este mensaje como inapropiado?")) {
      setReportedMessages(prev => [...prev, id]);
      alert("Mensaje reportado.");
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-0 md:p-6 lg:p-12">
      
      {/* THEATER MODE BACKDROP */}
      <div 
        className="absolute inset-0 bg-black/80 backdrop-blur-xl transition-opacity animate-fade-in" 
        onClick={onClose}
      />
      
      {/* CHAT CONTAINER - CENTERED STAGE */}
      <div 
        className="relative w-full h-[100dvh] md:h-[80vh] md:w-[500px] bg-white md:rounded-3xl shadow-[0_0_50px_rgba(0,0,0,0.5)] flex flex-col overflow-hidden animate-pop-in border border-white/10"
        onClick={(e) => e.stopPropagation()} 
      >
        
        {/* HEADER - DARK ELEGANT */}
        <div className="bg-[#0a0a0a] text-white px-6 py-5 pt-safe flex justify-between items-center flex-shrink-0 relative overflow-hidden z-10">
          <div className="absolute top-0 left-0 w-32 h-32 bg-mnac-red/20 blur-3xl rounded-full"></div>
          
          <div className="flex items-center gap-4 relative z-10">
            <div className="relative">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-mnac-red to-[#8a1224] flex items-center justify-center shadow-lg border border-white/10 ring-2 ring-white/5">
                <Sparkles size={20} className="text-white animate-pulse" />
                </div>
                <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-[#0a0a0a] rounded-full flex items-center justify-center">
                    <div className="w-2.5 h-2.5 bg-green-500 rounded-full border border-black"></div>
                </div>
            </div>
            <div>
              <h3 className="font-serif text-xl italic leading-none text-white">Palau AI</h3>
              <p className="text-[10px] uppercase tracking-[0.2em] text-mnac-gold font-bold mt-1">Guía Inteligente</p>
            </div>
          </div>

          <button 
            onClick={onClose} 
            className="relative z-10 text-gray-400 hover:text-white transition-all bg-white/5 p-3 rounded-full hover:bg-white/10 active:scale-90"
          >
            {window.innerWidth < 768 ? <ChevronDown size={24}/> : <X size={20} />}
          </button>
        </div>

        {/* MESSAGES AREA - CLEAN CREAM */}
        <div className="flex-1 overflow-y-auto p-4 md:p-6 space-y-8 bg-[#F9F9F7] scrollbar-hide">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex w-full ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div className={`flex max-w-[90%] md:max-w-[85%] ${msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'} gap-4`}>
                 
                 {/* Avatar Small */}
                 <div className="flex-shrink-0 mt-2">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center shadow-sm border border-black/5 ${
                      msg.role === 'user' 
                        ? 'bg-white text-gray-600' 
                        : 'bg-mnac-dark text-mnac-gold'
                    }`}>
                       {msg.role === 'user' ? <UserIcon size={14} /> : <Sparkles size={14} />}
                    </div>
                 </div>
                 
                 {/* Bubble */}
                 <div className={`flex flex-col ${msg.role === 'user' ? 'items-end' : 'items-start'} max-w-full`}>
                    
                    {reportedMessages.includes(msg.id) ? (
                       <div className="px-4 py-3 bg-gray-100 border border-gray-200 rounded-lg text-xs text-gray-500 italic flex items-center gap-2">
                          <AlertTriangle size={12} /> Contenido oculto por reporte.
                       </div>
                    ) : (
                      <div className={`px-6 py-4 text-sm md:text-base leading-relaxed shadow-sm relative group ${
                        msg.role === 'user' 
                          ? 'bg-mnac-red text-white rounded-2xl rounded-tr-sm' 
                          : 'bg-white text-mnac-dark rounded-2xl rounded-tl-sm border border-gray-200/50'
                      }`}>
                        {msg.role === 'model' && activeMessageId === msg.id ? (
                           <TypingMessage text={msg.text} onComplete={() => setActiveMessageId(null)} />
                        ) : (
                           msg.text
                        )}
                        
                        {/* Audio Controls */}
                        {msg.role === 'model' && (
                          <div className="absolute -right-12 top-0 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                              <button 
                                  onClick={() => handleSpeak(msg.text, msg.id)}
                                  className={`p-2 rounded-full transition-all bg-white shadow-sm border border-gray-100 ${
                                    speakingMessageId === msg.id 
                                      ? 'text-mnac-red scale-110' 
                                      : 'text-gray-400 hover:text-mnac-dark'
                                  }`}
                              >
                                  {speakingMessageId === msg.id ? <Square size={14} fill="currentColor" /> : <Volume2 size={14} />}
                              </button>
                              
                              <button 
                                  onClick={() => handleReport(msg.id)}
                                  className="p-2 rounded-full bg-white shadow-sm border border-gray-100 text-gray-300 hover:text-red-500 transition-all"
                              >
                                  <Flag size={14} />
                              </button>
                          </div>
                        )}
                      </div>
                    )}
                    
                    <span className="text-[10px] text-gray-400 mt-2 px-1 font-medium flex items-center gap-1 opacity-60">
                       {msg.role === 'model' && 'IA'} • {formatTime(msg.timestamp)}
                    </span>
                 </div>
              </div>
            </div>
          ))}
          
          {isLoading && (
             <div className="flex w-full justify-start animate-fade-in pl-12">
                 <div className="bg-white px-5 py-4 rounded-2xl rounded-tl-sm border border-gray-200/50 shadow-sm flex gap-1.5 items-center">
                     <div className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce [animation-delay:-0.3s]"></div>
                     <div className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce [animation-delay:-0.15s]"></div>
                     <div className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce"></div>
                 </div>
             </div>
          )}
          <div ref={messagesEndRef} className="h-4" />
        </div>

        {/* INPUT AREA - FLOATING */}
        <div className="p-4 md:p-6 bg-[#F9F9F7] flex-shrink-0 pb-safe relative z-20">
          <form onSubmit={handleSendMessage} className="relative flex items-center gap-3">
            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder="Escribe tu pregunta..."
              className="flex-1 pl-6 pr-14 py-4 bg-white border border-gray-200 rounded-full focus:ring-2 focus:ring-mnac-gold/50 focus:border-mnac-gold/50 focus:outline-none text-base shadow-sm transition-all"
            />
            <button
              type="submit"
              disabled={!inputValue.trim() || isLoading}
              className="absolute right-2 top-1.5 bottom-1.5 w-11 bg-mnac-dark text-white rounded-full hover:bg-mnac-red disabled:opacity-50 disabled:bg-gray-300 transition-all shadow-md active:scale-95 flex items-center justify-center"
            >
              <Send size={18} className={inputValue.trim() ? "translate-x-0.5" : ""} />
            </button>
          </form>
          <div className="flex justify-center mt-3">
             <p className="text-[8px] text-gray-400 uppercase tracking-widest font-bold flex items-center gap-1.5">
               <Sparkles size={8} className="text-mnac-gold" /> Powered by Gemini
             </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatGuide;
