
import React, { useState } from 'react';
import { UserRole } from '../types';
import { ARTWORKS_DATA } from '../data/artworks';
import ArtCard from '../components/ArtCard';
import Footer from '../components/Footer';
import { Filter, ChevronDown, SlidersHorizontal, X } from 'lucide-react';

interface ExplorePageProps {
  userRole: UserRole;
  savedArtIds: string[];
  onToggleSave: (id: string) => void;
}

const ExplorePage: React.FC<ExplorePageProps> = ({ userRole, savedArtIds, onToggleSave }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  
  // Textos Adaptados
  const headerTitle = userRole === 'teacher' ? 'Archivo Digital' : 'Explorar Colección';
  const headerSubtitle = userRole === 'teacher' ? 'Herramientas de filtrado curricular' : 'Descubre tus obras favoritas';

  return (
    <div className="min-h-screen bg-mnac-bg text-mnac-textPrimary pt-20 pb-24 md:pb-0 flex flex-col">
      
      {/* Top Bar */}
      <div className="sticky top-20 z-30 bg-mnac-bg/90 backdrop-blur-md border-b border-white/10 px-5 sm:px-6 py-4">
         <div className="max-w-[1920px] mx-auto flex justify-between items-center">
            <div>
                <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-mnac-accent block mb-0.5">Colección</span>
                <h1 className="font-serif italic text-2xl sm:text-3xl text-white">{headerTitle}</h1>
                <p className="text-xs text-mnac-textSecondary hidden md:block">{headerSubtitle}</p>
            </div>
            
            <div className="flex gap-4">
                <button 
                    onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                    className="flex items-center gap-2 border border-white/15 bg-mnac-surface text-white rounded-full px-4 py-2 text-xs font-bold uppercase tracking-widest hover:bg-mnac-accent hover:border-mnac-accent active:scale-95 transition-all"
                >
                    <SlidersHorizontal size={14} /> Filtros
                </button>
                <div className="hidden md:flex items-center gap-2 border-l border-white/10 pl-4 text-xs font-bold uppercase tracking-widest text-mnac-textSecondary">
                    <span>{ARTWORKS_DATA.length} Resultados</span>
                </div>
            </div>
         </div>
      </div>

      <div className="flex-grow flex max-w-[1920px] mx-auto w-full">
          
          {/* Sidebar Filtros (Desktop: Sticky, Mobile: Fixed Modal) */}
          <aside className={`
            fixed inset-y-0 left-0 z-40 w-80 bg-mnac-surface border-r border-white/10 transform transition-transform duration-300 ease-in-out p-6 overflow-y-auto
            md:relative md:translate-x-0 md:w-64 md:block
            ${isSidebarOpen ? 'translate-x-0 shadow-2xl' : '-translate-x-full md:shadow-none'}
          `}>
             <div className="flex justify-between items-center mb-8 md:hidden">
                <span className="font-serif italic text-xl text-white">Filtros</span>
                <button onClick={() => setIsSidebarOpen(false)} className="p-2 rounded-full bg-white/5 text-white active:scale-95"><X size={20}/></button>
             </div>

             <div className="space-y-8">
                {/* Periodo */}
                <div>
                    <h3 className="text-xs font-bold uppercase tracking-widest text-white mb-4 flex justify-between cursor-pointer">
                        Periodo <ChevronDown size={14}/>
                    </h3>
                    <div className="space-y-2.5">
                        {['Románico', 'Gótico', 'Renacimiento', 'Barroco', 'Modernismo'].map(period => (
                            <label key={period} className="flex items-center gap-3 cursor-pointer group">
                                <div className="w-4 h-4 border border-white/25 rounded-sm group-hover:border-mnac-accent transition-colors"></div>
                                <span className="text-sm text-mnac-textSecondary group-hover:text-white transition-colors">{period}</span>
                            </label>
                        ))}
                    </div>
                </div>

                {/* Técnica (Solo Teachers) */}
                {userRole === 'teacher' && (
                    <div>
                        <h3 className="text-xs font-bold uppercase tracking-widest text-white mb-4 flex justify-between cursor-pointer">
                            Técnica <ChevronDown size={14}/>
                        </h3>
                        <div className="space-y-2.5">
                            {['Óleo', 'Fresco', 'Temple', 'Escultura'].map(tech => (
                                <label key={tech} className="flex items-center gap-3 cursor-pointer group">
                                    <div className="w-4 h-4 border border-white/25 rounded-sm group-hover:border-mnac-accent transition-colors"></div>
                                    <span className="text-sm text-mnac-textSecondary group-hover:text-white transition-colors">{tech}</span>
                                </label>
                            ))}
                        </div>
                    </div>
                )}
             </div>
          </aside>

          {/* Grid */}
          <main className="flex-1 p-5 sm:p-6 md:p-8 bg-mnac-bg">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                  {ARTWORKS_DATA.map(art => (
                      <ArtCard 
                        key={art.id}
                        artwork={art}
                        isSaved={savedArtIds.includes(art.id)}
                        onToggleSave={() => onToggleSave(art.id)}
                      />
                  ))}
              </div>
          </main>

      </div>
      <Footer role={userRole} />
    </div>
  );
};

export default ExplorePage;
