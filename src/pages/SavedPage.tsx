import React, { useMemo } from 'react';
import { ArtWork } from '../types';
import { ARTWORKS_DATA } from '../data/artworks';
import { Bookmark, FileText, Download, ArrowRight, Sparkles, RefreshCw } from 'lucide-react';
import { Link } from 'react-router-dom';
import Footer from '../components/Footer';

interface SavedPageProps {
  savedArtIds: string[];
  onToggleSave: (id: string) => void;
}

const SavedPage: React.FC<SavedPageProps> = ({ savedArtIds, onToggleSave }) => {
  const savedArtworks = ARTWORKS_DATA.filter(art => savedArtIds.includes(art.id));

  // Generar una recomendación aleatoria estable para el Empty State
  const randomRecommendation = useMemo(() => {
    // Evitar recomendar algo que ya esté guardado (aunque aquí savedArtworks estaría vacío)
    const available = ARTWORKS_DATA.filter(art => !savedArtIds.includes(art.id));
    if (available.length === 0) return ARTWORKS_DATA[0];
    return available[Math.floor(Math.random() * available.length)];
  }, [savedArtIds]); // Recalcular solo si cambia la lista de guardados

  return (
    <div className="min-h-screen bg-mnac-cream flex flex-col pt-20">
      
      {/* Hero Section */}
      <div className="bg-white border-b border-gray-200 py-16 px-6 md:px-12">
        <div className="max-w-[1920px] mx-auto">
           <div className="flex items-center gap-3 mb-4">
              <Bookmark className="text-mnac-red" size={24} />
              <span className="text-xs font-bold uppercase tracking-widest text-gray-400">Mi Espacio</span>
           </div>
           <h1 className="font-sans font-black text-5xl md:text-7xl text-mnac-dark mb-6 tracking-tight">Colección Privada</h1>
           <p className="text-gray-500 font-light text-lg md:text-xl max-w-2xl leading-relaxed">
             Tu archivo personal de obras maestras. Añade notas de estudio, organiza tus referencias y construye tu propio museo.
           </p>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-grow max-w-[1920px] mx-auto px-6 md:px-12 py-12 w-full">
        
        {savedArtworks.length > 0 ? (
          <div className="animate-slide-up">
             {/* Toolbar */}
             <div className="flex justify-between items-center mb-8 border-b border-gray-200 pb-4">
                <span className="text-sm font-bold uppercase tracking-widest text-gray-500">
                  {savedArtworks.length} Obras Guardadas
                </span>
                <button className="hidden md:flex items-center gap-2 bg-mnac-dark text-white px-6 py-3 text-xs font-bold uppercase tracking-widest hover:bg-mnac-red transition-all shadow-lg">
                   <Download size={16} /> Generar PDF de Estudio
                </button>
             </div>

             {/* Masonry-ish Grid */}
             <div className="columns-1 md:columns-2 lg:columns-3 gap-8 space-y-8">
                {savedArtworks.map((art) => (
                  <div key={art.id} className="break-inside-avoid bg-white p-4 shadow-sm border border-gray-100 group hover:shadow-xl transition-all duration-300">
                      <div className="relative mb-4 overflow-hidden">
                         <img src={art.imageUrl} alt={art.title} className="w-full h-auto object-cover group-hover:scale-105 transition-transform duration-700" />
                         <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                            <button 
                              onClick={() => onToggleSave(art.id)}
                              className="bg-white text-mnac-red p-2 rounded-full shadow-md hover:bg-red-50"
                            >
                              <Bookmark size={16} fill="currentColor" />
                            </button>
                         </div>
                      </div>
                      
                      <div className="mb-4">
                         <span className="text-[10px] font-bold uppercase tracking-widest text-gray-400 block mb-1">{art.period}</span>
                         <h3 className="font-sans font-bold text-2xl text-mnac-dark leading-tight mb-1">
                            <Link to={`/artwork/${art.id}`} className="hover:text-mnac-red transition-colors">{art.title}</Link>
                         </h3>
                         <p className="text-xs font-bold text-gray-500 uppercase">{art.artist}</p>
                      </div>

                      {/* Personal Note Area */}
                      <div className="bg-gray-50 p-4 rounded-sm border border-gray-100 group-hover:border-mnac-red/20 transition-colors">
                         <div className="flex items-center gap-2 mb-2 text-gray-400">
                            <FileText size={12} />
                            <span className="text-[9px] font-bold uppercase tracking-widest">Nota Personal</span>
                         </div>
                         <textarea 
                           placeholder="Escribe aquí tus observaciones..."
                           className="w-full bg-transparent text-sm text-gray-600 placeholder-gray-400 focus:outline-none resize-none font-sans italic"
                           rows={2}
                         />
                      </div>
                  </div>
                ))}
             </div>
          </div>
        ) : (
          /* --- EMOTIONAL EMPTY STATE --- */
          <div className="flex flex-col items-center justify-center py-12 animate-fade-in">
             
             <div className="max-w-4xl w-full bg-white border border-gray-200 shadow-xl rounded-sm overflow-hidden flex flex-col md:flex-row">
                 {/* Imagen de recomendación */}
                 <div className="md:w-1/2 relative min-h-[300px] md:min-h-0">
                     <img 
                        src={randomRecommendation.imageUrl} 
                        alt={randomRecommendation.title} 
                        className="absolute inset-0 w-full h-full object-cover"
                     />
                     <div className="absolute inset-0 bg-black/20"></div>
                     <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-md px-3 py-1 rounded-sm text-[10px] font-bold uppercase tracking-widest text-mnac-dark">
                        Sugerencia para ti
                     </div>
                 </div>

                 {/* Contenido de texto */}
                 <div className="md:w-1/2 p-8 md:p-12 flex flex-col justify-center bg-white">
                     <div className="mb-6">
                        <span className="text-mnac-gold text-xs font-bold uppercase tracking-[0.2em] mb-2 block flex items-center gap-2">
                           <Sparkles size={14} /> Tu colección está vacía
                        </span>
                        <h2 className="font-sans font-bold text-3xl md:text-4xl text-mnac-dark mb-4 leading-tight">
                           Toda gran colección comienza con una primera joya.
                        </h2>
                        <p className="text-gray-500 font-light leading-relaxed mb-6">
                           ¿Por qué no empiezas guardando esta obra maestra de <strong>{randomRecommendation.artist}</strong>? 
                           Explora sus detalles y añádela a tu archivo personal.
                        </p>
                     </div>

                     <div className="flex gap-4">
                        <button 
                           onClick={() => onToggleSave(randomRecommendation.id)}
                           className="flex-1 bg-mnac-dark text-white px-6 py-4 text-xs font-bold uppercase tracking-widest hover:bg-mnac-red transition-all shadow-lg flex items-center justify-center gap-2"
                        >
                           <Bookmark size={16} /> Guardar Obra
                        </button>
                        <Link 
                           to="/collection"
                           className="flex-1 border border-gray-300 text-gray-600 px-6 py-4 text-xs font-bold uppercase tracking-widest hover:border-mnac-dark hover:text-mnac-dark transition-all flex items-center justify-center gap-2"
                        >
                           Explorar Más <ArrowRight size={16} />
                        </Link>
                     </div>
                 </div>
             </div>
             
             <p className="mt-8 text-gray-400 text-xs italic font-sans">
                "El coleccionismo es la única manera de detener el tiempo." — Walter Benjamin
             </p>

          </div>
        )}
      </div>

      <Footer role="student" />
    </div>
  );
};

export default SavedPage;