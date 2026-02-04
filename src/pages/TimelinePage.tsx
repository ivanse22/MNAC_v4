import React, { useState, useEffect, useRef } from 'react';
import { UserRole } from '../types';
import Footer from '../components/Footer';
import { ArrowRight, ChevronDown } from 'lucide-react';
import { Link } from 'react-router-dom';

interface TimelinePageProps {
  userRole: UserRole;
}

const TimelinePage: React.FC<TimelinePageProps> = ({ userRole }) => {
  const [activeStep, setActiveStep] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);

  // Detectar qué sección está visible para la barra de progreso
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const handleScroll = () => {
      // Calculamos el índice basado en el scroll del contenedor (no window)
      const scrollPosition = container.scrollTop + window.innerHeight / 2;
      const index = Math.floor(scrollPosition / window.innerHeight);
      setActiveStep(index);
    };

    container.addEventListener('scroll', handleScroll);
    return () => container.removeEventListener('scroll', handleScroll);
  }, []);

  const periods = [
      { 
        id: 'romanico', 
        year: '1000 — 1200', 
        name: 'Románico', 
        desc: 'La espiritualidad austera. El arte al servicio de la fe en una sociedad feudal.',
        detail: 'Frescos monumentales, ábsides y la mirada eterna del Pantocrátor.',
        image: 'https://images.unsplash.com/photo-1576016770956-debb63d92058?q=80&w=2400&auto=format&fit=crop', 
        accent: 'text-amber-500',
        bgGradient: 'from-amber-900/40'
      },
      { 
        id: 'gotico', 
        year: '1200 — 1450', 
        name: 'Gótico', 
        desc: 'La luz divina y el oro. El despertar de las ciudades y los gremios.',
        detail: 'Retablos detallados, técnica del estofado y el auge de la burguesía.',
        image: 'https://www.museunacional.cat/sites/default/files/styles/adaptive/public/medieval-gotic-saberne-mes.jpg',
        accent: 'text-yellow-400',
        bgGradient: 'from-yellow-900/40'
      },
      { 
        id: 'renacimiento', 
        year: '1450 — 1600', 
        name: 'Renacimiento', 
        desc: 'El hombre como centro. El retorno a la medida y la proporción clásica.',
        detail: 'Perspectiva, humanismo y el diálogo con la antigüedad.',
        image: 'https://images.unsplash.com/photo-1577720580479-7d839d829c73?q=80&w=2400&auto=format&fit=crop',
        accent: 'text-blue-400',
        bgGradient: 'from-blue-900/40'
      },
      { 
        id: 'barroco', 
        year: '1600 — 1750', 
        name: 'Barroco', 
        desc: 'Teatro y emoción. El drama de la luz y la sombra.',
        detail: 'Tenebrismo, realismo crudo y la búsqueda del impacto emocional.',
        image: 'https://upload.wikimedia.org/wikipedia/commons/e/ef/Francisco_de_Zurbar%C3%A1n_006.jpg',
        accent: 'text-red-500',
        bgGradient: 'from-red-900/40'
      },
      { 
        id: 'modernismo', 
        year: '1880 — 1920', 
        name: 'Modernismo', 
        desc: 'La primavera del arte catalán. Naturaleza, curvas y bohemia.',
        detail: 'Ramon Casas, Gaudí y la búsqueda de la identidad total.',
        image: 'https://images.unsplash.com/photo-1582555172866-f73bb12a2ab3?q=80&w=2400&auto=format&fit=crop',
        accent: 'text-teal-400',
        bgGradient: 'from-teal-900/40'
      },
  ];

  return (
    // Añadido pb-32 al contenedor principal para que el scroll llegue más abajo
    <div ref={containerRef} className="bg-black w-full h-screen overflow-y-scroll snap-y snap-mandatory scroll-smooth no-scrollbar relative pb-32">
       
       {/* FIXED OVERLAY: Header & Navigation */}
       <div className="fixed top-0 left-0 w-full z-50 pointer-events-none p-6 md:p-12 flex justify-end items-start">
           <div className="hidden md:flex flex-col items-end pointer-events-auto">
                <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-white/60 mb-1">Cronología</span>
                <span className="font-sans font-bold text-xl text-white">Historia del Arte</span>
           </div>
       </div>

       {/* FIXED PROGRESS INDICATOR (Right Side) */}
       <div className="fixed right-6 md:right-12 top-1/2 -translate-y-1/2 z-50 flex flex-col items-end gap-6 pointer-events-auto">
          {periods.map((period, idx) => (
             <div 
                key={idx} 
                className="group flex items-center gap-4 cursor-pointer" 
                onClick={() => document.getElementById(`section-${idx}`)?.scrollIntoView({ behavior: 'smooth' })}
             >
                <div className={`hidden md:block transition-all duration-500 text-right ${activeStep === idx ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-4 group-hover:opacity-100 group-hover:translate-x-0'}`}>
                    <span className="block text-[9px] font-bold text-mnac-gold uppercase tracking-widest mb-0.5">{period.year}</span>
                    <span className="block text-sm font-sans font-bold text-white">{period.name}</span>
                </div>
                
                <div className={`relative flex items-center justify-center transition-all duration-500 ${activeStep === idx ? 'w-3 h-3' : 'w-1.5 h-1.5'}`}>
                    {/* Active Glow */}
                    <div className={`absolute inset-0 bg-white rounded-full blur-[4px] transition-opacity duration-500 ${activeStep === idx ? 'opacity-100' : 'opacity-0'}`}></div>
                    {/* Dot */}
                    <div className={`w-full h-full rounded-full transition-colors duration-500 ${activeStep === idx ? 'bg-white' : 'bg-white/30 group-hover:bg-white/60'}`}></div>
                </div>
             </div>
          ))}
       </div>

       {/* TIMELINE SECTIONS */}
       {periods.map((period, idx) => (
           <section 
             id={`section-${idx}`}
             key={period.id} 
             className="relative h-screen w-full snap-start shrink-0 flex items-end justify-start overflow-hidden"
           >
               {/* Background Image with Cinematic Zoom */}
               <div className="absolute inset-0 z-0">
                   <div className="absolute inset-0 bg-black transition-opacity duration-1000 z-10" 
                        style={{ opacity: activeStep === idx ? 0 : 0.4 }}></div> {/* Fade in effect */}
                   
                   <img 
                     src={period.image} 
                     alt={period.name} 
                     className={`w-full h-full object-cover transition-transform duration-[20s] ease-linear ${activeStep === idx ? 'scale-110' : 'scale-100'}`}
                   />
                   
                   {/* Gradient Overlays for Readability */}
                   <div className={`absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent opacity-90`}></div>
                   <div className={`absolute inset-0 bg-gradient-to-t ${period.bgGradient} to-transparent opacity-30 mix-blend-overlay`}></div>
               </div>

               {/* Content - Bottom Left aligned like a movie poster */}
               <div className={`relative z-20 w-full max-w-[1920px] mx-auto px-6 md:px-12 pb-24 md:pb-32 transition-all duration-1000 transform ${activeStep === idx ? 'translate-y-0 opacity-100' : 'translate-y-20 opacity-0'}`}>
                   
                   {/* Top Line */}
                   <div className="flex items-center gap-4 mb-6">
                       <div className="h-[1px] w-12 bg-mnac-gold"></div>
                       <span className="text-mnac-gold text-xs md:text-sm font-bold uppercase tracking-[0.4em]">{period.year}</span>
                   </div>

                   {/* Title */}
                   <h2 className="text-6xl md:text-[10rem] font-sans font-black text-white leading-[0.9] mb-8 tracking-tight drop-shadow-2xl">
                       {period.name}
                   </h2>

                   {/* Description Grid */}
                   <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-end">
                       <div className="md:col-span-5 lg:col-span-4">
                           <p className="text-xl md:text-2xl text-white font-light leading-relaxed mb-4">
                               {period.desc}
                           </p>
                           <p className="text-sm text-gray-400 leading-relaxed border-l-2 border-white/20 pl-4">
                               {period.detail}
                           </p>
                       </div>

                       <div className="md:col-span-3 lg:col-span-3">
                           <button className="group flex items-center gap-4 text-white hover:text-mnac-gold transition-colors duration-300">
                               <div className="w-12 h-12 rounded-full border border-white/30 flex items-center justify-center group-hover:bg-white group-hover:text-black group-hover:border-white transition-all">
                                   <ArrowRight size={20} className="-rotate-45 group-hover:rotate-0 transition-transform duration-300" />
                               </div>
                               <span className="text-xs font-bold uppercase tracking-widest">Explorar Colección</span>
                           </button>
                       </div>
                   </div>
               </div>

               {/* Scroll Hint (Only first slide) */}
               {idx === 0 && (
                   <div className="absolute bottom-8 left-1/2 -translate-x-1/2 text-white/50 animate-bounce flex flex-col items-center gap-2 z-30 pointer-events-none">
                       <span className="text-[9px] uppercase tracking-widest">Desliza</span>
                       <ChevronDown size={20} />
                   </div>
               )}
           </section>
       ))}

       {/* FOOTER SECTION (Last Snap) */}
       <section className="h-auto w-full snap-start bg-black relative z-20">
           <Footer role={userRole} />
       </section>

    </div>
  );
};

export default TimelinePage;