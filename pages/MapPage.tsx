import React, { useState, useMemo, useEffect } from 'react';
import { UserRole } from '../types';
import {
  ZoomIn,
  ZoomOut,
  MapPin,
  X,
  Layers,
  Navigation,
  Search,
  LocateFixed,
  ArrowRight,
  Clock,
  Sparkles,
  Accessibility,
  Coffee,
  Compass,
  DoorOpen,
  Info
} from 'lucide-react';
import OptimizedImage from '../components/OptimizedImage';
import { Link } from 'react-router-dom';
import HairlineMuseumMap, { MuseumPoint, PointCategory } from '../components/HairlineMuseumMap';
import { hapticService } from '../services/hapticService';

interface MapPageProps {
  userRole: UserRole;
}

const MUSEUM_POINTS: MuseumPoint[] = [
  // PLANTA 0 · PLANTA BAJA (VESTÍBULO + MEDIEVAL + RENACIMIENTO Y BARROCO + SALA OVAL)
  {
    id: 'p0-entrance',
    level: 0,
    category: 'service',
    roomCode: 'P0 · Acceso Norte',
    wing: 'Centro',
    title: 'Entrada / Salida Principal',
    subtitle: 'Fachada Plaça d’Espanya',
    desc: 'Acceso principal desde la escalinata y fuentes de Montjuïc. Conecta directo con taquillas, consigna y Sala Oval.',
    directions: ['Fachada Norte del Palau Nacional', 'Acceso directo hacia las escaleras mecánicas de bajada a Plaça d’Espanya'],
    walkTime: 'Acceso',
    x: 0,
    y: 40
  },
  {
    id: 'p0-tickets',
    level: 0,
    category: 'service',
    roomCode: 'P0 · Vestíbulo',
    wing: 'Centro',
    title: 'Taquillas e Información',
    subtitle: 'Venta y Audioguías',
    desc: 'Venta presencial de entradas, recogida de audioguías, planos en papel y atención al visitante.',
    directions: ['Nada más cruzar la Entrada Norte, gira a la derecha en el Vestíbulo'],
    walkTime: '1 min',
    x: 24,
    y: 28
  },
  {
    id: 'p0-cloakroom',
    level: 0,
    category: 'service',
    roomCode: 'P0 · Vestíbulo',
    wing: 'Centro',
    title: 'Consigna y Baños P0',
    subtitle: 'Servicio Gratuito',
    desc: 'Guarda mochilas, paraguas y maletas antes de entrar a las galerías. Aseos generales junto a consigna.',
    directions: ['En el Vestíbulo Principal, lado izquierdo (Ala Oeste)'],
    walkTime: '1 min',
    x: -24,
    y: 28
  },
  {
    id: 'p0-romanesque',
    level: 0,
    category: 'art',
    roomCode: 'P0 · Salas 01–17',
    wing: 'Ala Oeste',
    title: 'Arte Románico (Taüll)',
    subtitle: 'Pintura Mural s. XI–XIII',
    desc: 'La colección de frescos románicos más importante del mundo, presidida por el Pantocrátor de Sant Climent de Taüll.',
    directions: ['Desde el Vestíbulo, entra al Ala Oeste (izquierda)', 'Recorre las capillas oscurecidas de las salas 01 a 17'],
    walkTime: '2 min',
    x: -52,
    y: 12,
    artworkId: 'art-0',
    tourFilter: 'Románico',
    image: '/artworks/art-0.jpg'
  },
  {
    id: 'p0-gothic',
    level: 0,
    category: 'art',
    roomCode: 'P0 · Salas 18–34',
    wing: 'Ala Oeste',
    title: 'Arte Gótico y Retablos',
    subtitle: 'Huguet · Bermejo · Martorell',
    desc: 'Retablos monumentales de oro y temple de la Corona de Aragón y realismo hispanoflamenco.',
    directions: ['Continúa por el Ala Oeste tras las salas del Románico', 'Salas 18 a 34 hacia la parte posterior del edificio'],
    walkTime: '3 min',
    x: -50,
    y: -18,
    artworkId: 'art-3',
    tourFilter: 'Gótico',
    image: '/artworks/art-3.jpg'
  },
  {
    id: 'p0-oval',
    level: 0,
    category: 'service',
    roomCode: 'P0 · Centro',
    wing: 'Centro',
    title: 'Gran Sala Oval',
    subtitle: 'Eje Central del Palacio',
    desc: 'El gran espacio monumental bajo la cúpula central que articula las alas Oeste y Este y el acceso a exposiciones.',
    directions: ['Cruza el Vestíbulo Principal recto hacia el sur'],
    walkTime: '1 min',
    x: 0,
    y: 0
  },
  {
    id: 'p0-renaissance',
    level: 0,
    category: 'art',
    roomCode: 'P0 · Salas 35–45',
    wing: 'Ala Este',
    title: 'Renacimiento & El Greco',
    subtitle: 'Siglo XVI · Colección Cambó',
    desc: 'Diálogo entre el humanismo europeo, el retrato y la espiritualidad intensa de El Greco.',
    directions: ['Desde el Vestíbulo o Sala Oval, entra al Ala Este (derecha)', 'Primeras galerías de la sala 35 en adelante'],
    walkTime: '2 min',
    x: 50,
    y: 14,
    artworkId: 'art-8',
    tourFilter: 'Renacimiento',
    image: '/artworks/art-8.jpg'
  },
  {
    id: 'p0-baroque',
    level: 0,
    category: 'art',
    roomCode: 'P0 · Salas 46–55',
    wing: 'Ala Este',
    title: 'Barroco & Zurbarán',
    subtitle: 'Claroscuro s. XVII',
    desc: 'Tenebrismo español, bodegones místicos y grandes lienzos del Siglo de Oro.',
    directions: ['Avanza por el Ala Este tras las salas del Renacimiento'],
    walkTime: '3 min',
    x: 52,
    y: -16,
    artworkId: 'art-5',
    image: '/artworks/art-5.jpg'
  },
  {
    id: 'p0-shop',
    level: 0,
    category: 'service',
    roomCode: 'P0 · Salida Este',
    wing: 'Ala Este',
    title: 'Tienda Laie & Cafetería P0',
    subtitle: 'Libros, Diseño y Café',
    desc: 'Catálogos de arte, láminas, objetos modernistas y zona de descanso junto al patio este.',
    directions: ['Junto a la salida del Ala Este y conexión con el vestíbulo'],
    walkTime: '2 min',
    x: 28,
    y: -18
  },
  {
    id: 'p0-access',
    level: 0,
    category: 'accessibility',
    roomCode: 'P0 · Accesibilidad',
    wing: 'Centro',
    title: 'Ascensor & Sillas de Ruedas',
    subtitle: 'Núcleo Central sin Barreras',
    desc: 'Ascensor panorámico directo a Planta 1, baños adaptados, cambiador y préstamo gratuito de sillas.',
    directions: ['Borde norte de la Sala Oval, junto al punto de información'],
    walkTime: '1 min',
    x: -14,
    y: 10
  },

  // PLANTA 1 · PRIMER PIS (ARTE MODERNO + CÚPULA + MIRADOR)
  {
    id: 'p1-modernism',
    level: 1,
    category: 'art',
    roomCode: 'P1 · Ala Oeste',
    wing: 'Ala Oeste',
    title: 'Modernismo & Ramon Casas',
    subtitle: 'Barcelona 1900 · Gaudí',
    desc: 'Casas, Rusiñol, Nonell y mobiliario de Gaudí. La explosión creativa de la Barcelona modernista.',
    directions: ['Sube a la Planta 1 por la escalera central o ascensor', 'Gira a la izquierda hacia las salas del Ala Oeste'],
    walkTime: '3 min',
    x: -50,
    y: 10,
    artworkId: 'art-1',
    tourFilter: 'Modernismo',
    image: '/artworks/art-1.jpg'
  },
  {
    id: 'p1-sculpture',
    level: 1,
    category: 'art',
    roomCode: 'P1 · Ala Oeste',
    wing: 'Ala Oeste',
    title: 'Escultura Simbolista',
    subtitle: 'Josep Llimona · Desconsol',
    desc: 'Mármoles modernistas y expresividad íntima del cambio de siglo catalán.',
    directions: ['En el Ala Oeste de Planta 1, galería sur de escultura'],
    walkTime: '3 min',
    x: -48,
    y: -18,
    artworkId: 'art-11',
    image: '/artworks/art-11.jpg'
  },
  {
    id: 'p1-cupula',
    level: 1,
    category: 'service',
    roomCode: 'P1 · Centro Norte',
    wing: 'Centro',
    title: 'Sala de la Cúpula & Òleum',
    subtitle: 'Salón del Trono y Restaurante',
    desc: 'Antiguo Salón del Trono con pinturas murales y vistas directas hacia Plaça d’Espanya y las fuentes.',
    directions: ['Al llegar a Planta 1 por la escalinata, avanza hacia la fachada norte'],
    walkTime: '2 min',
    x: 0,
    y: 26
  },
  {
    id: 'p1-realism',
    level: 1,
    category: 'art',
    roomCode: 'P1 · Ala Este',
    wing: 'Ala Este',
    title: 'Realismo & Vanguardias',
    subtitle: 'Fortuny · Picasso · Dalí',
    desc: 'Desde el preciosismo de La Vicaría y La Carga hasta el arte de entreguerras y vanguardias del XX.',
    directions: ['Desde el centro de Planta 1, dirígete al Ala Este (derecha)'],
    walkTime: '3 min',
    x: 50,
    y: 8,
    artworkId: 'art-4',
    image: '/artworks/art-4.jpg'
  },
  {
    id: 'p1-terrace',
    level: 1,
    category: 'service',
    roomCode: 'P1 · Mirador Exterior',
    wing: 'Centro',
    title: 'Acceso Terrazas Mirador 360°',
    subtitle: 'Vistas Panorámicas a Barcelona',
    desc: 'Salida hacia las terrazas superiores con vistas de 360 grados sobre Montjuïc y toda la ciudad.',
    directions: ['Desde la Sala de la Cúpula (Norte), sigue la señalización exterior a Terrazas'],
    walkTime: '2 min',
    x: 0,
    y: -14
  },
  {
    id: 'p1-access',
    level: 1,
    category: 'accessibility',
    roomCode: 'P1 · Accesibilidad',
    wing: 'Centro',
    title: 'Ascensor, Rampas y Baños P1',
    subtitle: 'Ruta Sin Escaleras',
    desc: 'Conexión continua por rampa entre el Ala Oeste, Sala de la Cúpula, Ala Este y Terrazas.',
    directions: ['Núcleo central junto al hall de llegada del ascensor'],
    walkTime: '1 min',
    x: 16,
    y: 12
  }
];

