import React, { useEffect, useState, useRef } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  Bookmark,
  Share2,
  Palette,
  PlusCircle,
  Headphones,
  MapPin,
  Check,
  Pause,
  Loader2,
  Sparkles,
  BookOpen,
  ArrowRight,
  Volume2
} from 'lucide-react';
import { UserRole } from '../types';
import { ARTWORKS_DATA } from '../data/artworks';
import Footer from '../components/Footer';
import { generateTourScript, textToSpeech, getPreloadedAudioPath } from '../services/geminiService';
import OptimizedImage from '../components/OptimizedImage';
import { hapticService } from '../services/hapticService';

interface ArtworkDetailProps {
  userRole: UserRole;
  easyReading: boolean;
  savedArtIds: string[];
  onToggleSave: (id: string) => void;
  onVisit?: (id: string) => void;
}

const ArtworkDetail: React.FC<ArtworkDetailProps> = ({
  userRole,
  easyReading,
  savedArtIds,
  onToggleSave,
  onVisit
}) => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [isAudioPlaying, setIsAudioPlaying] = useState(false);
  const [isGeneratingAudio, setIsGeneratingAudio] = useState(false);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [useSimpleText, setUseSimpleText] = useState(easyReading);
  const [copiedShare, setCopiedShare] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const artwork = ARTWORKS_DATA.find((a) => a.id === id);
  const isSaved = artwork ? savedArtIds.includes(artwork.id) : false;

  useEffect(() => {
    setUseSimpleText(easyReading);
  }, [easyReading]);

  useEffect(() => {
    window.scrollTo(0, 0);
    setIsAudioPlaying(false);
    setAudioUrl(null);
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
    if (id && onVisit) {
      onVisit(id);
    }
    return () => {
      if (audioRef.current) audioRef.current.pause();
      if (audioUrl) URL.revokeObjectURL(audioUrl);
      if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
    };
  }, [id]);

  if (!artwork) {
    return (
      <div className="bg-mnac-bg min-h-screen text-mnac-textPrimary flex flex-col items-center justify-center p-6 text-center">
        <h1 className="font-serif italic text-3xl text-white mb-3">Obra no encontrada</h1>
        <p className="text-sm text-mnac-textSecondary mb-6">
          La pieza solicitada no está disponible en este momento.
        </p>
        <Link
          to="/collection"
          className="px-6 py-3 rounded-full bg-mnac-accent text-white text-xs font-bold uppercase tracking-widest active:scale-95 transition-transform"
        >
          Volver a la Colección
        </Link>
      </div>
    );
  }

  const activeDescription =
    userRole === 'teacher'
      ? artwork.teacherDescription
      : useSimpleText
      ? artwork.simpleDescription
      : artwork.description;

  const relatedArtworks = ARTWORKS_DATA.filter(
    (a) =>
      a.id !== artwork.id &&
      (a.period === artwork.period || a.tags.some((t) => artwork.tags.includes(t)))
  ).slice(0, 5);

  const handleAudioEnded = () => setIsAudioPlaying(false);

  const playSpeechFallback = (text: string) => {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'es-ES';
      utterance.rate = 0.95;
      utterance.onend = () => setIsAudioPlaying(false);
      utterance.onerror = () => setIsAudioPlaying(false);
      window.speechSynthesis.speak(utterance);
      setIsAudioPlaying(true);
    }
  };

  const handlePrimaryAction = async () => {
    hapticService.light();
    if (userRole === 'teacher') {
      onToggleSave(artwork.id);
      return;
    }

    if (isAudioPlaying) {
      audioRef.current?.pause();
      if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
      setIsAudioPlaying(false);
      return;
    }

    if (audioRef.current && audioUrl && !isGeneratingAudio) {
      audioRef.current.play();
      setIsAudioPlaying(true);
      return;
    }

    setIsGeneratingAudio(true);
    try {
      const preloadedUrl = getPreloadedAudioPath(artwork.id, 'Aoede');
      let hasPreloaded = false;
      try {
        const headRes = await fetch(preloadedUrl, { method: 'HEAD' });
        const contentType = headRes.headers.get('content-type') || '';
        hasPreloaded = headRes.ok && !contentType.includes('text/html');
      } catch {
        hasPreloaded = false;
      }

      if (hasPreloaded) {
        setAudioUrl(preloadedUrl);
        setTimeout(() => {
          if (audioRef.current) {
            audioRef.current.play();
            setIsAudioPlaying(true);
          }
        }, 50);
        return;
      }

      const script = await generateTourScript(artwork, 'student');
      const url = await textToSpeech(script);
      if (url) {
        setAudioUrl(url);
        setTimeout(() => {
          if (audioRef.current) {
            audioRef.current.play();
            setIsAudioPlaying(true);
          }
        }, 100);
      } else {
        playSpeechFallback(`${artwork.title}, de ${artwork.artist}. ${activeDescription}`);
      }
    } catch {
      playSpeechFallback(`${artwork.title}, de ${artwork.artist}. ${activeDescription}`);
    } finally {
      setIsGeneratingAudio(false);
    }
  };

  const handleShare = async () => {
    hapticService.light();
    const shareData = {
      title: `${artwork.title} — MNAC`,
      text: `Descubre "${artwork.title}" de ${artwork.artist} (${artwork.year}) en el MNAC.`,
      url: window.location.href
    };
    if (navigator.share) {
      try {
        await navigator.share(shareData);
      } catch {
        // User cancelled share
      }
    } else if (navigator.clipboard) {
      await navigator.clipboard.writeText(window.location.href);
      setCopiedShare(true);
      setTimeout(() => setCopiedShare(false), 2000);
    }
  };

  return (
    <div className="bg-mnac-bg min-h-screen text-mnac-textPrimary pb-24 md:pb-0">
      {audioUrl && <audio ref={audioRef} src={audioUrl} onEnded={handleAudioEnded} />}

      {/* Floating Top Controls */}
      <div className="fixed top-20 md:top-24 left-0 w-full px-5 sm:px-6 md:px-12 z-40 pointer-events-none flex justify-between items-center">
        <button
          onClick={() => {
            hapticService.light();
            navigate(-1);
          }}
          aria-label="Volver"
          className="pointer-events-auto bg-black/60 backdrop-blur-md border border-white/15 p-3 rounded-full shadow-lg text-white hover:border-mnac-accent active:scale-95 transition-all"
        >
          <ArrowLeft size={20} />
        </button>

        <div className="pointer-events-auto flex items-center gap-2.5">
          <button
            onClick={handleShare}
            aria-label="Compartir obra"
            className="bg-black/60 backdrop-blur-md border border-white/15 p-3 rounded-full shadow-lg text-white hover:border-white active:scale-95 transition-all"
          >
            {copiedShare ? <Check size={18} className="text-emerald-400" /> : <Share2 size={18} />}
          </button>
          <button
            onClick={() => {
              hapticService.medium();
              onToggleSave(artwork.id);
            }}
            aria-label="Guardar obra"
            className={`p-3 rounded-full backdrop-blur-md shadow-lg border active:scale-90 transition-[transform,background-color,border-color] duration-150 ease-[cubic-bezier(0.23,1,0.32,1)] ${
              isSaved
                ? 'bg-mnac-accent border-mnac-accent text-white'
                : 'bg-black/60 border-white/15 text-white hover:border-white'
            }`}
          >
            <Bookmark
              key={isSaved ? 'top-saved' : 'top-unsaved'}
              size={18}
              fill={isSaved ? 'currentColor' : 'none'}
              className={isSaved ? 'animate-bookmark-pop' : ''}
            />
          </button>
        </div>
      </div>

      {/* MAIN CONTENT */}
      <div className="pt-28 md:pt-32 pb-10 px-5 sm:px-6 md:px-12 max-w-[1920px] mx-auto">
        <div className="flex flex-col lg:flex-row gap-8 lg:gap-16 items-start">
          
          {/* IMAGE COLUMN */}
          <div className="w-full lg:w-1/2">
            <div className="relative overflow-hidden bg-mnac-surface shadow-2xl rounded-2xl border border-white/10">
              <OptimizedImage
                src={artwork.imageUrl}
                alt={artwork.title}
                priority={true}
                aspectRatio="aspect-[4/5] sm:aspect-auto"
                className="max-h-[65vh] lg:max-h-[78vh] w-full mx-auto"
              />
              <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between pointer-events-none">
                <span className="px-3 py-1.5 rounded-full bg-black/65 backdrop-blur-md border border-white/10 text-[10px] font-bold uppercase tracking-widest text-white">
                  {artwork.period} · {artwork.year}
                </span>
              </div>
            </div>
          </div>

          {/* TEXT & CONTROLS COLUMN */}
          <div className="w-full lg:w-1/2 flex flex-col animate-slide-up">
            <div className="flex items-center gap-3 mb-4">
              <span className="text-mnac-accent text-[10px] font-bold uppercase tracking-[0.25em] flex items-center gap-1.5">
                <Palette size={12} /> {artwork.period}
              </span>
              <span className="text-white/20">·</span>
              <span className="text-mnac-textSecondary text-xs font-mono font-semibold">{artwork.year}</span>
            </div>

            <h1 className="font-serif italic text-4xl sm:text-5xl md:text-7xl text-white mb-4 leading-[1.08] tracking-tight">
              {artwork.title}
            </h1>

            <p className="text-lg sm:text-xl font-sans font-normal text-mnac-secondary mb-6">
              {artwork.artist}
            </p>

            {/* Quick Reading Mode Toggle with Sliding Pill (Visitor) */}
            {userRole !== 'teacher' && (
              <div className="relative inline-grid grid-cols-2 self-start p-1 rounded-full bg-mnac-surface border border-white/10 mb-5">
                <div
                  aria-hidden="true"
                  className="absolute top-1 bottom-1 left-1 w-[calc(50%-0.25rem)] rounded-full bg-mnac-accent transition-transform duration-200 ease-[cubic-bezier(0.23,1,0.32,1)] pointer-events-none"
                  style={{
                    transform: !useSimpleText ? 'translateX(0%)' : 'translateX(100%)'
                  }}
                />
                <button
                  onClick={() => {
                    hapticService.light();
                    setUseSimpleText(false);
                  }}
                  className={`relative z-10 px-4 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-wider transition-colors duration-150 text-center ${
                    !useSimpleText ? 'text-white' : 'text-mnac-textSecondary hover:text-white'
                  }`}
                >
                  Curatorial
                </button>
                <button
                  onClick={() => {
                    hapticService.light();
                    setUseSimpleText(true);
                  }}
                  className={`relative z-10 px-4 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-wider flex items-center justify-center gap-1.5 transition-colors duration-150 ${
                    useSimpleText ? 'text-white' : 'text-mnac-textSecondary hover:text-white'
                  }`}
                >
                  <BookOpen size={11} /> Lectura Fácil
                </button>
              </div>
            )}

            <p
              key={useSimpleText ? 'simple' : 'curatorial'}
              className="text-mnac-textPrimary/90 leading-relaxed mb-6 text-base sm:text-lg font-light max-w-2xl animate-crossfade"
            >
              {activeDescription}
            </p>

            {/* Active Audio Indicator */}
            {isAudioPlaying && (
              <div className="mb-6 p-3.5 rounded-2xl bg-mnac-accent/15 border border-mnac-accent/35 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Volume2 size={18} className="text-mnac-accent animate-pulse" />
                  <span className="text-xs font-semibold text-white">Reproduciendo audioguía...</span>
                </div>
                <button
                  onClick={handlePrimaryAction}
                  className="text-[10px] font-bold uppercase tracking-widest text-mnac-accent"
                >
                  Pausar
                </button>
              </div>
            )}

            {/* Tags */}
            <div className="flex flex-wrap gap-2 mb-8">
              {artwork.tags.map((tag) => (
                <span
                  key={tag}
                  className="text-[10px] uppercase tracking-widest text-mnac-textSecondary bg-mnac-surface border border-white/10 px-3.5 py-1.5 rounded-full"
                >
                  {tag}
                </span>
              ))}
            </div>

            {/* Primary & Secondary Actions */}
            <div className="flex flex-col sm:flex-row gap-3 pt-6 border-t border-white/10">
              <button
                onClick={handlePrimaryAction}
                className="bg-mnac-accent text-white hover:opacity-90 active:scale-95 px-7 py-4 text-xs font-bold uppercase tracking-widest transition-all shadow-lg flex items-center justify-center gap-3 rounded-full"
              >
                {isGeneratingAudio ? (
                  <Loader2 size={16} className="animate-spin" />
                ) : isAudioPlaying ? (
                  <Pause size={16} />
                ) : userRole === 'teacher' ? (
                  <PlusCircle size={16} />
                ) : (
                  <Headphones size={16} />
                )}
                {userRole === 'teacher'
                  ? isSaved
                    ? 'Obra en tu Guía'
                    : 'Añadir a Guía'
                  : isAudioPlaying
                  ? 'Pausar Audio'
                  : 'Oír Audioguía'}
              </button>

              <button
                onClick={() => {
                  hapticService.medium();
                  onToggleSave(artwork.id);
                }}
                className={`px-7 py-4 text-xs font-bold uppercase tracking-widest border active:scale-95 transition-all flex items-center justify-center gap-3 rounded-full ${
                  isSaved
                    ? 'bg-transparent border-mnac-accent text-mnac-accent'
                    : 'bg-mnac-surface border-white/15 text-white hover:border-white/30'
                }`}
              >
                <Bookmark size={16} fill={isSaved ? 'currentColor' : 'none'} />
                {isSaved ? 'Guardado' : 'Guardar'}
              </button>
            </div>

            {/* Quick Contextual Links */}
            <div className="grid grid-cols-2 gap-3 mt-4">
              <Link
                to="/visit/map"
                onClick={() => hapticService.light()}
                className="flex items-center justify-center gap-2 p-3.5 rounded-2xl bg-mnac-surface border border-white/10 text-xs font-semibold text-mnac-textPrimary hover:border-white/25 active:scale-95 transition-all"
              >
                <MapPin size={15} className="text-mnac-accent" /> Ver en Mapa
              </Link>
              <Link
                to="/collection/ai-search"
                onClick={() => hapticService.light()}
                className="flex items-center justify-center gap-2 p-3.5 rounded-2xl bg-mnac-surface border border-white/10 text-xs font-semibold text-mnac-textPrimary hover:border-white/25 active:scale-95 transition-all"
              >
                <Sparkles size={15} className="text-mnac-accent" /> Preguntar a Palau
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* RELATED ARTWORKS - HORIZONTAL SNAP CAROUSEL */}
      {relatedArtworks.length > 0 && (
        <section className="py-10 border-t border-white/10 max-w-[1920px] mx-auto">
          <div className="px-5 sm:px-6 md:px-12 flex items-center justify-between mb-5">
            <h2 className="font-serif italic text-2xl md:text-3xl text-white tracking-tight">
              Obras Relacionadas
            </h2>
            <Link
              to="/collection"
              onClick={() => hapticService.light()}
              className="text-[10px] font-bold uppercase tracking-widest text-mnac-textSecondary hover:text-white flex items-center gap-1"
            >
              Ver todas <ArrowRight size={12} />
            </Link>
          </div>

          <div className="flex gap-4 overflow-x-auto snap-x snap-mandatory no-scrollbar px-5 sm:px-6 md:px-12 pb-2">
            {relatedArtworks.map((rel) => (
              <Link
                key={rel.id}
                to={`/artwork/${rel.id}`}
                onClick={() => hapticService.light()}
                className="shrink-0 w-[62vw] sm:w-[40vw] md:w-[250px] snap-start rounded-2xl overflow-hidden bg-mnac-surface border border-white/10 active:scale-95 transition-transform"
              >
                <div className="aspect-[3/4] overflow-hidden relative">
                  <OptimizedImage
                    src={rel.imageUrl}
                    alt={rel.title}
                    aspectRatio="h-full w-full"
                    className="opacity-90"
                  />
                  <span className="absolute top-3 left-3 px-2.5 py-1 rounded-full bg-black/60 backdrop-blur-md text-[10px] font-bold uppercase tracking-wider text-white">
                    {rel.period}
                  </span>
                </div>
                <div className="p-3.5">
                  <h4 className="text-sm font-semibold text-white truncate">{rel.title}</h4>
                  <p className="text-[11px] text-mnac-textSecondary truncate mt-0.5">
                    {rel.artist} · {rel.year}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}

      <Footer role={userRole} />
    </div>
  );
};

export default ArtworkDetail;
