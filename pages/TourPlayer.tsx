import React, { useState, useEffect, useRef, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { TOURS_DATA } from '../data/tours';
import { ARTWORKS_DATA } from '../data/artworks';
import { ARTWORK_LOCATIONS, LEVEL_INFO } from '../data/museumMap';
import {
  generateTourScript,
  textToSpeech,
  getPreloadedAudioPath,
  getVoiceDisplayName,
  TTS_VOICES,
  TtsVoiceName
} from '../services/geminiService';
import { UserRole } from '../types';
import {
  X,
  Play,
  Pause,
  SkipForward,
  SkipBack,
  Sparkles,
  MapPin,
  Volume2,
  Loader2,
  Map as MapIcon,
  Image as ImageIcon,
  Navigation,
  SlidersHorizontal
} from 'lucide-react';
import HairlineMuseumMap, { MuseumPoint } from '../components/HairlineMuseumMap';
import { hapticService } from '../services/hapticService';

interface TourPlayerProps {
  userRole: UserRole;
}

const SPEEDS = [0.9, 1, 1.2] as const;

function pickBestSpanishVoice(): { voice: SpeechSynthesisVoice | null; label: string } {
  if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
    return { voice: null, label: 'Texto' };
  }
  const voices = window.speechSynthesis.getVoices();
  const esVoices = voices.filter((v) => v.lang.toLowerCase().startsWith('es'));
  if (esVoices.length === 0) return { voice: null, label: 'Voz del Sistema' };

  const preferredKeywords = [
    'natural',
    'neural',
    'enhanced',
    'premium',
    'mónica',
    'monica',
    'jorge',
    'paulina',
    'luciana',
    'elena',
    'google español'
  ];

  const scored = esVoices
    .map((v) => {
      const nameLower = v.name.toLowerCase();
      let score = v.lang.toLowerCase() === 'es-es' ? 10 : 5;
      preferredKeywords.forEach((kw, idx) => {
        if (nameLower.includes(kw)) score += 30 - idx;
      });
      if (!v.localService) score += 8;
      return { v, score };
    })
    .sort((a, b) => b.score - a.score);

  const chosen = scored[0].v;
  return { voice: chosen, label: chosen.name.replace(/Apple |Microsoft |Google /g, '').slice(0, 22) };
}

