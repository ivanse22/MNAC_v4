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
  Coffee
} from 'lucide-react';
import OptimizedImage from '../components/OptimizedImage';
import { Link } from 'react-router-dom';
import HairlineMuseumMap, { MuseumPoint, PointCategory } from '../components/HairlineMuseumMap';
import { hapticService } from '../services/hapticService';

interface MapPageProps {
  userRole: UserRole;
}

const MUSEUM_POINTS: MuseumPoint[] = [
  // PLANTA 0 · VESTÍBULO
  {
    id: 'p0-tickets',
    level: 0,
    category: 'service',
    roomCode: 'P0 · Vestíbulo',
    title: 'Taquillas e Información',
    subtitle: 'Acceso Principal',
    desc: 'Venta presencial de entradas, recogida de audioguías y atención al visitante.',
    directions: ['Entrada principal del Palau Nacional', 'Gira a la derecha tras los arcos de acceso'],
    walkTime: '1 min',
    x: 42,
    y: 22
  },
  {
    id: 'p0-cloakroom',
    level: 0,
    category: 'service',
    roomCode: 'P0 · Vestíbulo',
    title: 'Consigna y Taquillas',
    subtitle: 'Servicio Gratuito',
    desc: 'Guarda mochilas grandes, paraguas y maletas de forma gratuita antes de entrar a salas.',
    directions: ['Desde el vestíbulo central, dirígete al ala oeste', 'Junto al control de acceso a exposiciones'],
    walkTime: '1 min',
    x: -44,
    y: 20
  },
  {
    id: 'p0-shop',
    level: 0,
    category: 'service',
    roomCode: 'P0 · Vestíbulo',
    title: 'Librería & Tienda MNAC',
    subtitle: 'Publicaciones y Diseño',
    desc: 'Catálogos de exposiciones, láminas, objetos modernistas y regalos culturales.',
    directions: ['Cruza el hall hacia el lado este junto a la salida principal'],
    walkTime: '1 min',
    x: 52,
    y: -14
  },
  {
    id: 'p0-wc-access',
    level: 0,
    category: 'accessibility',
    roomCode: 'P0 · Accesibilidad',
    title: 'Ascensor y Baños Adaptados',
    subtitle: 'Sin Barreras',
    desc: 'Ascensor panorámico hacia P1 y P2, aseos accesibles, cambiador y préstamo de sillas de ruedas.',
    directions: ['Desde el centro del vestíbulo, sigue la señalética verde hacia el núcleo central'],
    walkTime: '1 min',
    x: -14,
    y: -16
  },

  // PLANTA 1 · MEDIEVAL & SIGLO DE ORO
  {
    id: 'p1-romanesque',
    level: 1,
    category: 'art',
    roomCode: 'P1 · Salas 01–06',
    title: 'Ábsides Románicos (Taüll)',
    subtitle: 'Pintura Mural s. XI–XIII',
    desc: 'La colección de frescos románicos más importante del mundo, presidida por el Pantocrátor de Taüll.',
    directions: ['Desde la escalera central en P1, gira a la izquierda (Ala Oeste)', 'Entra por el primer pórtico hacia las capillas oscurecidas'],
    walkTime: '2 min',
    x: -50,
    y: -10,
    artworkId: 'art-0',
    tourFilter: 'Románico',
    image: '/artworks/art-0.jpg'
  },
  {
    id: 'p1-gothic',
    level: 1,
    category: 'art',
    roomCode: 'P1 · Salas 07–11',
    title: 'Gótico Catalán y Retablos',
    subtitle: 'Huguet · Bermejo · Martorell',
    desc: 'Retablos monumentales de oro y temple de la Corona de Aragón y realismo hispanoflamenco.',
    directions: ['Desde el Ala Oeste, continúa recto hacia el ala norte', 'Sigue las salas 07 a 11 hasta San Agustín'],
    walkTime: '3 min',
    x: -48,
    y: 22,
    artworkId: 'art-3',
    tourFilter: 'Gótico',
    image: '/artworks/art-3.jpg'
  },
  {
    id: 'p1-oval',
    level: 1,
    category: 'service',
    roomCode: 'P1 · Centro',
    title: 'Gran Sala Oval',
    subtitle: 'Corazón del Palau',
    desc: 'Espacio monumental central bajo la cúpula. Punto de encuentro entre las alas medieval y moderna.',
    directions: ['Sube la escalinata central desde el Vestíbulo hasta el gran espacio abovedado'],
    walkTime: '1 min',
    x: 0,
    y: 0
  },
  {
    id: 'p1-renaissance',
    level: 1,
    category: 'art',
    roomCode: 'P1 · Sala 12',
    title: 'Renacimiento & El Greco',
    subtitle: 'Manierismo y Siglo XVI',
    desc: 'Diálogo entre el humanismo europeo, el retrato y la espiritualidad intensa de El Greco.',
    directions: ['Cruza la Sala Oval hacia el Ala Este', 'Primera galería a la derecha'],
    walkTime: '2 min',
    x: 48,
    y: -14,
    artworkId: 'art-8',
    tourFilter: 'Renacimiento',
    image: '/artworks/art-8.jpg'
  },
  {
    id: 'p1-baroque',
    level: 1,
    category: 'art',
    roomCode: 'P1 · Sala 13',
    title: 'Barroco & Zurbarán',
    subtitle: 'Claroscuro s. XVII',
    desc: 'Tenebrismo español, bodegones místicos y grandes lienzos del Siglo de Oro.',
    directions: ['Desde la Sala 12 en el Ala Este, avanza hacia las salas del fondo'],
    walkTime: '3 min',
    x: 52,
    y: 20,
    artworkId: 'art-5',
    image: '/artworks/art-5.jpg'
  },
  {
    id: 'p1-lift',
    level: 1,
    category: 'accessibility',
    roomCode: 'P1 · Accesibilidad',
    title: 'Ascensor & Aseos P1',
    subtitle: 'Ruta Accesible',
    desc: 'Conexión sin escalones con Planta 0 y Planta 2, más bancos de descanso en cada sala.',
    directions: ['Justo al borde norte de la Sala Oval'],
    walkTime: '1 min',
    x: 10,
    y: -16
  },

  // PLANTA 2 · ARTE MODERNO & MIRADOR
  {
    id: 'p2-modernism',
    level: 2,
    category: 'art',
    roomCode: 'P2 · Salas 15–18',
    title: 'Modernismo & Ramon Casas',
    subtitle: 'Barcelona 1900',
    desc: 'Casas, Rusiñol, Nonell y Gaudí. La explosión creativa de la Barcelona modernista y bohemia.',
    directions: ['Sube a la Planta 2 por escalera o ascensor', 'Accede al Ala Oeste por el pasillo principal'],
    walkTime: '3 min',
    x: -48,
    y: -8,
    artworkId: 'art-1',
    tourFilter: 'Modernismo',
    image: '/artworks/art-1.jpg'
  },
  {
    id: 'p2-sculpture',
    level: 2,
    category: 'art',
    roomCode: 'P2 · Sala 17',
    title: 'Escultura Simbolista',
    subtitle: 'Josep Llimona · Desconsol',
    desc: 'Mármoles modernistas y expresividad íntima del cambio de siglo catalán.',
    directions: ['En el Ala Oeste de Planta 2, galería central de esculturas'],
    walkTime: '3 min',
    x: -46,
    y: 22,
    artworkId: 'art-11',
    image: '/artworks/art-11.jpg'
  },
  {
    id: 'p2-realism',
    level: 2,
    category: 'art',
    roomCode: 'P2 · Sala 14',
    title: 'Realismo & Crónica Social',
    subtitle: 'Fortuny · Casas',
    desc: 'Desde el preciosismo de La Vicaría hasta la crónica urbana de La Carga.',
    directions: ['Ala Este de Planta 2, primeras galerías tras salir del núcleo central'],
    walkTime: '3 min',
    x: 48,
    y: -8,
    artworkId: 'art-4',
    image: '/artworks/art-4.jpg'
  },
  {
    id: 'p2-terrace',
    level: 2,
    category: 'service',
    roomCode: 'P2 · Mirador',
    title: 'Terrazas Mirador 360° & Café',
    subtitle: 'Vistas a Barcelona',
    desc: 'Pausa panorámica frente a Montjuïc y la Avenida Maria Cristina, con cafetería y zona de descanso.',
    directions: ['Desde el centro de Planta 2, sigue la salida exterior sur hacia las terrazas'],
    walkTime: '2 min',
    x: 0,
    y: 18
  },
  {
    id: 'p2-access',
    level: 2,
    category: 'accessibility',
    roomCode: 'P2 · Accesibilidad',
    title: 'Ascensor & Rampas P2',
    subtitle: 'Acceso Mirador Adaptado',
    desc: 'Rampa continua desde las galerías de Arte Moderno hasta las Terrazas Mirador y aseos.',
    directions: ['Núcleo este junto al acceso a terrazas'],
    walkTime: '1 min',
    x: 34,
    y: 18
  }
];

