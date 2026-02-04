import React, { useState, useEffect } from 'react';
import { UserRole } from '../types';
import { TOURS_DATA } from '../data/tours';
import { generateCustomItinerary } from '../services/geminiService';
import { Map, ArrowRight, Sparkles, ChevronDown, Play, X, Loader2, Compass } from 'lucide-react';
import Footer from '../components/Footer';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { IMAGES } from '../data/images';

interface ToursPageProps {
  userRole: UserRole;
}

const ToursPage: React.FC<ToursPageProps> = ({ userRole }) => {
  const [activeFilter, setActiveFilter] = useState('Todos');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [prompt, setPrompt] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  // Leer filtro desde la URL
  useEffect(() => {
    const filterParam = searchParams.get('filter');
    if (filterParam && ['Highlights', 'Modernismo', 'Románico', 'Cortos'].includes(filterParam)) {
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
    navigate(`/tour/${tourId}/play`);
  };

  const handleCreateRoute = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!prompt.trim()) return;

    setIsGenerating(true);
    try {
      const customItinerary = await generateCustomItinerary(prompt);
      if (customItinerary) {
        localStorage.setItem('custom_tour_data', JSON.stringify(customItinerary));
        navigate('/tour/custom/play');
      } else {
        alert("Lo siento, no pude generar una ruta con esas especificaciones.");
      }
    } catch (error) {
      console.error(error);
      alert("Error de conexión con Palau.");
    } finally {
      setIsGenerating(false);
      setIsModalOpen(false);
    }
  };

  return (
    <div className="bg-mnac-bg min-h-screen text-mnac-textPrimary">
      
      {/* MODAL GENERACIÓN IA - DARK */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
          <div className="absolute inset-0 bg-black/90 backdrop-blur-md animate-fade-in" onClick={() => !isGenerating && setIsModalOpen(false)}></div>
          
          <div className="bg-[#121212] w-full max-w-lg rounded-3xl border border-white/10 shadow-[0_0_50px_rgba(0,0,0,0.8)] relative z-10 overflow-hidden animate-pop-in">
             {/* Background Effects */}
             <div className="absolute top-0 right-0 w-64 h-64 bg-mnac-accent/20 blur-[80px] rounded-full pointer-events-none"></div>
             <div className="absolute bottom-0 left-0 w-64 h-64 bg-blue-900/20 blur-[80px] rounded-full pointer-events-none"></div>

             <div className="p-8">
                <div className="flex justify-between items-start mb-6">
                   <div className="flex items-center gap-3 text-mnac-gold">
                      <Sparkles size={20} className="animate-pulse" />
                      <span className="text-xs font-bold uppercase tracking-widest">MNAC Intelligence</span>
                   </div>
                   {!isGenerating && (
                     <button onClick={() => setIsModalOpen(false)} className="text-gray-500 hover:text-white transition-colors">
                        <X size={20} />
                     </button>
                   )}
                </div>

                <h3 className="font-sans font-bold text-3xl text-white mb-2">Diseña tu experiencia</h3>
                <p className="text-gray-400 text-sm font-light mb-8">
                   Cuéntale a Palau qué te interesa. Él buscará en el archivo y creará un itinerario a medida con audioguía.
                </p>

                <form onSubmit={handleCreateRoute}>
                   <textarea 
                     value={prompt}
                     onChange={(e) => setPrompt(e.target.value)}
                     placeholder="Ej: 'Quiero una ruta sobre dragones y bestias medievales para niños' o 'Obras que muestren la moda del siglo XIX'..."
                     className="w-full bg-white/5 border border-white/10 rounded-xl p-4 text-white placeholder-gray-600 focus:outline-none focus:border-mnac-gold/50 focus:bg-white/10 transition-all min-h-[120px] mb-6 resize-none text-base font-light"
                     disabled={isGenerating}
                   />
                   
                   <button 
                     type="submit"
                     disabled={!prompt.trim() || isGenerating}
                     className="w-full bg-gradient-to-r from-mnac-gold to-yellow-600 text-black py-4 rounded-xl text-xs font-bold uppercase tracking-widest hover:brightness-110 transition-all shadow-lg flex items-center justify-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed"
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

      {/* HERO SECTION */}
      <div className="relative h-screen w-full overflow-hidden flex items-center justify-center bg-black">
        <div className="absolute inset-0 z-0">
           <img 
            src={IMAGES.tours.hero}
            className="w-full h-full object-cover animate-scale-slow opacity-60"
            alt="Sala Oval MNAC"
           />
           <div className="absolute inset-0 bg-gradient-to-t from-mnac-bg via-transparent to-black/60"></div>
           <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-mnac-bg/90"></div>
        </div>
        
        <div className="relative z-10 text-center max-w-6xl px-6 animate-slide-up mt-10">
           <div className="inline-block mb-6 relative group cursor-default">
              <span className="text-mnac-gold text-xs md:text-sm font-bold uppercase tracking-[0.4em] relative z-10 pl-1 transition-colors duration-500 group-hover:text-white">
                 Itinerarios & Rutas
              </span>
              <div className="absolute bottom-0 left-0 w-full h-[1px] bg-mnac-gold/50 group-hover:w-1/2 transition-all duration-500"></div>
           </div>
           
           <h1 className="font-sans font-black text-5xl md:text-8xl text-white mb-8 leading-none drop-shadow-2xl tracking-tight">
              <span className="block mb-2 font-light opacity-90">Descubre el MNAC</span>
              <span className="font-black tracking-tight">a tu propio ritmo</span>
           </h1>
           
           <p className="text-gray-300 text-lg md:text-2xl font-light max-w-2xl mx-auto leading-relaxed drop-shadow-md mb-12">
             Desde recorridos exprés de 30 minutos hasta inmersiones profundas en el Románico. Elige tu camino.
           </p>

           <button 
             onClick={() => document.getElementById('catalog-start')?.scrollIntoView({ behavior: 'smooth' })}
             className="bg-white/10 backdrop-blur-md border border-white/30 text-white px-10 py-4 text-xs font-bold uppercase tracking-widest hover:bg-white hover:text-black transition-all duration-300 rounded-sm shadow-lg"
           >
              Ver Catálogo
           </button>
        </div>

        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 text-white/50 animate-bounce hidden md:flex flex-col items-center gap-2">
             <span className="text-[9px] font-bold uppercase tracking-widest">Scroll</span>
             <ChevronDown size={20} />
        </div>
      </div>

      <div id="catalog-start" className="max-w-[1920px] mx-auto px-6 md:px-12 py-12 relative z-20">
        
        {/* AI MAGIC BANNER */}
        <div className="relative -mt-32 mb-24 z-30">
          <div 
             onClick={() => setIsModalOpen(true)}
             className="bg-[#1a1a1a] text-white rounded-sm p-8 md:p-12 shadow-2xl relative overflow-hidden group cursor-pointer transition-transform hover:-translate-y-2 border border-white/10"
          >
             {/* Background Effects */}
             <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-gradient-to-br from-mnac-accent to-purple-900 rounded-full blur-[120px] opacity-10 group-hover:opacity-20 transition-opacity translate-x-1/2 -translate-y-1/2"></div>
             <div className="absolute inset-0 opacity-10" style={{backgroundImage: `url("${IMAGES.tours.stardustTexture}")`}}></div>

             <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-12">
                <div className="flex-1">
                   <div className="flex items-center gap-2 mb-6">
                      <div className="bg-mnac-gold/20 p-2 rounded-lg backdrop-blur-md border border-mnac-gold/20">
                         <Sparkles className="text-mnac-gold animate-pulse" size={20} />
                      </div>
                      <span className="text-xs font-bold uppercase tracking-widest text-mnac-gold">MNAC Intelligence</span>
                   </div>
                   <h2 className="font-sans font-bold text-3xl md:text-5xl mb-6 leading-tight">
                      ¿No encuentras tu ruta ideal? <br/>
                      <span className="font-light text-gray-300">Pídesela a Palau.</span>
                   </h2>
                   <p className="text-gray-400 font-light max-w-xl text-sm md:text-lg leading-relaxed">
                      "Quiero una ruta de 20 minutos sobre dragones y espadas para niños". <br/>
                      Nuestra IA generará un itinerario a medida con mapa y audioguía al instante.
                   </p>
                </div>
                
                <button className="bg-white text-black px-10 py-5 text-xs font-bold uppercase tracking-widest hover:bg-mnac-gold transition-colors shadow-2xl flex items-center gap-3 whitespace-nowrap z-20">
                   <Sparkles size={16} /> Crear Ruta con IA
                </button>
             </div>
          </div>
        </div>

        {/* CATALOG SECTION */}
        <div className="flex flex-col md:flex-row justify-between items-end mb-12 border-b border-white/10 pb-8 gap-6">
           <div>
              <h3 className="font-sans font-bold text-4xl text-white mb-3">Rutas Curadas</h3>
              <p className="text-gray-500 text-base font-light">Selección oficial del equipo educativo del museo.</p>
           </div>
           
           <div className="flex flex-wrap gap-3">
              {['Todos', 'Highlights', 'Modernismo', 'Románico', 'Cortos'].map(filter => (
                 <button 
                   key={filter}
                   onClick={() => setActiveFilter(filter)}
                   className={`px-6 py-2.5 text-[10px] font-bold uppercase tracking-widest border transition-all ${
                      activeFilter === filter 
                      ? 'bg-white text-black border-white shadow-lg' 
                      : 'bg-transparent text-gray-500 border-white/20 hover:border-white hover:text-white'
                   }`}
                 >
                    {filter}
                 </button>
              ))}
           </div>
        </div>

        {/* TOURS GRID - DARK CARDS */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10 mb-32">
           {filteredTours.map((tour) => (
              <div 
                key={tour.id} 
                onClick={() => handleTourClick(tour.id)}
                className="group bg-mnac-surface border border-white/5 hover:border-white/20 hover:shadow-2xl hover:-translate-y-1 transition-all duration-500 flex flex-col h-full cursor-pointer overflow-hidden rounded-sm"
              >
                 
                 {/* Image */}
                 <div className="relative h-72 overflow-hidden">
                    <img 
                       src={tour.coverImage} 
                       alt={tour.title} 
                       className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110 opacity-80 group-hover:opacity-100"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-mnac-surface via-transparent to-transparent"></div>
                    
                    <div className="absolute top-4 right-4 bg-black/60 backdrop-blur-md border border-white/10 px-4 py-2 text-[10px] font-bold uppercase tracking-widest text-white shadow-sm">
                       {tour.duration} min
                    </div>
                    <div className="absolute bottom-4 left-4 flex gap-2">
                       {tour.tags.slice(0, 2).map(tag => (
                          <span key={tag} className="bg-white/10 backdrop-blur-md border border-white/10 text-white px-3 py-1.5 text-[9px] font-bold uppercase tracking-widest shadow-sm">
                             {tag}
                          </span>
                       ))}
                    </div>

                    {/* Play Overlay */}
                    <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-black/40 backdrop-blur-[2px]">
                        <div className="w-16 h-16 rounded-full bg-mnac-accent text-white flex items-center justify-center transform scale-75 group-hover:scale-100 transition-transform duration-300 shadow-2xl">
                            <Play size={32} fill="currentColor" className="ml-1" />
                        </div>
                    </div>
                 </div>

                 {/* Content */}
                 <div className="p-8 flex-1 flex flex-col">
                    <div className="flex justify-between items-start mb-4">
                       <h3 className="font-sans font-bold text-3xl text-white leading-none group-hover:text-mnac-accent transition-colors duration-300">
                          {tour.title}
                       </h3>
                    </div>
                    
                    <p className="text-gray-400 text-sm font-light mb-8 line-clamp-3 flex-1 leading-relaxed">
                       {tour.description}
                    </p>

                    <div className="flex items-center justify-between border-t border-white/10 pt-6 mt-auto">
                       <div className="flex items-center gap-6 text-xs text-gray-500 font-bold uppercase tracking-wider">
                          <span className="flex items-center gap-2"><Map size={16} className="text-white" /> {tour.stops.length} Paradas</span>
                          <span className={`flex items-center gap-2 px-2 py-1 bg-white/5 rounded ${
                             tour.difficulty === 'Baja' ? 'text-green-400' : 
                             tour.difficulty === 'Media' ? 'text-yellow-400' : 'text-red-400'
                          }`}>
                             {tour.difficulty}
                          </span>
                       </div>
                       
                       <button className="w-12 h-12 rounded-full bg-white/5 border border-white/5 flex items-center justify-center text-white group-hover:bg-white group-hover:text-black transition-all duration-300 shadow-sm transform group-hover:rotate-[-45deg]">
                          <ArrowRight size={20} />
                       </button>
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