const TourPlayer: React.FC<TourPlayerProps> = ({ userRole }) => {
  const { tourId } = useParams<{ tourId: string }>();
  const navigate = useNavigate();

  const [currentTour, setCurrentTour] = useState(() => TOURS_DATA.find((t) => t.id === tourId));

  useEffect(() => {
    if (tourId === 'custom') {
      const stored = localStorage.getItem('custom_tour_data');
      if (stored) {
        setCurrentTour(JSON.parse(stored));
      } else {
        navigate('/tours');
      }
    } else {
      setCurrentTour(TOURS_DATA.find((t) => t.id === tourId));
    }
  }, [tourId, navigate]);

  const [currentStopIndex, setCurrentStopIndex] = useState(0);
  const [viewMode, setViewMode] = useState<'artwork' | 'map'>('artwork');

  // Audio & Voice state
  const [selectedVoice, setSelectedVoice] = useState<TtsVoiceName>('Aoede');
  const [playbackSpeed, setPlaybackSpeed] = useState<number>(1);
  const [showVoiceSettings, setShowVoiceSettings] = useState(false);

  const [isPlaying, setIsPlaying] = useState(false);
  const [script, setScript] = useState<string>('');
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [voiceEngineLabel, setVoiceEngineLabel] = useState<string>('Voz Neuronal · Elvira');

  const [isGeneratingScript, setIsGeneratingScript] = useState(true);
  const [isGeneratingAudio, setIsGeneratingAudio] = useState(false);
  const [progress, setProgress] = useState(0);

  // Map view state
  const [mapLevel, setMapLevel] = useState<0 | 1>(0);
  const [mapScale, setMapScale] = useState(1);
  const [mapPan, setMapPan] = useState({ x: 0, y: 0 });

  const audioRef = useRef<HTMLAudioElement | null>(null);
  const scriptCacheRef = useRef<Map<string, string>>(new Map());
  const speechTimerRef = useRef<number | null>(null);
  const usingSpeechFallbackRef = useRef(false);

  const currentArtworkId = currentTour?.stops[currentStopIndex];
  const currentArtwork = ARTWORKS_DATA.find((a) => a.id === currentArtworkId);
  const currentLocation = currentArtworkId ? ARTWORK_LOCATIONS[currentArtworkId] : undefined;

  const nextArtworkId =
    currentTour && currentStopIndex < currentTour.stops.length - 1
      ? currentTour.stops[currentStopIndex + 1]
      : undefined;
  const nextArtwork = nextArtworkId ? ARTWORKS_DATA.find((a) => a.id === nextArtworkId) : undefined;
  const nextLocation = nextArtworkId ? ARTWORK_LOCATIONS[nextArtworkId] : undefined;

  // Build map points & ordered tour path for HairlineMuseumMap
  const { tourMapPoints, tourRoutePoints } = useMemo(() => {
    if (!currentTour) return { tourMapPoints: [], tourRoutePoints: [] };
    const pts: MuseumPoint[] = [];
    const route: { id: string; level: 0 | 1; x: number; y: number }[] = [];

    currentTour.stops.forEach((stopId, idx) => {
      const art = ARTWORKS_DATA.find((a) => a.id === stopId);
      const loc = ARTWORK_LOCATIONS[stopId];
      if (!art || !loc) return;
      pts.push({
        id: stopId,
        level: loc.level,
        category: idx === currentStopIndex ? 'art' : 'service',
        roomCode: `Parada ${idx + 1} · ${loc.roomCode}`,
        wing: loc.wing,
        title: art.title,
        subtitle: art.artist,
        desc: art.description,
        directions: loc.directions,
        walkTime: loc.walkTime,
        x: loc.x,
        y: loc.y,
        artworkId: art.id,
        image: art.imageUrl
      });
      route.push({ id: stopId, level: loc.level, x: loc.x, y: loc.y });
    });

    return { tourMapPoints: pts, tourRoutePoints: route };
  }, [currentTour, currentStopIndex]);

  // Keep map floor aligned with current stop
  useEffect(() => {
    if (currentLocation) {
      setMapLevel(currentLocation.level);
    }
  }, [currentStopIndex, currentLocation]);

  const stopSpeechSynthesis = () => {
    if (speechTimerRef.current) {
      window.clearInterval(speechTimerRef.current);
      speechTimerRef.current = null;
    }
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
  };

  const startSpeechFallback = (textToRead: string, speed: number) => {
    stopSpeechSynthesis();
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) return;

    usingSpeechFallbackRef.current = true;
    const { voice, label } = pickBestSpanishVoice();
    setVoiceEngineLabel(`Voz Neuronal · ${label}`);

    const utterance = new SpeechSynthesisUtterance(textToRead);
    if (voice) utterance.voice = voice;
    utterance.lang = voice?.lang || 'es-ES';
    utterance.rate = speed;
    utterance.pitch = 1.0;

    const estimatedMs = Math.max(4000, (textToRead.length / 13) * 1000 / speed);
    const startTs = performance.now();

    speechTimerRef.current = window.setInterval(() => {
      const pct = Math.min(98, ((performance.now() - startTs) / estimatedMs) * 100);
      setProgress(pct);
    }, 150);

    utterance.onend = () => {
      if (speechTimerRef.current) window.clearInterval(speechTimerRef.current);
      setIsPlaying(false);
      setProgress(100);
    };
    utterance.onerror = () => {
      if (speechTimerRef.current) window.clearInterval(speechTimerRef.current);
      setIsPlaying(false);
    };

    window.speechSynthesis.speak(utterance);
    setIsPlaying(true);
  };

  // Load stop script + TTS audio & preload next stop
  useEffect(() => {
    if (!currentArtwork) return;
    let cancelled = false;
    let createdBlobUrl: string | null = null;

    const loadContent = async () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.currentTime = 0;
      }
      stopSpeechSynthesis();
      usingSpeechFallbackRef.current = false;
      setIsPlaying(false);
      setAudioUrl(null);
      setProgress(0);

      const narratorName = getVoiceDisplayName(selectedVoice);
      const preloadedUrl = getPreloadedAudioPath(currentArtwork.id, selectedVoice);
      let hasPreloadedAudio = false;
      try {
        const headRes = await fetch(preloadedUrl, { method: 'HEAD' });
        const contentType = headRes.headers.get('content-type') || '';
        hasPreloadedAudio = headRes.ok && !contentType.includes('text/html');
      } catch {
        hasPreloadedAudio = false;
      }
      if (cancelled) return;

      if (hasPreloadedAudio) {
        const curatedScript = `${currentArtwork.title}, de ${currentArtwork.artist}, año ${currentArtwork.year}. ${currentArtwork.description}`;
        setScript(curatedScript);
        setIsGeneratingScript(false);
        usingSpeechFallbackRef.current = false;
        setVoiceEngineLabel(`Voz Neuronal · ${narratorName}`);
        setAudioUrl(preloadedUrl);
        setIsPlaying(true);
        setIsGeneratingAudio(false);
        return;
      }

      const cacheKey = `${currentArtwork.id}-${userRole || 'visitor'}`;
      let text = scriptCacheRef.current.get(cacheKey);
      if (!text) {
        setIsGeneratingScript(true);
        text = await generateTourScript(currentArtwork, userRole);
        if (cancelled) return;
        scriptCacheRef.current.set(cacheKey, text);
      }
      setScript(text);
      setIsGeneratingScript(false);

      // Generate expressive Gemini TTS audio
      setIsGeneratingAudio(true);
      const url = await textToSpeech(text, selectedVoice);
      if (cancelled) {
        if (url) URL.revokeObjectURL(url);
        return;
      }

      if (url) {
        createdBlobUrl = url;
        usingSpeechFallbackRef.current = false;
        setVoiceEngineLabel(`Gemini 2.5 TTS · ${narratorName}`);
        setAudioUrl(url);
        setIsPlaying(true);
      } else {
        // Fallback to best Spanish neural browser voice (never silent)
        startSpeechFallback(text, playbackSpeed);
      }
      setIsGeneratingAudio(false);

      // Preload next stop script in background
      if (nextArtwork) {
        const nextKey = `${nextArtwork.id}-${userRole || 'visitor'}`;
        if (!scriptCacheRef.current.has(nextKey)) {
          generateTourScript(nextArtwork, userRole).then((nextText) => {
            scriptCacheRef.current.set(nextKey, nextText);
          });
        }
      }
    };

    loadContent();

    return () => {
      cancelled = true;
      stopSpeechSynthesis();
      if (createdBlobUrl) URL.revokeObjectURL(createdBlobUrl);
    };
  }, [currentStopIndex, currentArtwork, userRole, selectedVoice]);

  // Sync HTML5 audio playback & speed
  useEffect(() => {
    if (!audioRef.current || usingSpeechFallbackRef.current) return;
    audioRef.current.playbackRate = playbackSpeed;

    if (isPlaying) {
      const playPromise = audioRef.current.play();
      if (playPromise !== undefined) {
        playPromise.catch(() => setIsPlaying(false));
      }
    } else {
      audioRef.current.pause();
    }
  }, [isPlaying, audioUrl, playbackSpeed]);

  const handleTimeUpdate = () => {
    if (audioRef.current && audioRef.current.duration) {
      const p = (audioRef.current.currentTime / audioRef.current.duration) * 100;
      setProgress(p || 0);
    }
  };

  const handleAudioEnded = () => {
    setIsPlaying(false);
    setProgress(100);
  };

  const togglePlay = () => {
    if (isGeneratingScript || isGeneratingAudio) return;
    hapticService.light();

    if (usingSpeechFallbackRef.current) {
      if (isPlaying) {
        if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
          window.speechSynthesis.pause();
        }
        setIsPlaying(false);
      } else {
        if (typeof window !== 'undefined' && 'speechSynthesis' in window && window.speechSynthesis.paused) {
          window.speechSynthesis.resume();
          setIsPlaying(true);
        } else if (script) {
          startSpeechFallback(script, playbackSpeed);
        }
      }
      return;
    }

    setIsPlaying((prev) => !prev);
  };

  const handleSelectStop = (index: number) => {
    if (!currentTour || index < 0 || index >= currentTour.stops.length) return;
    hapticService.light();
    setCurrentStopIndex(index);
  };

  const handleNext = () => {
    if (currentTour && currentStopIndex < currentTour.stops.length - 1) {
      handleSelectStop(currentStopIndex + 1);
    }
  };

  const handlePrev = () => {
    if (currentStopIndex > 0) {
      handleSelectStop(currentStopIndex - 1);
    }
  };

  if (!currentTour || !currentArtwork) {
    return (
      <div className="text-white p-8 flex items-center justify-center h-[100dvh] bg-mnac-bg">
        <Loader2 className="animate-spin mr-2 text-mnac-accent" /> Cargando ruta...
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-[100] bg-mnac-bg text-mnac-textPrimary flex flex-col animate-fade-in">
      {audioUrl && (
        <audio
          ref={audioRef}
          src={audioUrl}
          onTimeUpdate={handleTimeUpdate}
          onEnded={handleAudioEnded}
        />
      )}

      {/* BACKGROUND ARTWORK (VISIBLE IN ARTWORK MODE) */}
      <div
        className={`absolute inset-0 z-0 transition-opacity duration-300 ${
          viewMode === 'artwork' ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
      >
        <img
          src={currentArtwork.imageUrl}
          alt={currentArtwork.title}
          className="w-full h-full object-cover opacity-55 transition-opacity duration-700"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-mnac-bg via-mnac-bg/45 to-black/50" />
      </div>

      {/* TOP BAR: STOP BADGE, SLIDING VIEW PILL (OBRA | MAPA), CLOSE */}
      <div className="relative z-30 flex justify-between items-center gap-3 px-4 pt-safe pb-3 sm:px-6 md:px-8">
        <div className="flex items-center gap-2 bg-mnac-surface/90 backdrop-blur-md px-3.5 py-2 rounded-full border border-white/10">
          <div className="w-2 h-2 rounded-full bg-mnac-accent animate-pulse" />
          <span className="text-[11px] font-bold uppercase tracking-widest text-white tabular-nums">
            {currentStopIndex + 1} / {currentTour.stops.length}
          </span>
        </div>

        {/* Sliding Pill Switcher: Obra | Mapa de Ruta */}
        <div className="relative grid grid-cols-2 p-1 rounded-full bg-mnac-surface/90 backdrop-blur-md border border-white/10">
          <div
            aria-hidden="true"
            className="absolute top-1 bottom-1 left-1 w-[calc(50%-0.25rem)] rounded-full bg-mnac-accent shadow transition-transform duration-200 ease-[cubic-bezier(0.23,1,0.32,1)] pointer-events-none"
            style={{ transform: viewMode === 'artwork' ? 'translateX(0%)' : 'translateX(100%)' }}
          />
          <button
            onClick={() => {
              hapticService.light();
              setViewMode('artwork');
            }}
            className={`relative z-10 px-3.5 py-1.5 rounded-full text-[11px] font-bold uppercase tracking-wider flex items-center justify-center gap-1.5 transition-colors ${
              viewMode === 'artwork' ? 'text-white' : 'text-mnac-textSecondary hover:text-white'
            }`}
          >
            <ImageIcon size={13} /> Obra
          </button>
          <button
            onClick={() => {
              hapticService.light();
              setViewMode('map');
            }}
            className={`relative z-10 px-3.5 py-1.5 rounded-full text-[11px] font-bold uppercase tracking-wider flex items-center justify-center gap-1.5 transition-colors ${
              viewMode === 'map' ? 'text-white' : 'text-mnac-textSecondary hover:text-white'
            }`}
          >
            <MapIcon size={13} /> Mapa
          </button>
        </div>

        <button
          onClick={() => {
            hapticService.light();
            stopSpeechSynthesis();
            navigate(-1);
          }}
          aria-label="Cerrar recorrido"
          className="w-11 h-11 flex items-center justify-center rounded-full bg-mnac-surface/90 hover:bg-white/15 backdrop-blur-md active:scale-90 transition-transform border border-white/10 text-white shrink-0"
        >
          <X size={20} />
        </button>
      </div>

      {/* MIDDLE AREA: SWITCHES CLEANLY BETWEEN ARTWORK & INTERACTIVE ROUTE MAP */}
      {viewMode === 'artwork' ? (
        <div className="flex-1 relative z-10 flex flex-col justify-end pb-6 px-5 sm:px-8 md:px-16">
          <div className="max-w-4xl mx-auto w-full animate-crossfade">
            {currentLocation && (
              <button
                onClick={() => {
                  hapticService.light();
                  setViewMode('map');
                }}
                className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-mnac-surface/90 backdrop-blur-md border border-white/15 text-[11px] font-bold uppercase tracking-wider text-white mb-4 active:scale-95 transition-transform"
              >
                <MapPin size={13} className="text-mnac-accent" />
                <span>{currentLocation.roomCode} · {currentLocation.wing}</span>
                <span className="text-mnac-accent">Ver mapa →</span>
              </button>
            )}
            <h1 className="font-serif italic text-4xl sm:text-5xl md:text-7xl mb-2 text-white leading-[1.05]">
              {currentArtwork.title}
            </h1>
            <p className="text-mnac-secondary text-sm md:text-lg font-normal tracking-wide tabular-nums">
              {currentArtwork.artist} · {currentArtwork.year}
            </p>
          </div>
        </div>
      ) : (
        <div className="flex-1 relative z-10 flex flex-col overflow-hidden animate-crossfade">
          {/* Interactive Tour Blueprint */}
          <div className="flex-1 relative min-h-0">
            <HairlineMuseumMap
              points={tourMapPoints}
              activeLevel={mapLevel}
              explodedView={false}
              selectedId={currentArtwork.id}
              onSelectPoint={(stopId) => {
                const idx = currentTour.stops.indexOf(stopId);
                if (idx !== -1) handleSelectStop(idx);
              }}
              scale={mapScale}
              onScaleChange={setMapScale}
              pan={mapPan}
              onPanChange={setMapPan}
              showRoute={true}
              tourRoutePoints={tourRoutePoints}
            />

            {/* Level Pill on Map */}
            <div className="absolute top-2 left-4 right-4 flex items-center justify-between pointer-events-none">
              <div className="pointer-events-auto flex items-center gap-1 bg-mnac-surface/95 backdrop-blur-md border border-white/15 rounded-full p-1">
                {([0, 1] as const).map((lvl) => (
                  <button
                    key={lvl}
                    onClick={() => {
                      hapticService.light();
                      setMapLevel(lvl);
                    }}
                    className={`px-3 py-1 rounded-full text-[11px] font-bold transition-colors ${
                      mapLevel === lvl ? 'bg-mnac-accent text-white' : 'text-mnac-textSecondary'
                    }`}
                  >
                    {LEVEL_INFO[lvl].short}
                  </button>
                ))}
              </div>
              <span className="px-3 py-1.5 rounded-full bg-mnac-surface/90 border border-white/10 text-[10px] font-mono text-mnac-secondary">
                {currentLocation ? currentLocation.roomCode : 'MNAC'}
              </span>
            </div>
          </div>

          {/* Next-Stop Wayfinding Strip & Stop Selector */}
          <div className="px-4 sm:px-6 pb-3 space-y-2.5 max-w-4xl mx-auto w-full">
            {nextArtwork && nextLocation ? (
              <div className="p-3.5 rounded-2xl bg-mnac-surface/95 border border-white/12 flex items-center justify-between gap-3">
                <div className="min-w-0">
                  <div className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-widest text-mnac-accent mb-0.5">
                    <Navigation size={11} /> Siguiente parada ({currentStopIndex + 2}/{currentTour.stops.length}) · {nextLocation.walkTime}
                  </div>
                  <p className="text-xs font-semibold text-white truncate">
                    {nextArtwork.title} — {nextLocation.roomCode} ({nextLocation.wing})
                  </p>
                  <p className="text-[11px] text-mnac-textSecondary truncate mt-0.5">
                    {nextLocation.directions[0]}
                  </p>
                </div>
                <button
                  onClick={handleNext}
                  className="px-4 py-2 rounded-full bg-mnac-accent text-white text-[10px] font-bold uppercase tracking-wider shrink-0 active:scale-95 transition-transform"
                >
                  Ir →
                </button>
              </div>
            ) : (
              <div className="p-3 rounded-2xl bg-mnac-surface/95 border border-emerald-400/25 text-xs text-emerald-300 font-medium text-center">
                Última parada del recorrido · Salida por Vestíbulo Norte (P0)
              </div>
            )}

            {/* Tap-to-jump Stop Pills */}
            <div className="flex gap-2 overflow-x-auto no-scrollbar pb-0.5">
              {tourMapPoints.map((pt, idx) => {
                const isCurrent = idx === currentStopIndex;
                return (
                  <button
                    key={pt.id}
                    onClick={() => handleSelectStop(idx)}
                    className={`shrink-0 px-3.5 py-2 rounded-full text-[11px] font-semibold border active:scale-95 transition-all tabular-nums ${
                      isCurrent
                        ? 'bg-white text-black border-white font-bold'
                        : 'bg-mnac-surface/90 text-mnac-textSecondary border-white/10 hover:text-white'
                    }`}
                  >
                    {idx + 1}. {pt.title}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* BOTTOM AUDIO PLAYER DOCK */}
      <div className="relative z-20 bg-mnac-surface/95 backdrop-blur-xl border-t border-white/10 px-5 pb-safe pt-5 md:px-12 rounded-t-2xl shadow-[0_-16px_40px_rgba(0,0,0,0.5)]">
        {/* Progress Bar */}
        <div
          className="absolute top-0 left-0 w-full h-1.5 bg-white/10 cursor-pointer group"
          onClick={(e) => {
            if (audioRef.current && audioRef.current.duration) {
              const rect = e.currentTarget.getBoundingClientRect();
              const percent = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
              audioRef.current.currentTime = percent * audioRef.current.duration;
            }
          }}
        >
          <div
            className="h-full bg-mnac-accent transition-[width] duration-150 ease-linear relative"
            style={{ width: `${progress}%` }}
          />
        </div>

        <div className="max-w-4xl mx-auto pb-3">
          {/* Script Preview (Compact in Map mode, Full in Artwork mode) */}
          <div className={`${viewMode === 'map' ? 'mb-3' : 'mb-5 min-h-[64px]'} flex items-center justify-center`}>
            {isGeneratingScript ? (
              <div className="flex items-center gap-2.5 text-mnac-accent animate-pulse">
                <Sparkles size={16} />
                <span className="text-xs font-bold uppercase tracking-widest">Preparando narración...</span>
              </div>
            ) : (
              <p
                className={`text-center text-mnac-textPrimary/90 leading-relaxed font-light max-w-2xl mx-auto ${
                  viewMode === 'map' ? 'text-xs line-clamp-2' : 'text-sm md:text-base line-clamp-3 md:line-clamp-none'
                }`}
              >
                "{script}"
              </p>
            )}
          </div>

          {/* Voice & Speed Popover */}
          {showVoiceSettings && (
            <div className="mb-4 p-3.5 rounded-2xl bg-mnac-bg border border-white/10 space-y-3 animate-modal-in">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold uppercase tracking-widest text-mnac-textSecondary">
                  Narrador & Velocidad
                </span>
                <div className="flex gap-1.5">
                  {SPEEDS.map((spd) => (
                    <button
                      key={spd}
                      onClick={() => {
                        hapticService.light();
                        setPlaybackSpeed(spd);
                      }}
                      className={`px-2.5 py-1 rounded-full text-[11px] font-bold tabular-nums border ${
                        playbackSpeed === spd
                          ? 'bg-mnac-accent text-white border-mnac-accent'
                          : 'bg-mnac-surface text-mnac-textSecondary border-white/10'
                      }`}
                    >
                      {spd}x
                    </button>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-3 gap-2">
                {TTS_VOICES.map((v) => (
                  <button
                    key={v.id}
                    onClick={() => {
                      hapticService.light();
                      setSelectedVoice(v.id);
                    }}
                    className={`p-2.5 rounded-xl border text-left transition-colors ${
                      selectedVoice === v.id
                        ? 'bg-mnac-accent/15 border-mnac-accent text-white'
                        : 'bg-mnac-surface border-white/10 text-mnac-textSecondary hover:text-white'
                    }`}
                  >
                    <span className="block text-xs font-bold">{v.label}</span>
                    <span className="block text-[10px] opacity-80">{v.desc}</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Main Playback Controls */}
          <div className="flex items-center justify-center gap-8 md:gap-12">
            <button
              onClick={handlePrev}
              disabled={currentStopIndex === 0}
              aria-label="Parada anterior"
              className="w-11 h-11 flex items-center justify-center text-mnac-textSecondary hover:text-white disabled:opacity-30 transition-colors active:scale-90"
            >
              <SkipBack size={26} />
            </button>

            <button
              onClick={togglePlay}
              disabled={isGeneratingScript || isGeneratingAudio}
              aria-label={isPlaying ? 'Pausar audioguía' : 'Reproducir audioguía'}
              className="w-16 h-16 bg-mnac-accent text-white rounded-full flex items-center justify-center transition-transform duration-150 ease-[cubic-bezier(0.23,1,0.32,1)] shadow-lg disabled:opacity-50 active:scale-[0.94]"
            >
              {isGeneratingAudio ? (
                <Loader2 size={28} className="animate-spin text-white" />
              ) : isPlaying ? (
                <Pause size={28} fill="currentColor" />
              ) : (
                <Play size={28} fill="currentColor" className="ml-0.5" />
              )}
            </button>

            <button
              onClick={handleNext}
              disabled={currentStopIndex === currentTour.stops.length - 1}
              aria-label="Siguiente parada"
              className="w-11 h-11 flex items-center justify-center text-mnac-textSecondary hover:text-white disabled:opacity-30 transition-colors active:scale-90"
            >
              <SkipForward size={26} />
            </button>
          </div>

          {/* Footer Metadata + Voice Switcher Trigger */}
          <div className="mt-4 flex justify-between items-center text-[11px] text-mnac-textSecondary font-semibold">
            <button
              onClick={() => {
                hapticService.light();
                setViewMode(viewMode === 'artwork' ? 'map' : 'artwork');
              }}
              className="flex items-center gap-1.5 hover:text-white transition-colors tabular-nums"
            >
              <MapPin size={13} className="text-mnac-accent" />
              <span>{currentLocation ? currentLocation.roomCode : 'MNAC'}</span>
            </button>

            <button
              onClick={() => {
                hapticService.light();
                setShowVoiceSettings(!showVoiceSettings);
              }}
              className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-mnac-bg border border-white/10 hover:border-white/25 text-white transition-colors"
            >
              <Volume2 size={13} className="text-mnac-accent" />
              <span className="truncate max-w-[165px]">{voiceEngineLabel}</span>
              <SlidersHorizontal size={11} className="opacity-70" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TourPlayer;
