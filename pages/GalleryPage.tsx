import React, { useState, useMemo, useEffect, useRef } from 'react';
import ArtCard from '../components/ArtCard';
import { UserRole } from '../types';
import { ARTWORKS_DATA } from '../data/artworks';
import { IMAGES } from '../data/images';
import {
  Search,
  ChevronDown,
  ToggleLeft,
  ToggleRight,
  SlidersHorizontal,
  Sparkles,
  User,
  Tag,
  Clock,
  MapPin,
  ArrowRight,
  BookOpen
} from 'lucide-react';
import Footer from '../components/Footer';
import { Link, useSearchParams } from 'react-router-dom';
import PageTransition from '../components/PageTransition';
import OptimizedImage from '../components/OptimizedImage';
import { hapticService } from '../services/hapticService';

interface GalleryPageProps {
  userRole: UserRole;
  easyReading: boolean;
  setEasyReading: (value: boolean) => void;
  savedArtIds: string[];
  onToggleSave: (id: string) => void;
  isHeaderVisible: boolean;
}

const PERIOD_CONTEXT: Record<string, { span: string; room: string; summary: string }> = {
  All: {
    span: 'Siglos XI – XX',
    room: 'Plantas 1 y 2 · Palau Nacional',
    summary: 'Recorrido integral por mil años de arte catalán y europeo: desde la pintura mural románica hasta las vanguardias del siglo XX.'
  },
  Románico: {
    span: 'Siglos XI – XIII',
    room: 'Planta 1 · Salas 01–06',
    summary: 'La colección de pintura mural románica más importante del mundo, rescatada de iglesias del Pirineo catalán.'
  },
  Gótico: {
    span: 'Siglos XIII – XV',
    room: 'Planta 1 · Salas 07–11',
    summary: 'Retablos monumentales, pan de oro y el auge de los talleres de la Corona de Aragón junto al realismo hispanoflamenco.'
  },
  Renacimiento: {
    span: 'Siglo XVI',
    room: 'Planta 1 · Sala 12',
    summary: 'El humanismo, el retrato veneciano y la intensidad espiritual del Manierismo de El Greco.'
  },
  Barroco: {
    span: 'Siglo XVII',
    room: 'Planta 1 · Sala 13',
    summary: 'Claroscuro, tenebrismo y realismo táctil en las obras maestras del Siglo de Oro español.'
  },
  Realismo: {
    span: 'Siglo XIX',
    room: 'Planta 2 · Sala 14',
    summary: 'Virtuosismo técnico, crónica costumbrista y preciosismo en la pintura catalana e internacional del XIX.'
  },
  Modernismo: {
    span: '1888 – 1914',
    room: 'Planta 2 · Salas 15–18',
    summary: 'La eclosión moderna de Barcelona con Ramon Casas, Santiago Rusiñol, Gaudí y Anglada Camarasa.'
  },
  Vanguardia: {
    span: '1920 – 1940',
    room: 'Planta 2 · Sala 19',
    summary: 'Ruptura con la figuración clásica, abstracción orgánica y nuevos lenguajes plásticos del siglo XX.'
  },
  Surrealismo: {
    span: '1924 – 1945',
    room: 'Planta 2 · Sala 20',
    summary: 'Exploración del inconsciente, paisajes oníricos y simbolismo más allá de la lógica racional.'
  }
};

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
  const [showExtraFilters, setShowExtraFilters] = useState(false);

  const artistSelectRef = useRef<HTMLSelectElement>(null);
  const periodContainerRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);

  const [highlightPeriod, setHighlightPeriod] = useState(false);
  const [highlightArtist, setHighlightArtist] = useState(false);

  const periods = useMemo(() => ['All', ...Array.from(new Set(ARTWORKS_DATA.map((a) => a.period)))], []);
  const artists = useMemo(() => ['All', ...Array.from(new Set(ARTWORKS_DATA.map((a) => a.artist))).sort()], []);
  const tags = useMemo(() => ['All', ...Array.from(new Set(ARTWORKS_DATA.flatMap((a) => a.tags))).sort()], []);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    const focusMode = searchParams.get('focus');
    const tagParam = searchParams.get('tag');

    if (tagParam) {
      setTagFilter(tagParam);
      setShowExtraFilters(true);
    }

    if (focusMode === 'ai') {
      setTimeout(() => searchInputRef.current?.focus(), 300);
    } else if (focusMode === 'filters') {
      setShowExtraFilters(true);
    } else if (focusMode === 'artists') {
      setShowExtraFilters(true);
      setHighlightArtist(true);
      setTimeout(() => {
        artistSelectRef.current?.focus();
        setTimeout(() => setHighlightArtist(false), 2000);
      }, 300);
    } else if (focusMode === 'periods') {
      setHighlightPeriod(true);
      periodContainerRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      setTimeout(() => setHighlightPeriod(false), 2000);
    }
  }, [searchParams]);

  const filteredArtworks = useMemo(() => {
    return ARTWORKS_DATA.filter((art) => {
      const matchesPeriod = periodFilter === 'All' || art.period === periodFilter;
      const matchesArtist = artistFilter === 'All' || art.artist === artistFilter;
      const matchesTag = tagFilter === 'All' || art.tags.includes(tagFilter);
      const searchLower = searchTerm.toLowerCase().trim();
      const matchesSearch =
        searchLower === '' ||
        art.title.toLowerCase().includes(searchLower) ||
        art.artist.toLowerCase().includes(searchLower) ||
        art.period.toLowerCase().includes(searchLower) ||
        art.description.toLowerCase().includes(searchLower);
      return matchesPeriod && matchesArtist && matchesTag && matchesSearch;
    });
  }, [periodFilter, artistFilter, tagFilter, searchTerm]);

  const activePeriodInfo = PERIOD_CONTEXT[periodFilter] || PERIOD_CONTEXT.All;
  const hasActiveFilters = periodFilter !== 'All' || artistFilter !== 'All' || tagFilter !== 'All' || searchTerm.trim() !== '';

  const clearFilters = () => {
    hapticService.light();
    setPeriodFilter('All');
    setArtistFilter('All');
    setTagFilter('All');
    setSearchTerm('');
  };

  return (
    <PageTransition className="min-h-screen bg-mnac-bg text-mnac-textPrimary flex flex-col pb-24 md:pb-0">
      {/* HERO EDITORIAL DE ARCHIVO */}
      <section className="relative w-full h-[50vh] md:h-[62vh] flex flex-col justify-end p-5 sm:p-6 md:p-12 overflow-hidden">
        <div className="absolute inset-0 z-0">
          <OptimizedImage
            src={IMAGES.visit.hero}
            alt="Colección Permanente MNAC"
            priority={true}
            aspectRatio="h-full w-full"
            className="opacity-65 scale-105 animate-scale-slow"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-mnac-bg via-mnac-bg/45 to-transparent" />
        </div>

        <div className="relative z-10 max-w-[1920px] w-full mx-auto animate-slide-up">
          <div className="flex flex-col md:flex-row md:justify-between md:items-end border-b border-mnac-divider pb-6 md:pb-8 gap-5">
            <div>
              <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full bg-black/40 backdrop-blur-md border border-white/10 mb-3">
                <span className="w-1.5 h-1.5 rounded-full bg-mnac-accent" />
                <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-mnac-textPrimary">
                  Archivo Permanente · {ARTWORKS_DATA.length} Obras
                </span>
              </div>
              <h1 className="text-4xl sm:text-6xl md:text-8xl font-serif italic leading-none mb-1.5 tracking-tight text-white">
                {easyReading ? 'Explorar Arte' : 'La Colección'}
              </h1>
              <h2 className="text-3xl sm:text-5xl md:text-7xl font-sans font-light leading-none tracking-tighter text-mnac-textPrimary">
                Mil años de historia
              </h2>
            </div>

            {/* Easy Reading Toggle (Preserves Dark Editorial Theme) */}
            <button
              type="button"
              onClick={() => {
                hapticService.light();
                setEasyReading(!easyReading);
              }}
              className="inline-flex items-center justify-between md:justify-center gap-3 px-5 py-3 rounded-full bg-mnac-surface/90 backdrop-blur-md border border-white/15 text-xs font-bold uppercase tracking-widest text-white active:scale-95 transition-all self-start md:self-auto"
            >
              <span className="flex items-center gap-2">
                <BookOpen size={14} className="text-mnac-accent" /> Lectura Fácil
              </span>
              {easyReading ? (
                <ToggleRight size={24} className="text-mnac-accent" />
              ) : (
                <ToggleLeft size={24} className="text-mnac-textSecondary" />
              )}
            </button>
          </div>

          <div className="flex justify-between items-center pt-4 text-[10px] font-bold uppercase tracking-widest text-mnac-textSecondary">
            <span>Catálogo curatorial y fichas técnicas</span>
            <Link
              to="/tours"
              onClick={() => hapticService.light()}
              className="hover:text-white active:scale-95 transition-all flex items-center gap-1"
            >
              Ver Itinerarios <ArrowRight size={12} />
            </Link>
          </div>
        </div>
      </section>

      {/* MAIN CONTENT */}
      <div id="main-content" className="flex-grow max-w-[1920px] mx-auto px-5 sm:px-6 md:px-12 py-6 md:py-10 w-full focus:outline-none" tabIndex={-1}>
        
        {/* CONSULTATION TOOLS & SEARCH BAR */}
        <div
          className={`sticky z-30 py-3 -mx-5 px-5 sm:-mx-6 sm:px-6 md:mx-0 md:px-0 mb-6 bg-mnac-bg/95 backdrop-blur-md border-b border-white/10 transition-all duration-300 ${
            isHeaderVisible ? 'top-16 md:top-20' : 'top-0'
          }`}
        >
          <div className="space-y-3.5">
            {/* Search + Secondary Filter Toggle */}
            <div className="flex gap-2.5">
              <div className="relative flex-grow">
                <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-mnac-accent pointer-events-none" />
                <input
                  ref={searchInputRef}
                  type="text"
                  placeholder={easyReading ? 'Buscar obras o artistas...' : 'Buscar por obra, artista, época o tema...'}
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full bg-mnac-surface border border-white/10 rounded-2xl py-3.5 pl-11 pr-4 text-xs sm:text-sm text-white placeholder-mnac-textSecondary/60 focus:outline-none focus:border-mnac-accent transition-colors"
                />
              </div>

              <button
                type="button"
                onClick={() => {
                  hapticService.light();
                  setShowExtraFilters(!showExtraFilters);
                }}
                aria-label="Filtros avanzados"
                className={`px-4 rounded-2xl border flex items-center gap-2 text-xs font-bold uppercase tracking-wider active:scale-95 transition-all shrink-0 ${
                  showExtraFilters || artistFilter !== 'All' || tagFilter !== 'All'
                    ? 'bg-mnac-accent text-white border-mnac-accent'
                    : 'bg-mnac-surface text-mnac-textPrimary border-white/10 hover:border-white/25'
                }`}
              >
                <SlidersHorizontal size={16} />
                <span className="hidden sm:inline">Filtros</span>
              </button>
            </div>

            {/* Always-Visible Horizontal Period Pills */}
            <div
              ref={periodContainerRef}
              className={`flex gap-2 overflow-x-auto no-scrollbar pb-1 ${
                highlightPeriod ? 'ring-2 ring-mnac-accent rounded-full p-1' : ''
              }`}
            >
              {periods.map((p) => (
                <button
                  key={p}
                  onClick={() => {
                    hapticService.light();
                    setPeriodFilter(p);
                  }}
                  className={`shrink-0 px-4 py-2 rounded-full text-[10px] font-bold uppercase tracking-widest border active:scale-95 transition-all ${
                    periodFilter === p
                      ? 'bg-mnac-accent text-white border-mnac-accent shadow-lg'
                      : 'bg-mnac-surface text-mnac-textSecondary border-white/10 hover:border-white/25 hover:text-white'
                  }`}
                >
                  {p === 'All' ? 'Todos' : p}
                </button>
              ))}
            </div>

            {/* Collapsible Artist & Tag Filters */}
            {showExtraFilters && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1 animate-fade-in">
                <div className={`relative ${highlightArtist ? 'ring-2 ring-mnac-accent rounded-2xl' : ''}`}>
                  <User size={14} className="absolute left-4 top-1/2 -translate-y-1/2 text-mnac-textSecondary pointer-events-none" />
                  <select
                    ref={artistSelectRef}
                    value={artistFilter}
                    onChange={(e) => setArtistFilter(e.target.value)}
                    className="w-full appearance-none bg-mnac-surface border border-white/10 rounded-2xl py-3 pl-10 pr-9 text-xs font-bold uppercase tracking-wider text-white focus:outline-none focus:border-mnac-accent"
                  >
                    <option value="All">Todos los Artistas</option>
                    {artists.filter((a) => a !== 'All').map((a) => (
                      <option key={a} value={a}>{a}</option>
                    ))}
                  </select>
                  <ChevronDown size={14} className="absolute right-4 top-1/2 -translate-y-1/2 text-mnac-textSecondary pointer-events-none" />
                </div>

                <div className="relative">
                  <Tag size={14} className="absolute left-4 top-1/2 -translate-y-1/2 text-mnac-textSecondary pointer-events-none" />
                  <select
                    value={tagFilter}
                    onChange={(e) => setTagFilter(e.target.value)}
                    className="w-full appearance-none bg-mnac-surface border border-white/10 rounded-2xl py-3 pl-10 pr-9 text-xs font-bold uppercase tracking-wider text-white focus:outline-none focus:border-mnac-accent"
                  >
                    <option value="All">Todas las Temáticas</option>
                    {tags.filter((t) => t !== 'All').map((t) => (
                      <option key={t} value={t}>{t}</option>
                    ))}
                  </select>
                  <ChevronDown size={14} className="absolute right-4 top-1/2 -translate-y-1/2 text-mnac-textSecondary pointer-events-none" />
                </div>
              </div>
            )}
          </div>
        </div>

        {/* DYNAMIC PERIOD CURATORIAL CONTEXT + QUICK REFERENCE LINKS */}
        <div className="mb-8 space-y-4">
          <div key={periodFilter} className="p-5 sm:p-6 rounded-2xl bg-mnac-surface border border-white/10 animate-crossfade">
            <div className="flex flex-wrap items-center justify-between gap-2 mb-2.5">
              <div className="flex items-center gap-2.5">
                <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-mnac-accent">
                  {periodFilter === 'All' ? 'Visión General' : periodFilter}
                </span>
                <span className="text-white/20">·</span>
                <span className="text-[11px] font-mono text-mnac-secondary flex items-center gap-1">
                  <Clock size={12} /> {activePeriodInfo.span}
                </span>
              </div>
              <Link
                to="/visit/map"
                onClick={() => hapticService.light()}
                className="text-[10px] font-bold uppercase tracking-wider text-mnac-textSecondary hover:text-white flex items-center gap-1"
              >
                <MapPin size={12} className="text-mnac-accent" /> {activePeriodInfo.room}
              </Link>
            </div>
            <p className={`text-mnac-textPrimary/90 font-light leading-relaxed ${easyReading ? 'text-base' : 'text-xs sm:text-sm'}`}>
              {activePeriodInfo.summary}
            </p>
          </div>

          {/* Quick Reference Bar: Timeline & Authors + Results Count */}
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <Link
                to="/tours/timeline"
                onClick={() => hapticService.light()}
                className="px-3.5 py-2 rounded-full bg-mnac-surface border border-white/10 text-[10px] font-bold uppercase tracking-wider text-mnac-textPrimary hover:border-white/25 active:scale-95 transition-all"
              >
                Línea de Tiempo →
              </Link>
              <Link
                to="/tours/authors"
                onClick={() => hapticService.light()}
                className="px-3.5 py-2 rounded-full bg-mnac-surface border border-white/10 text-[10px] font-bold uppercase tracking-wider text-mnac-textPrimary hover:border-white/25 active:scale-95 transition-all"
              >
                Índice de Autores →
              </Link>
            </div>
            <div className="flex items-center gap-3 text-[11px] text-mnac-textSecondary font-medium">
              <span>{filteredArtworks.length} {filteredArtworks.length === 1 ? 'obra' : 'obras'}</span>
              {hasActiveFilters && (
                <button
                  onClick={clearFilters}
                  className="text-mnac-accent font-bold uppercase tracking-wider text-[10px]"
                >
                  Limpiar
                </button>
              )}
            </div>
          </div>
        </div>

        {/* CURATORIAL ARTWORKS GRID (2 COLS ON MOBILE, 4 ON DESKTOP) */}
        {filteredArtworks.length > 0 ? (
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3.5 sm:gap-6 pb-12">
            {filteredArtworks.map((artwork, idx) => {
              const staggerDelays = [0, 35, 65, 90, 110, 125];
              const delay = idx < staggerDelays.length ? staggerDelays[idx] : 140;
              return (
                <div key={artwork.id} className="animate-stagger" style={{ animationDelay: `${delay}ms` }}>
                  <ArtCard
                    artwork={artwork}
                    isSaved={savedArtIds.includes(artwork.id)}
                    onToggleSave={() => onToggleSave(artwork.id)}
                  />
                </div>
              );
            })}
          </div>
        ) : (
          <div className="py-16 px-6 rounded-2xl bg-mnac-surface border border-white/10 text-center flex flex-col items-center animate-fade-in">
            <span className="font-serif italic text-2xl sm:text-3xl text-white mb-2">
              No se encontraron obras
            </span>
            <p className="text-xs sm:text-sm text-mnac-textSecondary max-w-md mb-6">
              Prueba ajustando los filtros o pregúntale directamente a Palau IA sobre lo que estás buscando.
            </p>
            <div className="flex flex-wrap justify-center gap-3">
              <button
                onClick={clearFilters}
                className="px-6 py-3 rounded-full bg-mnac-accent text-white text-xs font-bold uppercase tracking-widest active:scale-95 transition-transform"
              >
                Limpiar Filtros
              </button>
              <Link
                to="/collection/ai-search"
                onClick={() => hapticService.light()}
                className="px-6 py-3 rounded-full bg-mnac-bg border border-white/15 text-white text-xs font-bold uppercase tracking-widest flex items-center gap-2 active:scale-95 transition-transform"
              >
                <Sparkles size={14} className="text-mnac-accent" /> Preguntar a Palau IA
              </Link>
            </div>
          </div>
        )}
      </div>

      <Footer role={userRole} />
    </PageTransition>
  );
};

export default GalleryPage;