const LEVEL_INFO: Record<0 | 1, { short: string; title: string }> = {
  0: { short: 'P0 · Baja', title: 'Planta 0 · Vestíbulo & Medieval' },
  1: { short: 'P1 · Superior', title: 'Planta 1 · Moderno & Mirador' }
};

const CATEGORY_FILTERS: { id: 'all' | PointCategory; label: string }[] = [
  { id: 'all', label: 'Todo' },
  { id: 'art', label: 'Salas de Arte' },
  { id: 'service', label: 'Servicios' },
  { id: 'accessibility', label: 'Accesibilidad' }
];

const MapPage: React.FC<MapPageProps> = () => {
  const [activeLevel, setActiveLevel] = useState<0 | 1>(0);
  const [explodedView, setExplodedView] = useState(false);
  const [categoryFilter, setCategoryFilter] = useState<'all' | PointCategory>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRoomId, setSelectedRoomId] = useState<string | null>('p0-romanesque');
  const [showRoute, setShowRoute] = useState(false);
  const [showStructureGuide, setShowStructureGuide] = useState(false);
  const [scale, setScale] = useState(1);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [cardDragY, setCardDragY] = useState(0);
  const [isDraggingCard, setIsDraggingCard] = useState(false);
  const cardDragRef = React.useRef<{ startY: number; startTime: number }>({ startY: 0, startTime: 0 });

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const filteredPoints = useMemo(() => {
    const q = searchQuery.toLowerCase().trim();
    return MUSEUM_POINTS.filter((pt) => {
      const matchesCat = categoryFilter === 'all' || pt.category === categoryFilter;
      const matchesSearch =
        !q ||
        pt.title.toLowerCase().includes(q) ||
        pt.subtitle.toLowerCase().includes(q) ||
        pt.roomCode.toLowerCase().includes(q) ||
        pt.wing.toLowerCase().includes(q) ||
        pt.desc.toLowerCase().includes(q);
      return matchesCat && matchesSearch;
    });
  }, [categoryFilter, searchQuery]);

  const currentFloorPoints = useMemo(
    () => filteredPoints.filter((pt) => pt.level === activeLevel),
    [filteredPoints, activeLevel]
  );

  const selectedRoom = MUSEUM_POINTS.find((p) => p.id === selectedRoomId) || null;

  const handleSelectPoint = (id: string) => {
    hapticService.light();
    const target = MUSEUM_POINTS.find((p) => p.id === id);
    if (target && target.level !== activeLevel) {
      setActiveLevel(target.level);
    }
    setSelectedRoomId(id);
    setShowRoute(false);
  };

  const handleResetView = () => {
    hapticService.light();
    setScale(1);
    setPan({ x: 0, y: 0 });
  };

  const handleSearchChange = (val: string) => {
    setSearchQuery(val);
    const q = val.toLowerCase().trim();
    if (q.length >= 2) {
      const firstMatch = MUSEUM_POINTS.find(
        (pt) =>
          pt.title.toLowerCase().includes(q) ||
          pt.subtitle.toLowerCase().includes(q) ||
          pt.desc.toLowerCase().includes(q)
      );
      if (firstMatch) {
        setActiveLevel(firstMatch.level);
        setSelectedRoomId(firstMatch.id);
      }
    }
  };

  return (
    <div className="h-[100dvh] w-full bg-mnac-bg relative overflow-hidden flex flex-col font-sans text-mnac-textPrimary">
      {/* --- HAIRLINE ISOMETRIC CANVAS --- */}
      <div className="absolute inset-0 pt-28 pb-36">
        <HairlineMuseumMap
          points={filteredPoints}
          activeLevel={activeLevel}
          explodedView={explodedView}
          selectedId={selectedRoomId}
          onSelectPoint={handleSelectPoint}
          scale={scale}
          onScaleChange={setScale}
          pan={pan}
          onPanChange={setPan}
          showRoute={showRoute}
        />
      </div>

      {/* --- TOP HUD: TITLE, COMPASS/NORTH, STRUCTURE INFO, SEARCH & PILLS --- */}
      <div className="relative z-20 pt-24 md:pt-28 px-4 sm:px-6 pointer-events-none">
        <div className="max-w-5xl mx-auto space-y-3 pointer-events-auto">
          <div className="flex items-start justify-between gap-3">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="w-2 h-2 rounded-full bg-mnac-accent" />
                <span className="text-[11px] font-bold uppercase tracking-[0.18em] text-mnac-textSecondary">
                  {LEVEL_INFO[activeLevel].title}
                </span>
              </div>
              <h1 className="font-serif italic text-3xl sm:text-4xl text-white leading-none tracking-tight">
                Mapa del Museo
              </h1>
            </div>

            {/* Compass & Structure Guide Toggle */}
            <div className="flex items-center gap-2 shrink-0">
              <div className="hidden sm:flex items-center gap-1.5 px-3 py-2 rounded-full bg-mnac-surface/90 backdrop-blur-md border border-white/10 text-[11px] font-semibold text-mnac-secondary">
                <Compass size={14} className="text-mnac-accent" />
                <span>N ↑ Plaça d’Espanya</span>
              </div>
              <button
                onClick={() => {
                  hapticService.light();
                  setShowStructureGuide(!showStructureGuide);
                }}
                aria-label="Estructura y salidas del museo"
                className={`h-11 px-3.5 rounded-full border backdrop-blur-md flex items-center gap-2 text-xs font-bold active:scale-95 transition-all ${
                  showStructureGuide
                    ? 'bg-mnac-accent text-white border-mnac-accent'
                    : 'bg-mnac-surface/90 text-white border-white/15'
                }`}
              >
                <Info size={16} />
                <span className="hidden sm:inline">Estructura</span>
              </button>
            </div>
          </div>

          {/* Expandable Museum Orientation & Exits Legend */}
          {showStructureGuide && (
            <div className="p-4 rounded-2xl bg-mnac-surface/95 backdrop-blur-xl border border-white/15 shadow-2xl space-y-2.5 text-xs animate-fade-in">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold uppercase tracking-widest text-mnac-accent">
                  Cómo orientarte en el Palau Nacional
                </span>
                <button
                  onClick={() => setShowStructureGuide(false)}
                  className="text-mnac-textSecondary hover:text-white p-1"
                >
                  <X size={15} />
                </button>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 text-[11px]">
                <div className="p-2.5 rounded-xl bg-mnac-bg/80 border border-white/5 flex items-start gap-2">
                  <Compass size={14} className="text-mnac-accent shrink-0 mt-0.5" />
                  <div>
                    <p className="font-semibold text-white">Norte (Fachada)</p>
                    <p className="text-mnac-textSecondary">Mirando a Plaça d’Espanya y Montjuïc</p>
                  </div>
                </div>
                <div className="p-2.5 rounded-xl bg-mnac-bg/80 border border-white/5 flex items-start gap-2">
                  <DoorOpen size={14} className="text-emerald-400 shrink-0 mt-0.5" />
                  <div>
                    <p className="font-semibold text-white">Entradas y Salidas</p>
                    <p className="text-mnac-textSecondary">P0 Centro Norte · Vestíbulo Principal</p>
                  </div>
                </div>
                <div className="p-2.5 rounded-xl bg-mnac-bg/80 border border-white/5 flex items-start gap-2">
                  <Layers size={14} className="text-mnac-secondary shrink-0 mt-0.5" />
                  <div>
                    <p className="font-semibold text-white">Alas del Palacio</p>
                    <p className="text-mnac-textSecondary">Oeste: Románico/Gótico · Este: Renac./Barroco</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Search Bar */}
          <div className="relative">
            <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-mnac-accent pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => handleSearchChange(e.target.value)}
              placeholder="Buscar sala, salida, baños, taquilla, ascensor..."
              className="w-full h-11 bg-mnac-surface/90 backdrop-blur-xl border border-white/10 rounded-full pl-11 pr-10 text-xs sm:text-sm text-white placeholder-mnac-textSecondary/60 focus:outline-none focus:border-mnac-accent shadow-lg"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-mnac-textSecondary hover:text-white p-1"
              >
                <X size={16} />
              </button>
            )}
          </div>

          {/* Category Filter Pills */}
          <div className="flex gap-2 overflow-x-auto no-scrollbar pb-0.5">
            {CATEGORY_FILTERS.map((cat) => (
              <button
                key={cat.id}
                onClick={() => {
                  hapticService.light();
                  setCategoryFilter(cat.id);
                }}
                className={`shrink-0 px-4 py-2 rounded-full text-[11px] font-bold uppercase tracking-wider border active:scale-95 transition-all ${
                  categoryFilter === cat.id
                    ? 'bg-mnac-accent text-white border-mnac-accent'
                    : 'bg-mnac-surface/85 backdrop-blur-md text-mnac-textSecondary border-white/10 hover:text-white'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>

          {/* Quick-Jump Chips for Current Floor */}
          {currentFloorPoints.length > 0 && (
            <div className="flex gap-2 overflow-x-auto no-scrollbar">
              {currentFloorPoints.map((pt) => {
                const active = selectedRoomId === pt.id;
                return (
                  <button
                    key={pt.id}
                    onClick={() => handleSelectPoint(pt.id)}
                    className={`shrink-0 px-3.5 py-2 rounded-full text-[11px] font-medium border active:scale-95 transition-all flex items-center gap-1.5 ${
                      active
                        ? 'bg-white text-black border-white font-bold'
                        : 'bg-black/50 backdrop-blur-md text-mnac-textPrimary border-white/15'
                    }`}
                  >
                    {pt.category === 'accessibility' && <Accessibility size={13} className={active ? 'text-black' : 'text-emerald-400'} />}
                    {pt.category === 'service' && <Coffee size={13} className={active ? 'text-black' : 'text-mnac-secondary'} />}
                    {pt.category === 'art' && <Sparkles size={13} className={active ? 'text-black' : 'text-mnac-accent'} />}
                    <span>{pt.title}</span>
                  </button>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* --- MOBILE RIGHT VERTICAL RAIL (ZOOM, 3D, RECENTER) --- */}
      {!selectedRoom && (
        <div className="fixed right-3 bottom-36 z-20 flex md:hidden flex-col items-center gap-1 bg-mnac-surface/95 backdrop-blur-xl shadow-2xl rounded-full p-1.5 border border-white/15">
          <button
            onClick={() => {
              hapticService.light();
              setExplodedView(!explodedView);
            }}
            aria-label="Vista 3D por plantas"
            className={`w-10 h-10 rounded-full flex items-center justify-center active:scale-90 transition-all ${
              explodedView ? 'bg-mnac-accent/25 text-mnac-accent' : 'text-mnac-textSecondary hover:text-white'
            }`}
          >
            <Layers size={18} />
          </button>
          <button
            onClick={() => {
              hapticService.light();
              setScale((prev) => Math.min(3, Number((prev + 0.3).toFixed(2))));
            }}
            aria-label="Acercar"
            className="w-10 h-10 rounded-full flex items-center justify-center text-mnac-textSecondary hover:text-white active:scale-90 transition-all"
          >
            <ZoomIn size={18} />
          </button>
          <button
            onClick={() => {
              hapticService.light();
              setScale((prev) => Math.max(0.75, Number((prev - 0.3).toFixed(2))));
            }}
            aria-label="Alejar"
            className="w-10 h-10 rounded-full flex items-center justify-center text-mnac-textSecondary hover:text-white active:scale-90 transition-all"
          >
            <ZoomOut size={18} />
          </button>
          <button
            onClick={handleResetView}
            aria-label="Centrar mapa"
            className="w-10 h-10 rounded-full flex items-center justify-center text-mnac-textSecondary hover:text-white active:scale-90 transition-all"
          >
            <LocateFixed size={18} />
          </button>
        </div>
      )}

      {/* --- FLOOR SWITCHER (MOBILE: COMPACT PILL CLEAR OF DOCK; DESKTOP: FULL CONTROLS) --- */}
      <div
        className={`fixed left-1/2 -translate-x-1/2 z-20 items-center gap-2 bg-mnac-surface/95 backdrop-blur-xl shadow-2xl rounded-full p-1.5 border border-white/15 bottom-36 md:bottom-8 transition-all ${
          selectedRoom ? 'hidden md:flex' : 'flex'
        }`}
      >
        {/* 2-Level MNAC Switcher with Sliding Pill */}
        <div className="relative grid grid-cols-2 bg-mnac-bg rounded-full p-1 gap-1">
          <div
            aria-hidden="true"
            className="absolute top-1 bottom-1 left-1 w-[calc(50%-0.25rem)] rounded-full bg-mnac-accent shadow transition-transform duration-200 ease-[cubic-bezier(0.23,1,0.32,1)] pointer-events-none"
            style={{
              transform: activeLevel === 0 ? 'translateX(0%)' : 'translateX(100%)'
            }}
          />
          {([0, 1] as const).map((lvl) => (
            <button
              key={lvl}
              onClick={() => {
                hapticService.light();
                setActiveLevel(lvl);
              }}
              className={`relative z-10 min-h-[40px] px-4 rounded-full text-xs font-bold transition-colors duration-150 active:scale-95 whitespace-nowrap ${
                activeLevel === lvl
                  ? 'text-white'
                  : 'text-mnac-textSecondary hover:text-white'
              }`}
            >
              {LEVEL_INFO[lvl].short}
            </button>
          ))}
        </div>

        {/* Desktop-only inline Zoom/3D/Center controls */}
        <div className="hidden md:flex items-center gap-1.5">
          <div className="w-px h-6 bg-white/15 mx-1" />
          <button
            onClick={() => {
              hapticService.light();
              setExplodedView(!explodedView);
            }}
            aria-label="Vista 3D por plantas"
            title="Separar plantas en 3D"
            className={`w-11 h-11 rounded-full flex items-center justify-center active:scale-90 transition-all ${
              explodedView ? 'bg-mnac-accent/25 text-mnac-accent' : 'text-mnac-textSecondary hover:text-white'
            }`}
          >
            <Layers size={19} />
          </button>
          <button
            onClick={() => {
              hapticService.light();
              setScale((prev) => Math.max(0.75, Number((prev - 0.3).toFixed(2))));
            }}
            aria-label="Alejar"
            className="w-11 h-11 rounded-full flex items-center justify-center text-mnac-textSecondary hover:text-white active:scale-90 transition-all"
          >
            <ZoomOut size={19} />
          </button>
          <button
            onClick={() => {
              hapticService.light();
              setScale((prev) => Math.min(3, Number((prev + 0.3).toFixed(2))));
            }}
            aria-label="Acercar"
            className="w-11 h-11 rounded-full flex items-center justify-center text-mnac-textSecondary hover:text-white active:scale-90 transition-all"
          >
            <ZoomIn size={19} />
          </button>
          <button
            onClick={handleResetView}
            aria-label="Centrar mapa"
            className="w-11 h-11 rounded-full flex items-center justify-center text-mnac-textSecondary hover:text-white active:scale-90 transition-all"
          >
            <LocateFixed size={19} />
          </button>
        </div>
      </div>

      {/* --- ROOM DETAIL CARD (1:1 SWIPE-TO-DISMISS + FLOATS ABOVE DOCK) --- */}
      <div
        onTouchStart={(e) => {
          if ((e.target as HTMLElement).closest('button, a')) return;
          setIsDraggingCard(true);
          cardDragRef.current = { startY: e.touches[0].clientY, startTime: performance.now() };
        }}
        onTouchMove={(e) => {
          if (!isDraggingCard) return;
          const dy = e.touches[0].clientY - cardDragRef.current.startY;
          // Elastic resistance when pulling up, 1:1 tracking when pulling down
          setCardDragY(dy < 0 ? dy * 0.18 : dy);
        }}
        onTouchEnd={() => {
          if (!isDraggingCard) return;
          setIsDraggingCard(false);
          const elapsed = Math.max(performance.now() - cardDragRef.current.startTime, 1);
          const velocity = (cardDragY / elapsed) * 1000;
          if (cardDragY > 75 || velocity > 450) {
            hapticService.light();
            setSelectedRoomId(null);
            setShowRoute(false);
          }
          setCardDragY(0);
        }}
        style={{
          transform: selectedRoom
            ? `translateY(${cardDragY}px)`
            : 'translateY(calc(100% + 140px))',
          transition: isDraggingCard
            ? 'none'
            : 'transform 380ms cubic-bezier(0.32, 0.72, 0, 1), opacity 240ms cubic-bezier(0.23, 1, 0.32, 1)'
        }}
        className={`fixed z-30 bg-mnac-surface/95 backdrop-blur-xl shadow-2xl bottom-36 left-3 right-3 rounded-3xl border border-white/15 md:left-8 md:right-auto md:bottom-8 md:w-[410px] ${
          selectedRoom ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
      >
        {/* Subtle Drag Handle on Mobile */}
        <div className="md:hidden w-9 h-1 rounded-full bg-white/20 mx-auto mt-2.5" />
        {selectedRoom && (
          <div className="relative p-4 sm:p-5 space-y-4">
            <button
              onClick={() => {
                hapticService.light();
                setSelectedRoomId(null);
                setShowRoute(false);
              }}
              aria-label="Cerrar detalle"
              className="absolute top-3.5 right-3.5 w-9 h-9 bg-white/10 rounded-full flex items-center justify-center text-mnac-textSecondary hover:text-white active:scale-95 transition-all"
            >
              <X size={17} />
            </button>

            <div className="flex gap-3.5 pr-9">
              {selectedRoom.image ? (
                <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl overflow-hidden bg-mnac-bg border border-white/10 shrink-0">
                  <OptimizedImage
                    src={selectedRoom.image}
                    alt={selectedRoom.title}
                    aspectRatio="aspect-square"
                  />
                </div>
              ) : (
                <div className="w-16 h-16 rounded-2xl bg-mnac-bg border border-white/10 flex items-center justify-center text-mnac-accent shrink-0">
                  <MapPin size={22} />
                </div>
              )}

              <div className="min-w-0">
                <div className="flex flex-wrap items-center gap-1.5 mb-1">
                  <span className="text-mnac-accent text-[10px] font-bold uppercase tracking-widest">
                    {selectedRoom.roomCode}
                  </span>
                  <span className="text-white/25">·</span>
                  <span className="text-[10px] text-mnac-secondary font-medium">
                    {selectedRoom.wing}
                  </span>
                  <span className="text-white/25">·</span>
                  <span className="text-[10px] text-mnac-textSecondary flex items-center gap-1">
                    <Clock size={10} /> {selectedRoom.walkTime}
                  </span>
                </div>
                <h2 className="font-serif italic text-xl sm:text-2xl text-white leading-tight truncate">
                  {selectedRoom.title}
                </h2>
                <p className="text-mnac-textSecondary text-xs font-light line-clamp-2 mt-1">
                  {selectedRoom.desc}
                </p>
              </div>
            </div>

            {/* Step-by-step Wayfinding Directions */}
            {showRoute && (
              <div className="p-3.5 rounded-2xl bg-mnac-bg/90 border border-mnac-accent/40 space-y-1.5 animate-crossfade">
                <span className="text-[10px] font-bold uppercase tracking-widest text-mnac-accent block">
                  Cómo llegar · {selectedRoom.walkTime}
                </span>
                {selectedRoom.directions.map((step, i) => (
                  <p key={i} className="text-xs text-mnac-textPrimary flex items-start gap-2">
                    <span className="font-mono text-[10px] text-mnac-accent font-bold mt-0.5">
                      0{i + 1}
                    </span>
                    <span>{step}</span>
                  </p>
                ))}
              </div>
            )}

            {/* Action Buttons (44px+ comfortable tap height) */}
            <div className="flex gap-2.5">
              <button
                onClick={() => {
                  hapticService.medium();
                  setShowRoute(!showRoute);
                }}
                className={`flex-1 min-h-[44px] py-3 px-4 rounded-full text-xs font-bold uppercase tracking-widest flex items-center justify-center gap-2 active:scale-95 transition-all border ${
                  showRoute
                    ? 'bg-white text-black border-white'
                    : 'bg-mnac-accent text-white border-mnac-accent shadow-lg'
                }`}
              >
                <Navigation size={15} /> {showRoute ? 'Ocultar Ruta' : 'Cómo Llegar'}
              </button>

              {selectedRoom.artworkId ? (
                <Link
                  to={`/artwork/${selectedRoom.artworkId}`}
                  onClick={() => hapticService.light()}
                  className="flex-1 min-h-[44px] py-3 px-4 rounded-full bg-mnac-bg border border-white/15 text-white text-xs font-bold uppercase tracking-widest flex items-center justify-center gap-1.5 hover:border-white/30 active:scale-95 transition-all"
                >
                  Ver Obra <ArrowRight size={15} />
                </Link>
              ) : selectedRoom.tourFilter ? (
                <Link
                  to={`/tours?filter=${selectedRoom.tourFilter}`}
                  onClick={() => hapticService.light()}
                  className="flex-1 min-h-[44px] py-3 px-4 rounded-full bg-mnac-bg border border-white/15 text-white text-xs font-bold uppercase tracking-widest flex items-center justify-center gap-1.5 hover:border-white/30 active:scale-95 transition-all"
                >
                  Itinerarios <ArrowRight size={15} />
                </Link>
              ) : (
                <Link
                  to="/visit"
                  onClick={() => hapticService.light()}
                  className="flex-1 min-h-[44px] py-3 px-4 rounded-full bg-mnac-bg border border-white/15 text-white text-xs font-bold uppercase tracking-widest flex items-center justify-center gap-1.5 hover:border-white/30 active:scale-95 transition-all"
                >
                  Info Visita <ArrowRight size={15} />
                </Link>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default MapPage;
