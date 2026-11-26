import React, { useEffect, useState } from 'react';
import {
  ArrowRight,
  ArrowUpRight,
  Play,
  Clock,
  MapPin,
  QrCode,
  Headphones,
  Sparkles,
  Search,
  Trophy,
  Flame,
  Download,
  X
} from 'lucide-react';
import { Link, Navigate, useLocation } from 'react-router-dom';
import { UserRole } from '../types';
import Footer from '../components/Footer';
import { useHomeContent } from '../hooks/useHomeContent';
import OptimizedImage from '../components/OptimizedImage';
import { IMAGES } from '../data/images';
import { ARTWORKS_DATA } from '../data/artworks';
import { useGamification } from '../hooks/useGamification';
import { hapticService } from '../services/hapticService';

interface HomePageProps {
  role: UserRole;
  onSetScrolled: (scrolled: boolean) => void;
  onSetHeaderVisible: (visible: boolean) => void;
}

const FEATURED_SECTIONS = [
  {
    id: 1,
    titleItalic: "Romanesque",
    titleNormal: "Masterpieces",
    count: 292,
    image: IMAGES.artworks.pantocrator,
    link: "/tours?filter=Románico",
    desc: "La colección de pintura mural románica más importante del mundo."
  },
  {
    id: 2,
    titleItalic: "Modernisme",
    titleNormal: "& Avant-Garde",
    count: 1284,
    image: IMAGES.artworks.jovenDecadente,
    link: "/tours?filter=Modernismo",
    desc: "De Gaudí a Picasso. La eclosión del arte moderno en Barcelona."
  }
];

const QUICK_ACTIONS = [
  { label: 'Escanear', icon: QrCode, to: '/tours', accent: true },
  { label: 'Mapa', icon: MapPin, to: '/visit/map', accent: false },
  { label: 'Audioguías', icon: Headphones, to: '/tours', accent: false },
  { label: 'Palau IA', icon: Sparkles, to: '/collection/ai-search', accent: false },
];

