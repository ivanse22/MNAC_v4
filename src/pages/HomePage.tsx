import React, { useEffect } from 'react';
import { ArrowRight, ArrowUpRight, Play, Tag, Clock, MapPin } from 'lucide-react';
import { Link, Navigate, useLocation } from 'react-router-dom';
import { UserRole } from '../types';
import Footer from '../components/Footer';
import { useHomeContent } from '../hooks/useHomeContent';
import OptimizedImage from '../components/OptimizedImage';
import { IMAGES } from '../data/images';
import { useGamification } from '../hooks/useGamification';

interface HomePageProps {
  role: UserRole;
  onSetScrolled: (scrolled: boolean) => void;
  onSetHeaderVisible: (visible: boolean) => void;
}

// Datos de secciones "Highlights"
const FEATURED_SECTIONS = [
  {
    id: 1,
    titleItalic: "Romanesque",
    titleNormal: "Masterpieces",
    count: 292,
    image: IMAGES.artworks.pantocrator,
    link: "/tours?filter=Románico",
    desc: "La colección de pintura mural románica más importante del mundo."
  },
  {
    id: 2,
    titleItalic: "Modernisme",
    titleNormal: "& Avant-Garde",
    count: 1284,
    image: IMAGES.artworks.jovenDecadente,
    link: "/tours?filter=Modernismo",
    desc: "De Gaudí a Picasso. La eclosión del arte moderno en Barcelona."
  }
];

const HomePage: React.FC<HomePageProps> = ({ role, onSetScrolled, onSetHeaderVisible }) => {
  if (!role) return <Navigate to="/" replace />;

  const { content } = useHomeContent(role);
  const { hash } = useLocation();

  useEffect(() => {
    if (!hash) window.scrollTo(0, 0);
    onSetScrolled(false);
    onSetHeaderVisible(true);
    const handleScroll = () => onSetScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="w-full bg-mnac-bg min-h-screen flex flex-col text-mnac-textPrimary">
      
      {/* HERO SECTION - EDITORIAL STYLE */}
      <section className="relative w-full h-[85vh] flex flex-col justify-end p-6 md:p-12 overflow-hidden">
        {/* Background Image */}
        <div className="absolute inset-0 z-0">
           <OptimizedImage 
            src={content.hero.backgroundImage} 
            alt="MNAC Hero" 
            priority={true}
            aspectRatio="h-full w-full"
            className="opacity-70 scale-105 animate-scale-slow"
           />
           <div className="absolute inset-0 bg-gradient-to-t from-mnac-bg via-mnac-bg/20 to-transparent"></div>
        </div>

        {/* Content */}
        <div className="relative z-10 max-w-[1920px] w-full mx-auto animate-slide-up">
           <div className="flex justify-between items-end border-b border-mnac-divider pb-8">
              <div>
                 <span className="block text-[10px] font-bold uppercase tracking-[0.3em] text-mnac-textSecondary mb-4">
                    Museu Nacional
                 </span>
                 <h1 className="text-6xl md:text-8xl font-sans font-black leading-none mb-2 tracking-tight">
                    {content.hero.titleItalic}
                 </h1>
                 <h1 className="text-6xl md:text-8xl font-sans font-light leading-none tracking-tighter">
                    {content.hero.titleNormal}
                 </h1>
              </div>
              
              {/* Floating Action Button - ACCENT */}
              <Link to={content.hero.linkPrimary} className="hidden md:flex group items-center justify-center w-20 h-20 rounded-full bg-mnac-accent text-white hover:scale-110 transition-transform shadow-[0_0_30px_rgba(255,77,40,0.4)]">
                 <ArrowRight size={32} className="-rotate-45 group-hover:rotate-0 transition-transform duration-300" />
              </Link>
           </div>
           
           <div className="flex justify-between items-center pt-6 text-[10px] font-bold uppercase tracking-widest text-mnac-textSecondary">
              <span className="flex items-center gap-2"><Clock size={12}/> Abierto hoy hasta las 18h</span>
              <Link to="/visit" className="hover:text-white transition-colors flex items-center gap-2">
                 Planificar Visita <ArrowUpRight size={12} />
              </Link>
           </div>
        </div>
      </section>

      {/* FEATURED SECTIONS - "THE GODS" STYLE GRID */}
      <section className="px-6 md:px-12 py-12 max-w-[1920px] mx-auto w-full">
         <div className="grid grid-cols-1 gap-12">
            
            {FEATURED_SECTIONS.map((section, idx) => (
               <Link to={section.link} key={section.id} className="group block relative border-b border-mnac-divider pb-12 last:border-0">
                  <div className="flex flex-col md:flex-row gap-8 items-start md:items-center">
                     
                     {/* Text Block */}
                     <div className="flex-1 order-2 md:order-1">
                        <span className="text-mnac-textSecondary font-sans text-xs mb-2 block font-medium">{section.count} Obras</span>
                        <h2 className="text-4xl md:text-6xl font-sans font-black mb-1 group-hover:text-mnac-accent transition-colors duration-300 tracking-tight">
                           {section.titleItalic}
                        </h2>
                        <h2 className="text-4xl md:text-6xl font-sans font-light mb-6 tracking-tighter">
                           {section.titleNormal}
                        </h2>
                        <p className="text-mnac-textSecondary max-w-md text-sm leading-relaxed mb-8 font-medium">
                           {section.desc}
                        </p>
                        
                        <div className="flex items-center gap-3 text-[10px] font-bold uppercase tracking-[0.2em] text-mnac-textPrimary group-hover:translate-x-2 transition-transform">
                           Explorar <div className="w-8 h-[1px] bg-mnac-accent"></div>
                        </div>
                     </div>

                     {/* Image Block - Vertical & Elegant */}
                     <div className="w-full md:w-1/3 aspect-[3/4] overflow-hidden relative order-1 md:order-2 bg-mnac-surface">
                        <OptimizedImage 
                           src={section.image} 
                           alt={section.titleNormal} 
                           aspectRatio="h-full w-full"
                           className="group-hover:scale-105 transition-transform duration-700 ease-out opacity-80 group-hover:opacity-100"
                        />
                        {/* Play Button Overlay */}
                        <div className="absolute bottom-6 right-6 w-12 h-12 rounded-full bg-mnac-accent text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 translate-y-4 group-hover:translate-y-0 shadow-lg">
                           <Play size={20} fill="currentColor" />
                        </div>
                     </div>
                  </div>
               </Link>
            ))}

         </div>
      </section>

      {/* FOOTER PREVIEW - MINIMAL */}
      <section className="bg-mnac-surface px-6 py-20 text-center">
         <span className="text-mnac-accent text-xs font-bold uppercase tracking-widest mb-4 block">Agenda</span>
         <h2 className="text-4xl font-sans font-bold text-white mb-8 tracking-tight">Exposiciones Temporales</h2>
         <div className="flex justify-center gap-4">
            <Link to="/visit" className="border border-white/20 px-8 py-3 text-xs font-bold uppercase tracking-widest hover:bg-white hover:text-black transition-colors">
               Ver Agenda
            </Link>
         </div>
      </section>

      <Footer role={role} />
    </div>
  );
};

export default HomePage;