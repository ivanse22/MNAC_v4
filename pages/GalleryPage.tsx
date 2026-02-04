
import React, { useState, useMemo, useEffect, useRef } from 'react';
import ArtCard from '../components/ArtCard';
import { UserRole } from '../types';
import { ARTWORKS_DATA } from '../data/artworks';
import { Search, ChevronDown, ToggleLeft, ToggleRight, Filter, Sparkles, User, X, Tag } from 'lucide-react';
import Footer from '../components/Footer';
import { useSearchParams } from 'react-router-dom';
import PageTransition from '../components/PageTransition';
import SkeletonCard from '../components/SkeletonCard';
import { VirtuosoGrid } from 'react-virtuoso';

interface GalleryPageProps {
  userRole: UserRole;
  easyReading: boolean;
  setEasyReading: (value: boolean) => void;
  savedArtIds: string[];
  onToggleSave: (id: string) => void;
  isHeaderVisible: boolean;
}

const GalleryPage: React.FC<GalleryPageProps> = ({ 
  userRole, 
  easyReading, 
  setEasyReading, 
  savedArtIds, 
  onToggleSave,
  isHeaderVisible 
}) => {
  const [searchParams] = useSearchParams();
  const [periodFilter, setPeriodFilter] = useState('All');
  const [artistFilter, setArtistFilter] = useState('All');
  const [tagFilter, setTagFilter] = useState('All');
  const [searchTerm, setSearchTerm] = useState('');
  const [showMobileFilters, setShowMobileFilters] = useState(false);
  
  // Refs para animar/enfocar filtros
  const artistSelectRef = useRef<HTMLSelectElement>(null);
  const tagSelectRef = useRef<HTMLSelectElement>(null);
  const periodContainerRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);
  
  const [highlightPeriod, setHighlightPeriod] = useState(false);
  const [highlightArtist, setHighlightArtist] = useState(false);
  const [isAiSearchMode, setIsAiSearchMode] = useState(false);
  const [isSimulatingLoad, setIsSimulatingLoad] = useState(true);

  const periods = useMemo(() => ['All', ...Array.from(new Set(ARTWORKS_DATA.map(a => a.period)))], []);
  const artists = useMemo(() => ['All', ...Array.from(new Set(ARTWORKS_DATA.map(a => a.artist))).sort()], []);
  const tags = useMemo(() => ['All', ...Array.from(new Set(ARTWORKS_DATA.flatMap(a => a.tags))).sort()], []);

  useEffect(() => {
    const timer = setTimeout(() => setIsSimulatingLoad(false), 800);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    const focusMode = searchParams.get('focus');
    const tagParam = searchParams.get('tag');

    if (tagParam) {
       setTagFilter(tagParam);
       setShowMobileFilters(true);
    }
    
    if (focusMode === 'ai') {
      setIsAiSearchMode(true);
      setTimeout(() => searchInputRef.current?.focus(), 300);
    } 
    else if (focusMode === 'filters') {
      setShowMobileFilters(true);
    }
    else if (focusMode === 'artists') {
      setShowMobileFilters(true);
      setHighlightArtist(true);
      setTimeout(() => {
        artistSelectRef.current?.focus();
        setTimeout(() => setHighlightArtist(false), 2000);
      }, 300);
    } 
    else if (focusMode === 'periods') {
      setShowMobileFilters(true);
      setHighlightPeriod(true);
      periodContainerRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      setTimeout(() => setHighlightPeriod(false), 2000);
    }
  }, [searchParams]);

  const filteredArtworks = useMemo(() => {
    return ARTWORKS_DATA.filter(art => {
      const matchesPeriod = periodFilter === 'All' || art.period === periodFilter;
      const matchesArtist = artistFilter === 'All' || art.artist === artistFilter;
      const matchesTag = tagFilter === 'All' || art.tags.includes(tagFilter);
      const searchLower = searchTerm.toLowerCase().trim();
      const matchesSearch = 
          searchLower === '' ||
          art.title.toLowerCase().includes(searchLower) || 
          art.artist.toLowerCase().includes(searchLower) ||
          (isAiSearchMode && art.description.toLowerCase().includes(searchLower)); 
      return matchesPeriod && matchesArtist && matchesTag && matchesSearch;
    });
  }, [periodFilter, artistFilter, tagFilter, searchTerm, isAiSearchMode]);

  const clearFilters = () => {
    setPeriodFilter('All');
    setArtistFilter('All');
    setTagFilter('All');
    setSearchTerm('');
    setIsAiSearchMode(false);
  };

  return (
    <PageTransition className={`min-h-screen transition-colors duration-500 flex flex-col ${easyReading ? 'bg-white text-black' : 'bg-mnac-bg text-mnac-textPrimary'}`}>
      <div id="main-content" className="flex-grow pt-24 md:pt-32 focus:outline-none" tabIndex={-1}>
        <div className="max-w-[1920px] mx-auto px-6 md:px-12 h-full flex flex-col">
          
          {/* Header */}
          <div className={`mb-8 md:mb-12 border-b pb-8 flex flex-col md:flex-row justify-between items-end gap-8 ${easyReading ? 'border-gray-200' : 'border-white/10'}`}>
              <div>
                  <span className="text-mnac-accent text-xs font-bold uppercase tracking-widest mb-4 block">La Colección</span>
                  <h1 className={`${easyReading ? 'font-sans font-bold' : 'font-serif italic'} text-5xl md:text-7xl mb-4 md:mb-6 leading-none`}>
                     {easyReading ? 'Explorar Arte' : 'Archivo Digital'}
                  </h1>
                  <p className={`text-base md:text-xl max-w-2xl leading-relaxed ${easyReading ? 'font-medium text-gray-600' : 'font-light text-gray-400'}`}>
                      {easyReading 
                         ? "Descubre historias increíbles detrás de nuestras pinturas y estatuas."
                         : "Explora mil años de creatividad. Desde los murales románicos hasta la vanguardia catalana."
                      }
                  </p>
              </div>
              
              <div className={`flex items-center gap-3 px-4 py-3 rounded-full border shadow-sm self-start md:self-auto ${easyReading ? 'bg-white border-gray-200' : 'bg-white/5 border-white/10'}`}>
                 <span className={`text-xs font-bold uppercase tracking-wider ${easyReading ? 'text-gray-500' : 'text-gray-400'}`}>Lectura Fácil</span>
                 <button onClick={() => setEasyReading(!easyReading)} className="hover:text-mnac-accent transition-colors">
                    {easyReading ? <ToggleRight size={32} className="text-mnac-accent" /> : <ToggleLeft size={32} className="text-gray-500" />}
                 </button>
              </div>
          </div>

          {/* Sticky Toolbar - DARK GLASS */}
          <div 
            className={`sticky z-30 py-4 -mx-6 px-6 md:mx-0 md:px-0 mb-8 border-b transition-all duration-500 ease-[cubic-bezier(0.32,0.72,0,1)] backdrop-blur-md ${isHeaderVisible ? 'top-16 md:top-20' : 'top-0'}`}
            style={{ 
               backgroundColor: easyReading ? 'rgba(255,255,255,0.9)' : 'rgba(18, 18, 18, 0.85)',
               borderColor: easyReading ? '#e5e7eb' : 'rgba(255,255,255,0.1)'
            }}
          >
            <div className="flex flex-col gap-4">
              
              {/* Search & Mobile Filter Toggle */}
              <div className="flex gap-3">
                 <div className={`relative flex-grow group transition-all duration-300 ${isAiSearchMode ? 'scale-[1.01]' : ''}`}>
                   <input
                     ref={searchInputRef}
                     type="text"
                     placeholder={isAiSearchMode ? "Pregunta a la IA sobre la colección..." : (easyReading ? "Buscar cuadros..." : "BUSCAR EN ARCHIVO")}
                     value={searchTerm}
                     onChange={(e) => setSearchTerm(e.target.value)}
                     className={`w-full border rounded-full md:rounded-none py-3 px-4 md:pl-10 md:pr-8 text-sm font-bold uppercase tracking-wider focus:outline-none transition-all
                        ${isAiSearchMode 
                            ? 'bg-mnac-gold/10 border-mnac-gold text-mnac-textPrimary placeholder-mnac-gold/50 ring-2 ring-mnac-gold/20' 
                            : easyReading 
                                ? 'bg-gray-50 border-gray-200 placeholder-gray-400 focus:border-mnac-accent'
                                : 'bg-white/5 border-white/10 md:border-0 md:border-b md:border-white/20 text-white placeholder-gray-500 focus:border-mnac-accent'
                        }
                     `}
                   />
                   {isAiSearchMode ? (
                      <Sparkles size={16} className="absolute left-3 md:left-2 top-3.5 text-mnac-gold animate-pulse" />
                   ) : (
                      <Search size={16} className={`absolute left-3 md:left-0 top-3.5 group-hover:text-white transition-colors hidden md:block ${easyReading ? 'text-gray-400' : 'text-gray-600'}`} />
                   )}
                   <Search size={16} className="absolute right-4 top-3.5 text-gray-500 md:hidden" />
                 </div>
                 
                 <button 
                   onClick={() => setShowMobileFilters(!showMobileFilters)}
                   className={`md:hidden p-3 rounded-full border transition-colors ${
                       showMobileFilters 
                       ? 'bg-mnac-accent text-white border-mnac-accent' 
                       : (easyReading ? 'bg-white text-black border-gray-200' : 'bg-white/10 text-white border-white/10')
                   }`}
                 >
                    <Filter size={18} />
                 </button>
              </div>

              {/* Filters Area */}
              <div className={`${showMobileFilters ? 'flex' : 'hidden'} md:flex flex-col md:flex-row gap-4 md:items-center animate-slide-up md:animate-none`}>
                 
                 {/* Period Scroll */}
                 <div 
                   ref={periodContainerRef}
                   className={`flex overflow-x-auto pb-2 md:pb-0 gap-2 md:gap-4 no-scrollbar items-center transition-all duration-300 p-1 rounded-lg ${highlightPeriod ? 'bg-mnac-accent/20 ring-2 ring-mnac-accent' : ''}`}
                 >
                    <span className={`text-[10px] font-bold uppercase tracking-widest whitespace-nowrap mr-2 hidden md:inline ${highlightPeriod ? 'text-mnac-accent' : 'text-gray-500'}`}>Periodos:</span>
                    {periods.map(p => (
                      <button
                        key={p}
                        onClick={() => setPeriodFilter(p)}
                        className={`text-xs font-bold uppercase tracking-widest transition-all px-4 py-2 rounded-full md:rounded-none md:p-0 whitespace-nowrap ${
                          periodFilter === p 
                            ? 'bg-mnac-accent text-white md:bg-transparent md:text-mnac-accent md:border-b-2 md:border-mnac-accent' 
                            : (easyReading ? 'bg-gray-100 text-gray-500 hover:text-black' : 'bg-white/5 border border-white/10 text-gray-400 md:border-0 md:bg-transparent md:hover:text-white')
                        }`}
                      >
                        {p}
                      </button>
                    ))}
                 </div>

                 <div className={`hidden md:block w-px h-6 ${easyReading ? 'bg-gray-300' : 'bg-white/20'}`}></div>

                 {/* Artist Dropdown */}
                 <div className={`relative w-full md:w-56 group transition-all duration-300 rounded-lg ${highlightArtist ? 'ring-2 ring-mnac-accent shadow-lg scale-105' : ''}`}>
                   <select 
                      ref={artistSelectRef}
                      value={artistFilter}
                      onChange={(e) => setArtistFilter(e.target.value)}
                      className={`w-full appearance-none border rounded-lg md:rounded-none text-xs font-bold uppercase tracking-wider py-3 px-4 md:pl-8 md:pr-8 focus:outline-none focus:border-mnac-accent cursor-pointer ${
                          easyReading 
                          ? 'bg-white border-gray-200 text-gray-900 md:border-0 md:border-b md:border-gray-300'
                          : 'bg-[#1C1C1C] md:bg-transparent border-white/10 md:border-0 md:border-b md:border-white/20 text-gray-300'
                      }`}
                   >
                      <option value="All">Todos los Artistas</option>
                      {artists.filter(a => a !== 'All').map(a => <option key={a} value={a}>{a}</option>)}
                   </select>
                   <div className="absolute inset-y-0 right-4 md:right-0 flex items-center pointer-events-none">
                      <ChevronDown size={14} className="text-gray-500" />
                   </div>
                   <div className="absolute inset-y-0 left-0 hidden md:flex items-center pl-2 pointer-events-none">
                      <User size={14} className={`${highlightArtist ? 'text-mnac-accent' : 'text-gray-500'}`} />
                   </div>
                 </div>

                 <div className={`hidden md:block w-px h-6 ${easyReading ? 'bg-gray-300' : 'bg-white/20'}`}></div>

                 {/* Tags Dropdown */}
                 <div className="relative w-full md:w-56 group transition-all duration-300 rounded-lg">
                   <select 
                      ref={tagSelectRef}
                      value={tagFilter}
                      onChange={(e) => setTagFilter(e.target.value)}
                      className={`w-full appearance-none border rounded-lg md:rounded-none text-xs font-bold uppercase tracking-wider py-3 px-4 md:pl-8 md:pr-8 focus:outline-none focus:border-mnac-accent cursor-pointer ${
                          easyReading 
                          ? 'bg-white border-gray-200 text-gray-900 md:border-0 md:border-b md:border-gray-300'
                          : 'bg-[#1C1C1C] md:bg-transparent border-white/10 md:border-0 md:border-b md:border-white/20 text-gray-300'
                      }`}
                   >
                      <option value="All">Temáticas</option>
                      {tags.filter(t => t !== 'All').map(t => <option key={t} value={t}>{t}</option>)}
                   </select>
                   <div className="absolute inset-y-0 right-4 md:right-0 flex items-center pointer-events-none">
                      <ChevronDown size={14} className="text-gray-500" />
                   </div>
                   <div className="absolute inset-y-0 left-0 hidden md:flex items-center pl-2 pointer-events-none">
                      <Tag size={14} className="text-gray-500" />
                   </div>
                 </div>

              </div>
            </div>
          </div>

          {/* Virtualized Grid */}
          <div className="flex-grow min-h-[60vh]">
            {isSimulatingLoad ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                    {Array.from({ length: 8 }).map((_, idx) => (
                        <SkeletonCard key={idx} />
                    ))}
                </div>
            ) : filteredArtworks.length > 0 ? (
              <VirtuosoGrid
                useWindowScroll
                totalCount={filteredArtworks.length}
                overscan={200}
                listClassName="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-8 gap-y-12 pb-40" 
                itemContent={(index) => (
                  <div className="pb-4">
                     <ArtCard 
                       artwork={filteredArtworks[index]} 
                       isSaved={savedArtIds.includes(filteredArtworks[index].id)}
                       onToggleSave={() => onToggleSave(filteredArtworks[index].id)}
                     />
                  </div>
                )}
              />
            ) : (
               <div className="py-20 text-center font-serif italic text-2xl flex flex-col items-center animate-fade-in text-gray-500">
                  <span className="mb-2">No se encontraron obras</span>
                  <button onClick={clearFilters} className="mt-4 text-xs text-mnac-accent font-sans font-bold uppercase tracking-widest border-b border-mnac-accent pb-1">
                      Limpiar Filtros
                  </button>
               </div>
            )}
          </div>
        </div>
      </div>
      
      <Footer role={userRole} />
    </PageTransition>
  );
};

export default GalleryPage;