const HomePage: React.FC<HomePageProps> = ({ role, onSetScrolled, onSetHeaderVisible }) => {
  if (!role) return <Navigate to="/" replace />;

  const { content } = useHomeContent(role);
  const { progress } = useGamification(role);
  const { hash } = useLocation();
  const [installPrompt, setInstallPrompt] = useState<any>(null);
  const [showPwaBanner, setShowPwaBanner] = useState(false);

  useEffect(() => {
    if (!hash) window.scrollTo(0, 0);
    onSetScrolled(false);
    onSetHeaderVisible(true);
    const handleScroll = () => onSetScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);

    const handleBeforeInstall = (e: Event) => {
      e.preventDefault();
      setInstallPrompt(e);
      setShowPwaBanner(true);
    };
    window.addEventListener('beforeinstallprompt', handleBeforeInstall);

    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('beforeinstallprompt', handleBeforeInstall);
    };
  }, []);

  const handleInstallPwa = async () => {
    hapticService.light();
    if (!installPrompt) return;
    installPrompt.prompt();
    await installPrompt.userChoice;
    setShowPwaBanner(false);
  };

  const quickArtworks = ARTWORKS_DATA.slice(0, 5);

  return (
    <div className="w-full bg-mnac-bg min-h-screen flex flex-col text-mnac-textPrimary pb-24 md:pb-0">
      
      {/* HERO SECTION - MOBILE-FIRST EDITORIAL */}
      <section className="relative w-full h-[65vh] md:h-[85vh] flex flex-col justify-end p-5 sm:p-6 md:p-12 overflow-hidden">
        <div className="absolute inset-0 z-0">
          <OptimizedImage 
            src={content.hero.backgroundImage} 
            alt="MNAC Hero" 
            priority={true}
            aspectRatio="h-full w-full"
            className="opacity-70 scale-105 animate-scale-slow"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-mnac-bg via-mnac-bg/35 to-transparent"></div>
        </div>

        <div className="relative z-10 max-w-[1920px] w-full mx-auto animate-slide-up">
          <div className="flex flex-col md:flex-row md:justify-between md:items-end border-b border-mnac-divider pb-6 md:pb-8 gap-5">
            <div>
              <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full bg-black/40 backdrop-blur-md border border-white/10 mb-3">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-mnac-textPrimary">
                  Museu Nacional · Abierto hoy
                </span>
              </div>
              <h1 className="text-4xl sm:text-6xl md:text-8xl font-serif italic leading-none mb-1.5 tracking-tight">
                {content.hero.titleItalic}
              </h1>
              <h1 className="text-4xl sm:text-6xl md:text-8xl font-sans font-light leading-none tracking-tighter">
                {content.hero.titleNormal}
              </h1>
            </div>

            {/* Mobile Primary CTA */}
            <Link
              to={content.hero.linkPrimary}
              onClick={() => hapticService.light()}
              className="md:hidden inline-flex items-center justify-between w-full px-5 py-3.5 rounded-full bg-mnac-accent text-white font-bold text-xs uppercase tracking-[0.2em] active:scale-95 transition-transform shadow-[0_8px_24px_rgba(241,74,50,0.35)]"
            >
              <span>Explorar Colección</span>
              <ArrowRight size={18} />
            </Link>

            {/* Desktop Floating Action Button */}
            <Link
              to={content.hero.linkPrimary}
              onClick={() => hapticService.light()}
              className="hidden md:flex group items-center justify-center w-20 h-20 rounded-full bg-mnac-accent text-white hover:scale-110 transition-transform shadow-[0_0_30px_rgba(255,77,40,0.4)]"
            >
              <ArrowRight size={32} className="-rotate-45 group-hover:rotate-0 transition-transform duration-300" />
            </Link>
          </div>
          
          <div className="flex justify-between items-center pt-4 md:pt-6 text-[10px] font-bold uppercase tracking-widest text-mnac-textSecondary">
            <span className="flex items-center gap-1.5"><Clock size={12}/> 10:00 – 18:00h</span>
            <Link
              to="/visit"
              onClick={() => hapticService.light()}
              className="hover:text-white active:scale-95 transition-all flex items-center gap-1.5"
            >
              Planificar Visita <ArrowUpRight size={12} />
            </Link>
          </div>
        </div>
      </section>

      {/* QUICK SEARCH & QUICK ACTIONS (MOBILE APP BAR) */}
      <section className="px-5 sm:px-6 md:px-12 pt-6 pb-4 max-w-[1920px] mx-auto w-full space-y-5">
        <Link
          to="/collection/ai-search"
          onClick={() => hapticService.light()}
          className="flex items-center gap-3 w-full px-4 py-3.5 rounded-2xl bg-mnac-surface border border-white/10 text-mnac-textSecondary active:scale-[0.99] transition-transform"
        >
          <Search size={18} className="text-mnac-accent shrink-0" />
          <span className="text-xs sm:text-sm truncate">Buscar obras, artistas o preguntar a Palau IA...</span>
        </Link>

        <div className="grid grid-cols-4 gap-2.5 sm:gap-4">
          {QUICK_ACTIONS.map((action) => {
            const Icon = action.icon;
            return (
              <Link
                key={action.label}
                to={action.to}
                onClick={() => hapticService.light()}
                className={`flex flex-col items-center justify-center gap-2 py-3.5 px-2 rounded-2xl border active:scale-95 transition-all ${
                  action.accent
                    ? 'bg-mnac-accent/15 border-mnac-accent/40 text-white'
                    : 'bg-mnac-surface border-white/10 text-mnac-textPrimary hover:border-white/25'
                }`}
              >
                <Icon size={20} className={action.accent ? 'text-mnac-accent' : 'text-mnac-secondary'} />
                <span className="text-[10px] font-bold uppercase tracking-wider text-center leading-tight">
                  {action.label}
                </span>
              </Link>
            );
          })}
        </div>
      </section>

      {/* GAMIFICATION PROGRESS WIDGET */}
      <section className="px-5 sm:px-6 md:px-12 py-3 max-w-[1920px] mx-auto w-full">
        <Link
          to="/badges"
          onClick={() => hapticService.light()}
          className="flex items-center justify-between p-4 rounded-2xl bg-mnac-surface border border-white/10 active:scale-[0.98] transition-transform"
        >
          <div className="flex items-center gap-3.5">
            <div className="w-11 h-11 rounded-xl bg-mnac-accent/15 border border-mnac-accent/30 flex items-center justify-center text-mnac-accent shrink-0">
              <Trophy size={20} />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold uppercase tracking-wider text-white">Nivel {progress.level}</span>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-white/10 text-mnac-secondary font-semibold">
                  {progress.xp} XP
                </span>
              </div>
              <p className="text-[11px] text-mnac-textSecondary mt-0.5">
                {progress.unlockedBadges.length} insignias · {progress.readArtworks.length} obras exploradas
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2 text-mnac-accent shrink-0">
            <span className="inline-flex items-center gap-1 text-xs font-bold">
              <Flame size={14} /> {progress.streak}d
            </span>
            <ArrowRight size={16} className="text-mnac-textSecondary" />
          </div>
        </Link>
      </section>

      {/* FEATURED SECTIONS - HORIZONTAL SNAP CAROUSEL ON MOBILE */}
      <section className="py-8 max-w-[1920px] mx-auto w-full">
        <div className="px-5 sm:px-6 md:px-12 flex items-center justify-between mb-5">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-mnac-accent block mb-1">
              Colecciones
            </span>
            <h2 className="text-2xl md:text-3xl font-serif italic text-white tracking-tight">
              Imprescindibles
            </h2>
          </div>
          <Link
            to="/tours"
            onClick={() => hapticService.light()}
            className="text-[10px] font-bold uppercase tracking-widest text-mnac-textSecondary hover:text-white flex items-center gap-1"
          >
            Ver todo <ArrowRight size={12} />
          </Link>
        </div>

        <div className="flex md:grid md:grid-cols-2 gap-5 md:gap-10 overflow-x-auto snap-x snap-mandatory no-scrollbar px-5 sm:px-6 md:px-12 pb-2">
          {FEATURED_SECTIONS.map((section) => (
            <Link
              to={section.link}
              key={section.id}
              onClick={() => hapticService.light()}
              className="group block relative shrink-0 w-[82vw] sm:w-[68vw] md:w-auto snap-start rounded-2xl overflow-hidden bg-mnac-surface border border-white/10 active:scale-[0.98] transition-transform"
            >
              <div className="aspect-[4/3] md:aspect-[16/10] overflow-hidden relative">
                <OptimizedImage 
                  src={section.image} 
                  alt={section.titleNormal} 
                  aspectRatio="h-full w-full"
                  className="group-hover:scale-105 transition-transform duration-700 ease-out opacity-85 group-hover:opacity-100"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-mnac-surface via-transparent to-transparent" />
                <div className="absolute bottom-4 right-4 w-11 h-11 rounded-full bg-mnac-accent text-white flex items-center justify-center shadow-lg">
                  <Play size={18} fill="currentColor" />
                </div>
              </div>
              <div className="p-5">
                <span className="text-mnac-textSecondary font-sans text-[11px] mb-1.5 block font-medium">
                  {section.count} Obras
                </span>
                <h3 className="text-2xl md:text-3xl font-serif italic text-white leading-tight">
                  {section.titleItalic}{' '}
                  <span className="font-sans font-light not-italic">{section.titleNormal}</span>
                </h3>
                <p className="text-mnac-textSecondary text-xs leading-relaxed mt-2 line-clamp-2">
                  {section.desc}
                </p>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* PARA TI HOY - HORIZONTAL ARTWORKS CAROUSEL */}
      <section className="py-6 max-w-[1920px] mx-auto w-full">
        <div className="px-5 sm:px-6 md:px-12 flex items-center justify-between mb-5">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-mnac-accent block mb-1">
              Selección Curatorial
            </span>
            <h2 className="text-2xl md:text-3xl font-serif italic text-white tracking-tight">
              Para ti hoy
            </h2>
          </div>
          <Link
            to="/tours"
            onClick={() => hapticService.light()}
            className="text-[10px] font-bold uppercase tracking-widest text-mnac-textSecondary hover:text-white flex items-center gap-1"
          >
            Explorar <ArrowRight size={12} />
          </Link>
        </div>

        <div className="flex gap-4 overflow-x-auto snap-x snap-mandatory no-scrollbar px-5 sm:px-6 md:px-12 pb-2">
          {quickArtworks.map((art) => (
            <Link
              key={art.id}
              to={`/artwork/${art.id}`}
              onClick={() => hapticService.light()}
              className="shrink-0 w-[62vw] sm:w-[42vw] md:w-[240px] snap-start rounded-2xl overflow-hidden bg-mnac-surface border border-white/10 active:scale-95 transition-transform"
            >
              <div className="aspect-[3/4] overflow-hidden relative">
                <OptimizedImage
                  src={art.imageUrl}
                  alt={art.title}
                  aspectRatio="h-full w-full"
                  className="opacity-90"
                />
                <span className="absolute top-3 left-3 px-2.5 py-1 rounded-full bg-black/60 backdrop-blur-md text-[10px] font-bold uppercase tracking-wider text-white">
                  {art.period}
                </span>
              </div>
              <div className="p-3.5">
                <h4 className="text-sm font-semibold text-white truncate">{art.title}</h4>
                <p className="text-[11px] text-mnac-textSecondary truncate mt-0.5">{art.artist} · {art.year}</p>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* PWA INSTALL BANNER (ONLY WHEN AVAILABLE) */}
      {showPwaBanner && (
        <section className="px-5 sm:px-6 md:px-12 py-4 max-w-[1920px] mx-auto w-full">
          <div className="flex items-center justify-between gap-3 p-4 rounded-2xl bg-mnac-surface border border-mnac-accent/40">
            <div className="flex items-center gap-3 min-w-0">
              <div className="w-10 h-10 rounded-xl bg-mnac-accent text-white flex items-center justify-center shrink-0">
                <Download size={18} />
              </div>
              <div className="min-w-0">
                <p className="text-xs font-bold text-white truncate">Instalar App MNAC</p>
                <p className="text-[11px] text-mnac-textSecondary truncate">Acceso rápido y modo sin conexión</p>
              </div>
            </div>
            <div className="flex items-center gap-2 shrink-0">
              <button
                onClick={handleInstallPwa}
                className="px-3.5 py-2 rounded-full bg-mnac-accent text-white text-[10px] font-bold uppercase tracking-wider active:scale-95 transition-transform"
              >
                Instalar
              </button>
              <button
                onClick={() => setShowPwaBanner(false)}
                aria-label="Cerrar"
                className="p-1.5 text-mnac-textSecondary hover:text-white"
              >
                <X size={16} />
              </button>
            </div>
          </div>
        </section>
      )}

      {/* FOOTER PREVIEW - MINIMAL */}
      <section className="bg-mnac-surface px-6 py-14 md:py-20 text-center mt-6">
        <span className="text-mnac-accent text-xs font-bold uppercase tracking-widest mb-3 block">Agenda</span>
        <h2 className="text-3xl md:text-4xl font-serif italic text-white mb-6 tracking-tight">Exposiciones Temporales</h2>
        <div className="flex justify-center gap-4">
          <Link
            to="/visit"
            onClick={() => hapticService.light()}
            className="border border-white/20 px-8 py-3 text-xs font-bold uppercase tracking-widest hover:bg-white hover:text-black active:scale-95 transition-all"
          >
            Ver Agenda
          </Link>
        </div>
      </section>

      <Footer role={role} />
    </div>
  );
};

export default HomePage;