const LEVEL_INFO: Record<0 | 1 | 2, { label: string; title: string }> = {
  0: { label: 'P0', title: 'Planta 0 · Vestíbulo y Servicios' },
  1: { label: 'P1', title: 'Planta 1 · Medieval y Siglo de Oro' },
  2: { label: 'P2', title: 'Planta 2 · Arte Moderno y Mirador' }
};

const CATEGORY_FILTERS: { id: 'all' | PointCategory; label: string }[] = [
  { id: 'all', label: 'Todo' },
  { id: 'art', label: 'Salas de Arte' },
  { id: 'service', label: 'Servicios' },
  { id: 'accessibility', label: 'Accesibilidad' }
];

const MapPage: React.FC<MapPageProps> = () => {
  const [activeLevel, setActiveLevel] = useState<0 | 1 | 2>(1);
  const [explodedView, setExplodedView] = useState(false);
  const [categoryFilter, setCategoryFilter] = useState<'all' | PointCategory>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRoomId, setSelectedRoomId] = useState<string | null>('p1-romanesque');
  const [showRoute, setShowRoute] = useState(false);
  const [scale, setScale] = useState(1);
  const [pan, setPan] = useState({ x: 0, y: 0 });

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
      <div className="absolute inset-0 pt-24 pb-32">
        <HairlineMuseumMap
          points={filteredPoints}
          activeLevel={activeLevel}
          explodedView={explodedView}
          selectedId={selectedRoomId}
          onSelectPoint={handleSelectPoint}
          scale={scale}
          pan={pan}
          onPanChange={setPan}
          showRoute={showRoute}
        />
      </div>

      {/* --- TOP HUD: TITLE, READ-OUT, SEARCH & CATEGORY PILLS --- */}
      <div className="relative z-20 pt-20 md:pt-24 px-4 sm:px-6 pointer-events-none">
        <div className="max-w-5xl mx-auto space-y-3 pointer-events-auto">
          <div className="flex items-end justify-between gap-3">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="w-1.5 h-1.5 rounded-full bg-mnac-accent" />
                <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-mnac-textSecondary">
                  {LEVEL_INFO[activeLevel].title}
                </span>
              </div>
              <h1 className="font-serif italic text-3xl sm:text-4xl text-white leading-none tracking-tight">
                Mapa del Museo
              </h1>
            </div>

            {/* Hairline Corner Read-out */}
            <div className="px-3 py-1.5 rounded-full bg-mnac-surface/90 backdrop-blur-md border border-white/10 font-mono text-[10px] text-mnac-secondary shrink-0">
              {selectedRoom ? selectedRoom.roomCode : `${LEVEL_INFO[activeLevel].label} · Vista General`}
            </div>
          </div>

          {/* Search Bar */}
          <div className="relative">
            <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-mnac-accent pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => handleSearchChange(e.target.value)}
              placeholder="Buscar sala, obra, baños, taquilla, ascensor..."
              className="w-full bg-mnac-surface/90 backdrop-blur-xl border border-white/10 rounded-full py-2.5 pl-10 pr-9 text-xs text-white placeholder-mnac-textSecondary/60 focus:outline-none focus:border-mnac-accent shadow-lg"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-mnac-textSecondary hover:text-white"
              >
                <X size={14} />
              </button>
            )}
          </div>

          {/* Category Filter Pills + Quick Floor Room Chips */}
          <div className="flex gap-2 overflow-x-auto no-scrollbar pb-0.5">
            {CATEGORY_FILTERS.map((cat) => (
              <button
                key={cat.id}
                onClick={() => {
                  hapticService.light();
                  setCategoryFilter(cat.id);
                }}
                className={`shrink-0 px-3.5 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-wider border active:scale-95 transition-all ${
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
            <div className="flex gap-1.5 overflow-x-auto no-scrollbar">
              {currentFloorPoints.map((pt) => {
                const active = selectedRoomId === pt.id;
                return (
                  <button
                    key={pt.id}
                    onClick={() => handleSelectPoint(pt.id)}
                    className={`shrink-0 px-3 py-1 rounded-full text-[10px] font-medium border active:scale-95 transition-all flex items-center gap-1.5 ${
                      active
                        ? 'bg-white text-black border-white font-bold'
                        : 'bg-black/45 backdrop-blur-md text-mnac-textPrimary border-white/10'
                    }`}
                  >
                    {pt.category === 'accessibility' && <Accessibility size={11} className={active ? 'text-black' : 'text-emerald-400'} />}
                    {pt.category === 'service' && <Coffee size={11} className={active ? 'text-black' : 'text-mnac-secondary'} />}
                    {pt.category === 'art' && <Sparkles size={11} className={active ? 'text-black' : 'text-mnac-accent'} />}
                    <span>{pt.title}</span>
                  </button>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* --- FLOATING CONTROLS DOCK (LEVELS, 3D STACK, ZOOM, RECENTER) --- */}
      <div
        className={`fixed left-1/2 -translate-x-1/2 z-20 flex items-center gap-2 sm:gap-3 bg-mnac-surface/95 backdrop-blur-xl shadow-2xl rounded-full px-3.5 py-2 border border-white/10 transition-all duration-300 ${
          selectedRoom ? 'bottom-[15.5rem] md:bottom-8' : 'bottom-28 md:bottom-8'
        }`}
      >
        {/* 3-Level Switcher */}
        <div className="flex items-center bg-mnac-bg rounded-full p-1 gap-0.5">
          {([0, 1, 2] as const).map((lvl) => (
            <button
              key={lvl}
              onClick={() => {
                hapticService.light();
                setActiveLevel(lvl);
              }}
              className={`px-3 py-1.5 rounded-full text-[11px] font-bold transition-all active:scale-95 ${
                activeLevel === lvl
                  ? 'bg-mnac-accent text-white shadow'
                  : 'text-mnac-textSecondary hover:text-white'
              }`}
            >
              P{lvl}
            </button>
          ))}
        </div>

        <div className="w-px h-5 bg-white/10" />

        {/* Exploded 3D Toggle */}
        <button
          onClick={() => {
            hapticService.light();
            setExplodedView(!explodedView);
          }}
          aria-label="Vista 3D por plantas"
          title="Separar plantas en 3D"
          className={`p-2 rounded-full active:scale-90 transition-all ${
            explodedView ? 'bg-mnac-accent/20 text-mnac-accent' : 'text-mnac-textSecondary hover:text-white'
          }`}
        >
          <Layers size={16} />
        </button>

        {/* Zoom Controls */}
        <button
          onClick={() => {
            hapticService.light();
            setScale((prev) => Math.max(0.85, Number((prev - 0.25).toFixed(2))));
          }}
          aria-label="Alejar"
          className="p-2 rounded-full text-mnac-textSecondary hover:text-white active:scale-90 transition-all"
        >
          <ZoomOut size={16} />
        </button>
        <button
          onClick={() => {
            hapticService.light();
            setScale((prev) => Math.min(2.4, Number((prev + 0.25).toFixed(2))));
          }}
          aria-label="Acercar"
          className="p-2 rounded-full text-mnac-textSecondary hover:text-white active:scale-90 transition-all"
        >
          <ZoomIn size={16} />
        </button>

        {/* Recenter */}
        <button
          onClick={handleResetView}
          aria-label="Centrar mapa"
          className="p-2 rounded-full text-mnac-textSecondary hover:text-white active:scale-90 transition-all"
        >
          <LocateFixed size={16} />
        </button>
      </div>

      {/* --- ACTIONABLE ROOM DETAIL & WAYFINDING BOTTOM SHEET --- */}
      <div
        className={`fixed z-30 transition-all duration-500 ease-[cubic-bezier(0.19,1,0.22,1)] w-full bg-mnac-surface/95 backdrop-blur-xl shadow-2xl bottom-0 left-0 rounded-t-3xl border-t border-white/15 md:w-[400px] md:bottom-8 md:left-8 md:rounded-3xl md:border ${
          selectedRoom ? 'translate-y-0' : 'translate-y-[115%]'
        }`}
      >
        {selectedRoom && (
          <div className="relative p-5 pb-28 md:pb-5 space-y-4">
            <button
              onClick={() => {
                hapticService.light();
                setSelectedRoomId(null);
                setShowRoute(false);
              }}
              aria-label="Cerrar detalle"
              className="absolute top-4 right-4 bg-white/10 p-1.5 rounded-full text-mnac-textSecondary hover:text-white active:scale-95 transition-all"
            >
              <X size={16} />
            </button>

            <div className="flex gap-3.5 pr-7">
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
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-mnac-accent text-[10px] font-bold uppercase tracking-widest">
                    {selectedRoom.roomCode}
                  </span>
                  <span className="text-white/20">·</span>
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
              <div className="p-3.5 rounded-2xl bg-mnac-bg/85 border border-mnac-accent/35 space-y-1.5 animate-fade-in">
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

            {/* Action Buttons */}
            <div className="flex gap-2.5">
              <button
                onClick={() => {
                  hapticService.medium();
                  setShowRoute(!showRoute);
                }}
                className={`flex-1 py-3 px-4 rounded-full text-xs font-bold uppercase tracking-widest flex items-center justify-center gap-2 active:scale-95 transition-all border ${
                  showRoute
                    ? 'bg-white text-black border-white'
                    : 'bg-mnac-accent text-white border-mnac-accent shadow-lg'
                }`}
              >
                <Navigation size={14} /> {showRoute ? 'Ocultar Ruta' : 'Cómo Llegar'}
              </button>

              {selectedRoom.artworkId ? (
                <Link
                  to={`/artwork/${selectedRoom.artworkId}`}
                  onClick={() => hapticService.light()}
                  className="flex-1 py-3 px-4 rounded-full bg-mnac-bg border border-white/15 text-white text-xs font-bold uppercase tracking-widest flex items-center justify-center gap-1.5 hover:border-white/30 active:scale-95 transition-all"
                >
                  Ver Obra <ArrowRight size={14} />
                </Link>
              ) : selectedRoom.tourFilter ? (
                <Link
                  to={`/tours?filter=${selectedRoom.tourFilter}`}
                  onClick={() => hapticService.light()}
                  className="flex-1 py-3 px-4 rounded-full bg-mnac-bg border border-white/15 text-white text-xs font-bold uppercase tracking-widest flex items-center justify-center gap-1.5 hover:border-white/30 active:scale-95 transition-all"
                >
                  Itinerarios <ArrowRight size={14} />
                </Link>
              ) : (
                <Link
                  to="/visit"
                  onClick={() => hapticService.light()}
                  className="flex-1 py-3 px-4 rounded-full bg-mnac-bg border border-white/15 text-white text-xs font-bold uppercase tracking-widest flex items-center justify-center gap-1.5 hover:border-white/30 active:scale-95 transition-all"
                >
                  Info Visita <ArrowRight size={14} />
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
