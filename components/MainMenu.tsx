import React, { useState } from 'react';
import { ArrowRight, X, ChevronDown, Sparkles, MapPin, Clock, Calendar, Search, SlidersHorizontal, User, Star } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { IMAGES } from '../data/images';

interface MainMenuProps {
  isOpen: boolean;
  onClose: () => void;
}

const MENU_ITEMS = [
  {
    id: '01',
    label: 'Colección',
    sub: 'Archivo & Obras',
    image: IMAGES.artworks.pantocrator,
    path: '/collection', 
    subItems: [
      { label: 'Buscador IA', path: '/collection/ai-search', icon: Sparkles },
      { label: 'Explorar por Filtros', path: '/collection/explore', icon: SlidersHorizontal },
      { label: 'Catálogo Completo', path: '/collection', icon: Search },
    ]
  },
  {
    id: '02',
    label: 'Itinerarios',
    sub: 'Rutas Temáticas',
    image: IMAGES.artworks.jovenDecadente,
    path: '/tours',
    subItems: [
      { label: 'Línea de Tiempo', path: '/tours/timeline', icon: Calendar },
      { label: 'Índice de Artistas', path: '/tours/authors', icon: User },
      { label: 'Obras Maestras', path: '/tours?filter=Highlights', icon: Star },
    ]
  },
  {
    id: '03',
    label: 'Visita',
    sub: 'Info Práctica',
    image: IMAGES.visit.hero,
    path: '/visit',
    subItems: [
      { label: 'Horarios y Precios', path: '/visit#schedule', icon: Clock },
      { label: 'Mapa Interactivo', path: '/visit/map', icon: MapPin },
      { label: 'Accesibilidad', path: '/visit/accessibility', icon: User },
    ]
  },
  {
    id: '04',
    label: 'Exposiciones',
    sub: 'Agenda 2024',
    image: IMAGES.artworks.suenoSurrealista,
    path: '/#exhibitions',
    subItems: [] 
  }
];

