
import React, { useState, useEffect, useRef } from 'react';
import { UserRole } from '../types';
import { Sparkles, Search, ArrowRight, BookOpen, Lightbulb, History, Compass, Command, User, Loader2, Palette, Eye, Brain, PenTool, Zap } from 'lucide-react';
import { IMAGES } from '../data/images';
import { generateArtGuideResponse } from '../services/geminiService';

interface AiSearchPageProps {
  userRole: UserRole;
}

// Estructura de la respuesta JSON
interface StructuredAiResponse {
  headline: string;
  summary: string;
  cards: {
    icon: string;
    title: string;
    content: string;
  }[];
  curiosity?: string;
  followUp?: string[];
}

// Componente para renderizar la respuesta enriquecida
const StructuredResponse: React.FC<{ data: StructuredAiResponse | string }> = ({ data }) => {
  
  // Si por alguna razón llega string plano (fallback o error), lo mostramos simple
  if (typeof data === 'string') {
    return <p className="text-gray-200">{data}</p>;
  }

  // Mapeo de iconos
  const getIcon = (iconName: string) => {
    switch(iconName) {
      case 'palette': return <Palette size={16} className="text-mnac-red" />;
      case 'history': return <History size={16} className="text-blue-400" />;
      case 'eye': return <Eye size={16} className="text-green-400" />;
      case 'brain': return <Brain size={16} className="text-purple-400" />;
      case 'technique': return <PenTool size={16} className="text-orange-400" />;
      default: return <Lightbulb size={16} className="text-mnac-gold" />;
    }
  };

  return (
    <div className="space-y-6 w-full">
       {/* Cabecera Impactante */}
       <div>
          <h3 className="font-serif italic text-2xl md:text-3xl text-white mb-2 leading-tight">
            {data.headline}
          </h3>
          <p className="text-gray-300 font-light text-sm md:text-base leading-relaxed">
            {data.summary}
          </p>
       </div>

       {/* Grid de Tarjetas Visuales */}
       <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {data.cards.map((card, idx) => (
             <div key={idx} className="bg-white/5 border border-white/10 rounded-xl p-4 hover:bg-white/10 transition-colors group">
                 <div className="flex items-center gap-2 mb-2">
                    <div className="p-1.5 rounded-md bg-black/40 border border-white/5">
                        {getIcon(card.icon)}
                    </div>
                    <span className="text-[10px] font-bold uppercase tracking-widest text-gray-400 group-hover:text-white transition-colors">
                        {card.title}
                    </span>
                 </div>
                 <p className="text-sm text-gray-300 leading-snug">
                    {card.content}
                 </p>
             </div>
          ))}
       </div>

       {/* Sección "Sabías qué" */}
       {data.curiosity && (
          <div className="bg-mnac-gold/10 border border-mnac-gold/20 rounded-xl p-4 flex gap-4 items-start">
             <div className="flex-shrink-0 mt-1">
                <Zap size={18} className="text-mnac-gold fill-current" />
             </div>
             <div>
                <span className="block text-[9px] font-bold uppercase tracking-widest text-mnac-gold mb-1">Dato Curioso</span>
                <p className="text-sm text-gray-200 italic font-serif">
                   "{data.curiosity}"
                </p>
             </div>
          </div>
       )}
    </div>
  );
};

