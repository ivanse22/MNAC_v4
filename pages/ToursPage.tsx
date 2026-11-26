import React, { useState, useEffect } from 'react';
import { UserRole } from '../types';
import { TOURS_DATA } from '../data/tours';
import { generateCustomItinerary } from '../services/geminiService';
import { Map, ArrowRight, Sparkles, Play, X, Loader2, Clock } from 'lucide-react';
import Footer from '../components/Footer';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { IMAGES } from '../data/images';
import OptimizedImage from '../components/OptimizedImage';
import { hapticService } from '../services/hapticService';

interface ToursPageProps {
  userRole: UserRole;
}

const TOUR_FILTERS = ['Todos', 'Highlights', 'Románico', 'Gótico', 'Renacimiento', 'Modernismo', 'Cortos'];

const ToursPage: React.FC<ToursPageProps> = ({ userRole }) => {
  const [activeFilter, setActiveFilter] = useState('Todos');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [prompt, setPrompt] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  useEffect(() => {
    const filterParam = searchParams.get('filter');
    if (filterParam && TOUR_FILTERS.includes(filterParam)) {
      setActiveFilter(filterParam);
      setTimeout(() => {
        document.getElementById('catalog-start')?.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    }
  }, [searchParams]);

  const filteredTours = activeFilter === 'Todos' 
    ? TOURS_DATA 
    : TOURS_DATA.filter(t => t.tags.includes(activeFilter) || (activeFilter === 'Cortos' && t.duration <= 30));

  const handleTourClick = (tourId: string) => {
    hapticService.light();
    navigate(`/tour/${tourId}/play`);
  };

  const handleCreateRoute = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!prompt.trim()) return;
    hapticService.medium();
    setIsGenerating(true);
    try {
      const customTour = await generateCustomItinerary(prompt);
      if (customTour) {
        navigate(`/tour/${customTour.id}/play`, { state: { customTour } });
      } else {
        navigate('/tour/tour-highlights/play');
      }
    } catch {
      navigate('/tour/tour-highlights/play');
    } finally {
      setIsGenerating(false);
      setIsModalOpen(false);
    }
  };

  return (
    <div className="bg-mnac-bg min-h-screen text-mnac-textPrimary pb-24 md:pb-0">
      
      {/* MODAL GENERACIÓN IA */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-5">
          <div
            className="absolute inset-0 bg-black/85 backdrop-blur-md animate-fade-in"
            onClick={() => !isGenerating && setIsModalOpen(false)}
          />
          
          <div className="bg-mnac-surface w-full max-w-lg rounded-3xl border border-white/10 shadow-2xl relative z-10 overflow-hidden animate-pop-in">
            <div className="p-6 sm:p-8">
              <div className="flex justify-between items-start mb-5">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-mnac-accent/15 border border-mnac-accent/30 text-mnac-accent">
                  <Sparkles size={14} className="animate-pulse" />
                  <span className="text-[10px] font-bold uppercase tracking-widest">Palau IA</span>
                </div>
                {!isGenerating && (
                  <button
                    onClick={() => setIsModalOpen(false)}
                    className="p-2 rounded-full bg-white/5 text-mnac-textSecondary hover:text-white active:scale-95 transition-all"
                  >
                    <X size={18} />
                  </button>
                )}
              </div>

              <h3 className="font-serif text-3xl text-white mb-2 italic">Diseña tu experiencia</h3>
              <p className="text-mnac-textSecondary text-sm font-light mb-6 leading-relaxed">
                Cuéntale a Palau qué te interesa y creará un itinerario a medida con audioguía.
              </p>

              <form onSubmit={handleCreateRoute}>
                <textarea 
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  placeholder="Ej: 'Quiero una ruta de 20 minutos sobre dragones y bestias medievales'..."
                  className="w-full bg-mnac-bg border border-white/10 rounded-2xl p-4 text-white placeholder-mnac-textSecondary/50 focus:outline-none focus:border-mnac-accent transition-all min-h-[120px] mb-5 resize-none text-sm font-light"
                  disabled={isGenerating}
                />
                
                <button 
                  type="submit"
                  disabled={!prompt.trim() || isGenerating}
                  className="w-full bg-mnac-accent text-white py-4 rounded-full text-xs font-bold uppercase tracking-widest hover:opacity-90 active:scale-95 transition-all shadow-lg flex items-center justify-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isGenerating ? (
                    <>
                      <Loader2 size={16} className="animate-spin" /> Analizando Colección...
                    </>
                  ) : (
                    <>
                      <Sparkles size={16} /> Generar Ruta
                    </>
                  )}
                </button>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* HERO SECTION - EDITORIAL MOBILE-FIRST */}
      <section className="relative w-full h-[55vh] md:h-[70vh] flex flex-col justify-end p-5 sm:p-6 md:p-12 overflow-hidden">
        <div className="absolute inset-0 z-0">
          <OptimizedImage
            src={IMAGES.tours.hero}
            alt="Itinerarios MNAC"
            priority={true}
            aspectRatio="h-full w-full"
            className="opacity-65 scale-105 animate-scale-slow"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-mnac-bg via-mnac-bg/40 to-transparent" />
        </div>

        <div className="relative z-10 max-w-[1920px] w-full mx-auto animate-slide-up">
          <div className="flex flex-col md:flex-row md:justify-between md:items-end border-b border-mnac-divider pb-6 md:pb-8 gap-5">
            <div>
              <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full bg-black/40 backdrop-blur-md border border-white/10 mb-3">
                <span className="w-1.5 h-1.5 rounded-full bg-mnac-accent" />
                <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-mnac-textPrimary">
                  Itinerarios & Audioguías
                </span>
              </div>
              <h1 className="text-4xl sm:text-6xl md:text-8xl font-serif italic leading-none mb-1.5 tracking-tight text-white">
                Descubre el MNAC
              </h1>
              <h1 className="text-4xl sm:text-6xl md:text-8xl font-sans font-light leading-none tracking-tighter text-mnac-textPrimary">
                a tu propio ritmo
              </h1>
            </div>

            <button
              onClick={() => {
                hapticService.light();
                setIsModalOpen(true);
              }}
              className="inline-flex items-center justify-between md:justify-center gap-3 w-full md:w-auto px-6 py-3.5 rounded-full bg-mnac-accent text-white font-bold text-xs uppercase tracking-[0.2em] active:scale-95 transition-transform shadow-[0_8px_24px_rgba(241,74,50,0.35)]"
            >
              <span className="flex items-center gap-2"><Sparkles size={16} /> Crear Ruta IA</span>
              <ArrowRight size={16} />
            </button>
          </div>

          <div className="flex justify-between items-center pt-4 text-[10px] font-bold uppercase tracking-widest text-mnac-textSecondary">
            <span>{TOURS_DATA.length} Rutas curadas disponibles</span>
            <button
              onClick={() => {
                hapticService.light();
                document.getElementById('catalog-start')?.scrollIntoView({ behavior: 'smooth' });
              }}
              className="hover:text-white active:scale-95 transition-all"
            >
              Ver catálogo ↓
            </button>
          </div>
        </div>
      </section>

      {/* CATALOG SECTION */}
      <div id="catalog-start" className="max-w-[1920px] mx-auto px-5 sm:px-6 md:px-12 py-8 md:py-12">
        
        {/* AI COMPACT CARD */}
        <div
          onClick={() => {
            hapticService.light();
            setIsModalOpen(true);
          }}
          className="mb-10 p-5 sm:p-7 rounded-2xl bg-mnac-surface border border-white/10 flex flex-col sm:flex-row sm:items-center justify-between gap-4 cursor-pointer active:scale-[0.99] transition-transform"
        >
          <div className="flex items-start sm:items-center gap-4">
            <div className="w-11 h-11 rounded-xl bg-mnac-accent/15 border border-mnac-accent/30 flex items-center justify-center text-mnac-accent shrink-0">
              <Sparkles size={20} />
            </div>
            <div>
              <h2 className="font-serif italic text-xl sm:text-2xl text-white leading-tight">
                ¿Buscas algo específico? <span className="font-sans font-light not-italic text-mnac-textSecondary">Pídeselo a Palau IA</span>
              </h2>
              <p className="text-xs text-mnac-textSecondary mt-1">
                Genera una ruta personalizada según tu tiempo e intereses.
              </p>
            </div>
          </div>
          <span className="inline-flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-mnac-accent shrink-0">
            Personalizar <ArrowRight size={14} />
          </span>
        </div>

        {/* FILTER HEADER & HORIZONTAL PILLS */}
        <div className="mb-8 space-y-4">
          <div className="flex items-end justify-between">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-mnac-accent block mb-1">
                Selección Oficial
              </span>
              <h2 className="font-serif italic text-2xl sm:text-3xl text-white tracking-tight">
                Rutas Curadas
              </h2>
            </div>
            <span className="text-[11px] text-mnac-textSecondary font-medium">
              {filteredTours.length} {filteredTours.length === 1 ? 'ruta' : 'rutas'}
            </span>
          </div>

          <div className="flex gap-2.5 overflow-x-auto no-scrollbar pb-1 md:flex-wrap">
            {TOUR_FILTERS.map((filter) => (
              <button
                key={filter}
                onClick={() => {
                  hapticService.light();
                  setActiveFilter(filter);
                }}
                className={`shrink-0 px-5 py-2.5 rounded-full text-[10px] font-bold uppercase tracking-widest border active:scale-95 transition-all ${
                  activeFilter === filter
                    ? 'bg-mnac-accent text-white border-mnac-accent shadow-lg'
                    : 'bg-mnac-surface text-mnac-textSecondary border-white/10 hover:border-white/25 hover:text-white'
                }`}
              >
                {filter}
              </button>
            ))}
          </div>
        </div>

        {/* TOURS GRID */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8 mb-16">
          {filteredTours.map((tour) => (
            <div
              key={tour.id}
              onClick={() => handleTourClick(tour.id)}
              className="group bg-mnac-surface border border-white/10 hover:border-white/25 rounded-2xl overflow-hidden flex flex-col h-full cursor-pointer active:scale-[0.98] transition-all duration-300"
            >
              <div className="relative aspect-[16/10] overflow-hidden bg-mnac-bg">
                <OptimizedImage
                  src={tour.coverImage}
                  alt={tour.title}
                  aspectRatio="h-full w-full"
                  className="opacity-85 group-hover:opacity-100 group-hover:scale-105 transition-all duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-mnac-surface via-transparent to-transparent" />

                <div className="absolute top-3.5 right-3.5 bg-black/60 backdrop-blur-md border border-white/10 px-3 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-wider text-white flex items-center gap-1.5">
                  <Clock size={11} className="text-mnac-accent" /> {tour.duration} min
                </div>

                <div className="absolute bottom-3.5 left-3.5 flex gap-2">
                  {tour.tags.slice(0, 2).map((tag) => (
                    <span
                      key={tag}
                      className="bg-black/60 backdrop-blur-md border border-white/10 text-white px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider"
                    >
                      {tag}
                    </span>
                  ))}
                </div>

                {/* Always-visible Play Button on Mobile */}
                <div className="absolute bottom-3.5 right-3.5 w-11 h-11 rounded-full bg-mnac-accent text-white flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                  <Play size={18} fill="currentColor" className="ml-0.5" />
                </div>
              </div>

              <div className="p-5 sm:p-6 flex-1 flex flex-col">
                <h3 className="font-serif italic text-2xl sm:text-3xl text-white leading-tight mb-2 group-hover:text-mnac-accent transition-colors">
                  {tour.title}
                </h3>

                <p className="text-mnac-textSecondary text-xs sm:text-sm font-light mb-6 line-clamp-2 flex-1 leading-relaxed">
                  {tour.description}
                </p>

                <div className="flex items-center justify-between border-t border-white/10 pt-4 mt-auto">
                  <div className="flex items-center gap-3 text-[11px] text-mnac-textSecondary font-bold uppercase tracking-wider">
                    <span className="flex items-center gap-1.5">
                      <Map size={14} className="text-mnac-accent" /> {tour.stops.length} Paradas
                    </span>
                    <span
                      className={`px-2.5 py-0.5 rounded-full bg-white/5 text-[10px] ${
                        tour.difficulty === 'Baja'
                          ? 'text-emerald-400'
                          : tour.difficulty === 'Media'
                          ? 'text-amber-400'
                          : 'text-rose-400'
                      }`}
                    >
                      {tour.difficulty}
                    </span>
                  </div>

                  <span className="inline-flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-widest text-white group-hover:text-mnac-accent transition-colors">
                    Iniciar <ArrowRight size={14} />
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <Footer role={userRole} />
    </div>
  );
};

export default ToursPage;
