
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
    <div className="min-h-screen bg-white pt-20 flex flex-col">
      
      {/* Top Bar */}
      <div className="sticky top-20 z-30 bg-white/90 backdrop-blur-md border-b border-gray-200 px-6 py-4">
         <div className="max-w-[1920px] mx-auto flex justify-between items-center">
            <div>
                <h1 className="font-serif italic text-2xl text-mnac-dark">{headerTitle}</h1>
                <p className="text-xs text-gray-500 hidden md:block">{headerSubtitle}</p>
            </div>
            
            <div className="flex gap-4">
                <button 
                    onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                    className="flex items-center gap-2 border border-gray-300 px-4 py-2 text-xs font-bold uppercase tracking-widest hover:bg-black hover:text-white transition-colors"
                >
                    <SlidersHorizontal size={14} /> Filtros
                </button>
                <div className="hidden md:flex items-center gap-2 border-l border-gray-300 pl-4 text-xs font-bold uppercase tracking-widest text-gray-500">
                    <span>{ARTWORKS_DATA.length} Resultados</span>
                </div>
            </div>
         </div>
      </div>

      <div className="flex-grow flex max-w-[1920px] mx-auto w-full">
          
          {/* Sidebar Filtros (Desktop: Sticky, Mobile: Fixed Modal) */}
          <aside className={`
            fixed inset-y-0 left-0 z-40 w-80 bg-white border-r border-gray-200 transform transition-transform duration-300 ease-in-out p-6 overflow-y-auto
            md:relative md:translate-x-0 md:w-64 md:block
            ${isSidebarOpen ? 'translate-x-0 shadow-2xl' : '-translate-x-full md:shadow-none'}
          `}>
             <div className="flex justify-between items-center mb-8 md:hidden">
                <span className="font-serif italic text-xl">Filtros</span>
                <button onClick={() => setIsSidebarOpen(false)}><X size={24}/></button>
             </div>

             <div className="space-y-8">
                {/* Periodo */}
                <div>
                    <h3 className="text-xs font-bold uppercase tracking-widest mb-4 flex justify-between cursor-pointer">
                        Periodo <ChevronDown size={14}/>
                    </h3>
                    <div className="space-y-2">
                        {['Románico', 'Gótico', 'Renacimiento', 'Barroco', 'Modernismo'].map(period => (
                            <label key={period} className="flex items-center gap-3 cursor-pointer group">
                                <div className="w-4 h-4 border border-gray-300 rounded-sm group-hover:border-mnac-red"></div>
                                <span className="text-sm text-gray-600 group-hover:text-mnac-dark">{period}</span>
                            </label>
                        ))}
                    </div>
                </div>

                {/* Técnica (Solo Teachers) */}
                {userRole === 'teacher' && (
                    <div>
                        <h3 className="text-xs font-bold uppercase tracking-widest mb-4 flex justify-between cursor-pointer">
                            Técnica <ChevronDown size={14}/>
                        </h3>
                        <div className="space-y-2">
                            {['Óleo', 'Fresco', 'Temple', 'Escultura'].map(tech => (
                                <label key={tech} className="flex items-center gap-3 cursor-pointer group">
                                    <div className="w-4 h-4 border border-gray-300 rounded-sm group-hover:border-mnac-red"></div>
                                    <span className="text-sm text-gray-600 group-hover:text-mnac-dark">{tech}</span>
                                </label>
                            ))}
                        </div>
                    </div>
                )}
             </div>
          </aside>

          {/* Grid */}
          <main className="flex-1 p-6 md:p-8 bg-gray-50/50">
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