const AiSearchPage: React.FC<AiSearchPageProps> = ({ userRole }) => {
  const [query, setQuery] = useState('');
  const [isFocused, setIsFocused] = useState(false);
  const [mounted, setMounted] = useState(false);
  
  // Chat State ahora soporta objetos JSON parseados
  const [messages, setMessages] = useState<{role: 'user' | 'model', content: string | StructuredAiResponse}[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const chatContainerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Auto-scroll al fondo del chat
  useEffect(() => {
    if (chatContainerRef.current) {
        chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [messages, isLoading]);

  const hasInteracted = messages.length > 0 || isLoading;

  // Configuración según rol
  const config = userRole === 'teacher' ? {
    title: "Curator AI",
    subtitle: "Asistente de investigación pedagógica",
    placeholder: "Ej: Simbolismo en el Románico...",
    suggestions: [
        { icon: BookOpen, text: "Contexto Histórico del Románico", type: "Didáctica" },
        { icon: Lightbulb, text: "Análisis Iconográfico de la Virgen", type: "Investigación" },
        { icon: History, text: "Evolución Técnica del Fresco", type: "Cronología" }
    ]
  } : {
    title: "Palau",
    subtitle: "Tu guía personal inteligente",
    placeholder: "Pregúntame sobre cualquier obra...",
    suggestions: [
        { icon: Sparkles, text: "¿Qué significa el Pantocrátor?", type: "Curiosidad" },
        { icon: Compass, text: "Ruta de dragones y bestias", type: "Exploración" },
        { icon: BookOpen, text: "Vida de Ramon Casas", type: "Biografía" }
    ]
  };

  const handleSearch = async (textOverride?: string) => {
    const textToSearch = textOverride || query;
    if (!textToSearch.trim()) return;
    
    // Add user message (string simple)
    const newUserMsg = { role: 'user' as const, content: textToSearch };
    setMessages(prev => [...prev, newUserMsg]);
    setQuery('');
    setIsLoading(true);
    
    // Preparar historial para la API (usando solo texto stringificado si es objeto)
    const history = messages.map(m => ({
        role: m.role,
        parts: [{ text: typeof m.content === 'string' ? m.content : JSON.stringify(m.content) }]
    }));

    try {
        const responseText = await generateArtGuideResponse(history, textToSearch);
        
        let parsedContent: StructuredAiResponse | string;
        try {
            parsedContent = JSON.parse(responseText);
        } catch (e) {
            // Fallback si la IA falla en devolver JSON
            parsedContent = responseText;
        }

        setMessages(prev => [...prev, { role: 'model' as const, content: parsedContent }]);
    } catch (error) {
        console.error(error);
        setMessages(prev => [...prev, { role: 'model' as const, content: "Lo siento, he perdido la conexión con los archivos del museo. Por favor, inténtalo de nuevo." }]);
    } finally {
        setIsLoading(false);
        // Refocus input for continuous chat
        setTimeout(() => inputRef.current?.focus(), 100);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
        handleSearch();
    }
  };

  return (
    <div className={`relative h-[100dvh] w-full bg-black overflow-hidden flex flex-col items-center transition-all duration-700 ${hasInteracted ? 'justify-end pb-6' : 'justify-center'}`}>
      
      {/* --- CINEMATIC BACKGROUND --- */}
      <div className="absolute inset-0 z-0 pointer-events-none">
         {/* Imagen de fondo de alta calidad oscurecida */}
         <div 
            className={`absolute inset-0 bg-cover bg-center transition-transform duration-[20s] ease-linear ${mounted ? 'scale-110' : 'scale-100'}`}
            style={{ backgroundImage: `url("${IMAGES.tours.hero}")` }}
         ></div>
         
         {/* Capas de superposición para legibilidad máxima */}
         <div className={`absolute inset-0 bg-black/60 transition-opacity duration-1000 ${hasInteracted ? 'opacity-90' : 'opacity-60'}`}></div>
         <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent"></div>
         <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,rgba(0,0,0,0.8)_100%)]"></div>
         
         {/* Partículas sutiles */}
         <div className="absolute inset-0 opacity-20" style={{backgroundImage: `url("${IMAGES.tours.stardustTexture}")`}}></div>
      </div>

      {/* --- CONTENT LAYER --- */}
      <div className={`relative z-10 w-full max-w-3xl px-6 flex flex-col items-center transition-all duration-700 ${hasInteracted ? 'h-full' : 'h-auto'}`}>
         
         {/* INTRO CONTENT (Fades out on interaction) */}
         <div className={`flex flex-col items-center transition-all duration-500 absolute top-0 left-0 w-full ${hasInteracted ? 'opacity-0 -translate-y-20 pointer-events-none' : 'opacity-100 relative'}`}>
            {/* Badge Identidad */}
            <div className="mb-8 flex items-center gap-2 px-3 py-1 bg-white/5 backdrop-blur-md border border-white/10 rounded-full animate-slide-up">
                <Sparkles size={12} className="text-mnac-gold animate-pulse" />
                <span className="text-[9px] font-bold uppercase tracking-[0.2em] text-white/80">MNAC Intelligence</span>
            </div>

            {/* Titular */}
            <h1 className="font-serif italic text-6xl md:text-8xl text-white mb-2 text-center drop-shadow-2xl animate-slide-up" style={{animationDelay: '0.1s'}}>
                {config.title}
            </h1>
            <p className="text-gray-400 font-light text-lg uppercase tracking-widest mb-12 animate-slide-up" style={{animationDelay: '0.2s'}}>
                {config.subtitle}
            </p>
         </div>

         {/* CHAT AREA (Fades in on interaction) */}
         {hasInteracted && (
             <div 
                ref={chatContainerRef}
                className="flex-grow w-full overflow-y-auto mb-6 pr-2 space-y-8 scrollbar-hide animate-fade-in"
             >
                {/* Spacer to push content down initially if few messages */}
                <div className="h-20 md:h-32"></div>

                {messages.map((msg, idx) => (
                   <div key={idx} className={`flex w-full ${msg.role === 'user' ? 'justify-end' : 'justify-start'} animate-slide-up`}>
                       <div className={`flex max-w-full md:max-w-[85%] gap-4 ${msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
                           
                           {/* Avatar */}
                           <div className={`w-8 h-8 md:w-10 md:h-10 rounded-full flex items-center justify-center flex-shrink-0 shadow-lg border border-white/10 ${
                               msg.role === 'user' ? 'bg-white/20 text-white' : 'bg-mnac-red text-white'
                           }`}>
                               {msg.role === 'user' ? <User size={16} /> : <Sparkles size={16} />}
                           </div>

                           {/* Bubble / Content */}
                           <div className={`p-4 md:p-6 rounded-2xl backdrop-blur-md shadow-xl border w-full ${
                               msg.role === 'user' 
                               ? 'bg-white/10 text-white border-white/10 rounded-tr-none text-sm md:text-base font-light' 
                               : 'bg-[#121212]/90 text-gray-200 border-white/5 rounded-tl-none'
                           }`}>
                               {msg.role === 'user' ? (
                                   (msg.content as string)
                               ) : (
                                   <StructuredResponse data={msg.content as StructuredAiResponse | string} />
                               )}
                           </div>
                       </div>
                   </div>
                ))}

                {isLoading && (
                    <div className="flex w-full justify-start animate-fade-in">
                       <div className="flex max-w-[80%] gap-4">
                           <div className="w-10 h-10 rounded-full bg-mnac-red text-white flex items-center justify-center flex-shrink-0 shadow-lg border border-white/10">
                               <Sparkles size={16} className="animate-pulse" />
                           </div>
                           <div className="p-4 rounded-2xl bg-[#121212]/80 backdrop-blur-md border border-white/5 rounded-tl-none flex flex-col gap-2 min-w-[200px]">
                               <div className="flex items-center gap-2 mb-2">
                                  <span className="text-[9px] font-bold uppercase tracking-widest text-mnac-gold">Palau está pensando</span>
                               </div>
                               <div className="flex gap-2">
                                  <div className="h-1 bg-gray-500 rounded-full w-full animate-pulse"></div>
                                  <div className="h-1 bg-gray-500 rounded-full w-2/3 animate-pulse [animation-delay:0.2s]"></div>
                               </div>
                               <div className="flex gap-2 mt-1">
                                  <div className="h-1 bg-gray-500 rounded-full w-1/3 animate-pulse [animation-delay:0.4s]"></div>
                               </div>
                           </div>
                       </div>
                    </div>
                )}
             </div>
         )}

         {/* INPUT SEARCH - SLEEK & PREMIUM */}
         <div className={`w-full group relative transition-all duration-500 z-50 ${isFocused ? 'scale-105' : 'scale-100'} ${hasInteracted ? 'mb-0' : ''}`} style={{animationDelay: '0.3s'}}>
            
            {/* Glow effect on focus */}
            <div className={`absolute -inset-0.5 bg-gradient-to-r from-mnac-gold/50 via-mnac-red/50 to-mnac-gold/50 rounded-2xl blur opacity-0 transition-opacity duration-500 ${isFocused ? 'opacity-40' : 'opacity-0'}`}></div>
            
            <div className="relative flex items-center bg-[#0a0a0a]/80 backdrop-blur-xl border border-white/10 rounded-2xl p-2 shadow-2xl transition-colors hover:bg-[#0a0a0a]/90 hover:border-white/20">
               <div className="pl-4 pr-4 text-gray-500 group-hover:text-white transition-colors">
                  <Search size={20} strokeWidth={2} />
               </div>
               
               <input 
                   ref={inputRef}
                   type="text" 
                   value={query}
                   onChange={(e) => setQuery(e.target.value)}
                   onKeyDown={handleKeyDown}
                   onFocus={() => setIsFocused(true)}
                   onBlur={() => setIsFocused(false)}
                   placeholder={hasInteracted ? "Escribe tu respuesta..." : config.placeholder}
                   disabled={isLoading}
                   className="flex-grow bg-transparent border-none outline-none py-4 text-lg text-white placeholder-gray-600 font-light font-sans tracking-wide disabled:opacity-50"
                   autoComplete="off"
               />

               {!hasInteracted && (
                   <div className="hidden md:flex items-center gap-2 mr-4 px-2 py-1 rounded border border-white/10 bg-white/5 text-[10px] text-gray-500 font-mono">
                      <Command size={10} /> K
                   </div>
               )}
               
               <button 
                  onClick={() => handleSearch()}
                  disabled={!query.trim() || isLoading}
                  className={`h-12 w-12 rounded-xl flex items-center justify-center transition-all duration-300 ${
                     query.trim() 
                     ? 'bg-white text-black shadow-[0_0_15px_rgba(255,255,255,0.3)] hover:scale-105 active:scale-95' 
                     : 'bg-white/5 text-gray-500'
                  } disabled:opacity-50 disabled:cursor-not-allowed`}
               >
                   {isLoading ? <Loader2 size={20} className="animate-spin" /> : <ArrowRight size={20} />}
               </button>
            </div>
         </div>

         {/* SUGERENCIAS (Hidden on interaction) */}
         <div className={`mt-12 w-full transition-all duration-500 ${hasInteracted ? 'opacity-0 h-0 overflow-hidden mt-0' : 'opacity-100 h-auto'}`}>
             <div className="grid grid-cols-1 md:grid-cols-3 gap-4 animate-slide-up" style={{animationDelay: '0.4s'}}>
                 {config.suggestions.map((item, idx) => (
                     <button 
                         key={idx}
                         onClick={() => handleSearch(item.text)}
                         className="group relative overflow-hidden bg-white/5 hover:bg-white/10 border border-white/5 hover:border-white/20 p-4 rounded-xl text-left transition-all duration-300 hover:-translate-y-1 active:scale-95"
                     >
                         <div className="flex items-start gap-3">
                             <div className="mt-1 p-1.5 rounded-md bg-white/5 text-mnac-gold group-hover:text-white transition-colors">
                                <item.icon size={14} />
                             </div>
                             <div>
                                <span className="block text-[8px] font-bold uppercase tracking-widest text-gray-500 group-hover:text-mnac-gold mb-1 transition-colors">
                                   {item.type}
                                </span>
                                <span className="text-sm font-medium text-gray-300 group-hover:text-white leading-tight">
                                   {item.text}
                                </span>
                             </div>
                         </div>
                     </button>
                 ))}
             </div>
         </div>

      </div>

      {/* Footer */}
      {!hasInteracted && (
        <div className="absolute bottom-8 w-full text-center z-10 animate-fade-in transition-opacity duration-500">
            <p className="text-[9px] text-gray-600 font-bold uppercase tracking-[0.3em] flex items-center justify-center gap-2">
                <Sparkles size={10} className="text-mnac-gold" /> Powered by Gemini 2.5 Flash
            </p>
        </div>
      )}
    </div>
  );
};

export default AiSearchPage;