const MainMenu: React.FC<MainMenuProps> = ({ isOpen, onClose }) => {
  const [hoveredImage, setHoveredImage] = useState<string | null>(null);
  const [expandedItems, setExpandedItems] = useState<Record<string, boolean>>({});
  const navigate = useNavigate();

  if (!isOpen) return null;

  const toggleExpand = (id: string, hasSubItems: boolean, path: string, image: string) => {
    if (!hasSubItems) {
      navigate(path);
      onClose();
      return;
    }
    
    setExpandedItems(prev => {
      const isOpening = !prev[id];
      setHoveredImage(isOpening ? image : null);
      return { ...prev, [id]: isOpening };
    });
  };

  return (
    <div className="fixed inset-0 z-[200] bg-mnac-bg text-mnac-secondary flex animate-fade-in overflow-hidden font-sans">
      
      {/* CAPA DE FONDO: Imagen Hover */}
      <div 
          className={`absolute inset-0 bg-cover bg-center transition-all duration-700 ease-out z-0 pointer-events-none 
            ${hoveredImage ? 'opacity-30 scale-105' : 'opacity-0 scale-100'}
          `}
          style={{ backgroundImage: hoveredImage ? `url(${hoveredImage})` : 'none' }}
      ></div>

      {/* GRADIENTE PARA LEGIBILIDAD */}
      <div className="absolute inset-0 bg-gradient-to-r from-mnac-bg via-mnac-bg/95 to-transparent z-10 pointer-events-none"></div>
      
      {/* CONTENIDO PRINCIPAL */}
      <div className="relative z-30 w-full max-w-6xl mx-auto flex flex-col h-full px-6 md:px-12 py-8">
        
        {/* HEADER LIMPIO */}
        <div className="flex justify-between items-start mb-8 border-b border-mnac-secondary/20 pb-6 pt-4">
          <div className="flex flex-col">
            <span className="text-xl font-display font-extrabold tracking-tighter mb-1 text-mnac-secondary">
                MNAC
            </span>
            <span className="text-[10px] font-bold text-mnac-secondary/60 tracking-[0.2em] uppercase">
                Menú Principal
            </span>
          </div>
          <button 
            onClick={onClose} 
            className="group w-12 h-12 flex items-center justify-center rounded-full bg-mnac-secondary/5 hover:bg-mnac-secondary hover:text-mnac-bg transition-all duration-300"
          >
            <X size={20} className="transition-transform group-hover:rotate-90" />
          </button>
        </div>

        {/* LISTA DE NAVEGACIÓN */}
        <nav className="flex-1 overflow-y-auto no-scrollbar pr-4">
          <ul className="space-y-4">
            {MENU_ITEMS.map((item) => {
              const isExpanded = expandedItems[item.id];
              const hasSubItems = item.subItems && item.subItems.length > 0;

              return (
                <li key={item.id} className="group border-b border-mnac-secondary/10 last:border-0 pb-4">
                  <button 
                    onClick={() => toggleExpand(item.id, hasSubItems, item.path, item.image)}
                    onMouseEnter={() => setHoveredImage(item.image)}
                    onMouseLeave={() => !isExpanded && setHoveredImage(null)}
                    className="w-full flex items-baseline gap-8 text-left group-hover:pl-4 transition-all duration-300 outline-none"
                  >
                    <span className={`text-xs font-bold text-mnac-secondary/50 transition-colors duration-300 ${isExpanded ? 'text-mnac-accent' : ''}`}>
                      {item.id}
                    </span>

                    <div className="flex-1 flex items-center justify-between">
                      <div>
                        <span className={`block text-4xl md:text-6xl font-display font-medium tracking-tight transition-colors duration-300 leading-none ${isExpanded ? 'text-mnac-secondary' : 'text-mnac-secondary/50 group-hover:text-mnac-secondary'}`}>
                          {item.label}
                        </span>
                        <span className="block mt-2 text-[10px] font-bold uppercase tracking-[0.2em] text-mnac-secondary/60 group-hover:text-mnac-accent transition-colors opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0 duration-300 delay-75">
                            {item.sub}
                        </span>
                      </div>
                      
                      <div className={`transition-transform duration-500 text-mnac-secondary/50 group-hover:text-mnac-secondary ${isExpanded ? 'rotate-180' : ''}`}>
                         {hasSubItems ? <ChevronDown size={24} strokeWidth={1.5} /> : <ArrowRight size={24} strokeWidth={1.5} />}
                      </div>
                    </div>
                  </button>

                  <div 
                    className={`overflow-hidden transition-all duration-500 ease-[cubic-bezier(0.25,1,0.5,1)] ${isExpanded ? 'max-h-[300px] opacity-100 mt-6' : 'max-h-0 opacity-0'}`}
                  >
                    <ul className="pl-[3rem] md:pl-[4.5rem] space-y-1 ml-1 border-l border-mnac-secondary/20">
                      {item.subItems.map((sub, idx) => (
                        <li key={idx}>
                          <Link 
                            to={sub.path}
                            onClick={onClose}
                            className="flex items-center gap-4 py-3 pl-6 hover:bg-mnac-secondary/5 transition-colors group/sub"
                          >
                             <div className="text-mnac-secondary/60 group-hover/sub:text-mnac-accent transition-colors">
                                <sub.icon size={16} />
                             </div>
                             <span className="text-sm font-bold text-mnac-secondary/70 group-hover/sub:text-mnac-secondary tracking-wide transition-colors">
                                {sub.label}
                             </span>
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </div>
                </li>
              );
            })}
          </ul>
        </nav>

        {/* Footer Minimalista */}
        <div className="mt-8 flex flex-col md:flex-row justify-between items-end pt-8 gap-6">
            <div className="flex gap-8">
                <a href="#" className="text-[10px] font-bold text-mnac-secondary/50 hover:text-mnac-secondary uppercase tracking-widest transition-colors">Instagram</a>
                <a href="#" className="text-[10px] font-bold text-mnac-secondary/50 hover:text-mnac-secondary uppercase tracking-widest transition-colors">Twitter</a>
            </div>
            <button 
                onClick={() => { onClose(); window.location.hash = '/visit#tickets'; }} 
                className="w-full md:w-auto px-8 py-4 bg-mnac-accent text-white text-xs font-bold uppercase tracking-widest hover:bg-mnac-secondary hover:text-mnac-bg transition-all rounded-sm shadow-lg"
            >
                Comprar Entradas
            </button>
        </div>

      </div>
    </div>
  );
};

export default MainMenu;