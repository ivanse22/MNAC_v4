import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { TOURS_DATA } from '../data/tours';
import { ARTWORKS_DATA } from '../data/artworks';
import { generateTourScript, textToSpeech } from '../services/geminiService';
import { UserRole } from '../types';
import { X, Play, Pause, SkipForward, SkipBack, Sparkles, MapPin, Info, Loader2 } from 'lucide-react';

interface TourPlayerProps {
  userRole: UserRole;
}

const TourPlayer: React.FC<TourPlayerProps> = ({ userRole }) => {
  const { tourId } = useParams<{ tourId: string }>();
  const navigate = useNavigate();
  
  // Custom Tour Logic
  const [currentTour, setCurrentTour] = useState(TOURS_DATA.find(t => t.id === tourId));
  
  useEffect(() => {
    if (tourId === 'custom') {
      const stored = localStorage.getItem('custom_tour_data');
      if (stored) {
        setCurrentTour(JSON.parse(stored));
      } else {
        // Fallback if no custom tour data found
        navigate('/tours');
      }
    } else {
      setCurrentTour(TOURS_DATA.find(t => t.id === tourId));
    }
  }, [tourId, navigate]);

  const [currentStopIndex, setCurrentStopIndex] = useState(0);
  
  const [isPlaying, setIsPlaying] = useState(false);
  const [script, setScript] = useState<string>("");
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  
  const [isGeneratingScript, setIsGeneratingScript] = useState(true);
  const [isGeneratingAudio, setIsGeneratingAudio] = useState(false);
  
  const [progress, setProgress] = useState(0);
  
  // HTML5 Audio Reference
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Resolve current artwork
  const currentArtworkId = currentTour?.stops[currentStopIndex];
  const currentArtwork = ARTWORKS_DATA.find(a => a.id === currentArtworkId);

  // --- EFFECT: Load Content when stop changes ---
  useEffect(() => {
    if (!currentArtwork) return;

    const loadContent = async () => {
      // Reset State
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.currentTime = 0;
      }
      setIsPlaying(false);
      setScript("");
      setAudioUrl(null);
      setProgress(0);
      setIsGeneratingScript(true);
      setIsGeneratingAudio(false);

      // 1. Generate Script
      const text = await generateTourScript(currentArtwork, userRole);
      setScript(text);
      setIsGeneratingScript(false);

      // 2. Generate Audio (AI Voice)
      setIsGeneratingAudio(true);
      const url = await textToSpeech(text);
      
      if (url) {
        setAudioUrl(url);
        // Auto-play when ready
        setIsPlaying(true);
      }
      setIsGeneratingAudio(false);
    };

    loadContent();

    return () => {
      if (audioUrl) URL.revokeObjectURL(audioUrl);
    };
  }, [currentStopIndex, currentArtwork, userRole]);

  // --- EFFECT: Audio Control ---
  useEffect(() => {
    if (!audioRef.current) return;

    if (isPlaying) {
      const playPromise = audioRef.current.play();
      if (playPromise !== undefined) {
        playPromise.catch(error => {
          console.log("Autoplay prevented:", error);
          setIsPlaying(false);
        });
      }
    } else {
      audioRef.current.pause();
    }
  }, [isPlaying, audioUrl]);

  // --- HANDLERS ---
  const handleTimeUpdate = () => {
    if (audioRef.current) {
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
    setIsPlaying(!isPlaying);
  };

  const handleNext = () => {
    if (currentTour && currentStopIndex < currentTour.stops.length - 1) {
      setCurrentStopIndex(prev => prev + 1);
    }
  };

  const handlePrev = () => {
    if (currentStopIndex > 0) {
      setCurrentStopIndex(prev => prev - 1);
    }
  };

  if (!currentTour || !currentArtwork) return <div className="text-white p-8 flex items-center justify-center h-screen bg-black"><Loader2 className="animate-spin mr-2" /> Cargando ruta...</div>;

  return (
    <div className="fixed inset-0 z-[100] bg-black text-white flex flex-col animate-fade-in">
      
      {/* Hidden Audio Element */}
      {audioUrl && (
        <audio 
            ref={audioRef} 
            src={audioUrl} 
            onTimeUpdate={handleTimeUpdate} 
            onEnded={handleAudioEnded}
        />
      )}

      {/* BACKGROUND IMAGE - Full Screen */}
      <div className="absolute inset-0 z-0">
        <img 
          src={currentArtwork.imageUrl} 
          alt={currentArtwork.title} 
          className="w-full h-full object-cover opacity-60 transition-opacity duration-1000"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-black/30"></div>
        <div className="absolute inset-0 bg-transparent animate-scale-slow mix-blend-overlay opacity-20 pointer-events-none"></div>
      </div>

      {/* TOP BAR */}
      <div className="relative z-20 flex justify-between items-center p-6 md:p-8">
         <div className="flex items-center gap-3 bg-black/40 backdrop-blur-md px-4 py-2 rounded-full border border-white/10">
             <div className="w-2 h-2 rounded-full bg-mnac-red animate-pulse"></div>
             <span className="text-[10px] font-bold uppercase tracking-widest text-gray-200">
                Parada {currentStopIndex + 1} / {currentTour.stops.length}
             </span>
         </div>
         
         <button 
           onClick={() => { navigate(-1); }}
           className="w-10 h-10 flex items-center justify-center rounded-full bg-white/10 hover:bg-white/20 backdrop-blur-md transition-all border border-white/10"
         >
            <X size={20} />
         </button>
      </div>

      {/* MIDDLE: Artwork Title */}
      <div className="flex-1 relative z-10 flex flex-col justify-center px-8 md:px-24 pointer-events-none">
         <div className="animate-slide-up">
            {tourId === 'custom' && (
                <span className="text-mnac-gold text-[10px] font-bold uppercase tracking-widest mb-2 block animate-pulse">
                    Ruta Generada por IA: {currentTour.title}
                </span>
            )}
            <h1 className="font-sans font-black text-4xl md:text-7xl mb-2 text-white drop-shadow-2xl tracking-tight">
               {currentArtwork.title}
            </h1>
            <p className="text-gray-300 text-sm md:text-lg font-light uppercase tracking-widest">
               {currentArtwork.artist}, {currentArtwork.year}
            </p>
         </div>
      </div>

      {/* BOTTOM CONTROLS */}
      <div className="relative z-20 bg-black/80 backdrop-blur-xl border-t border-white/10 px-6 pb-8 pt-6 md:px-12 rounded-t-3xl shadow-[0_-10px_40px_rgba(0,0,0,0.5)]">
         
         {/* Progress Bar */}
         <div 
           className="absolute top-0 left-0 w-full h-1.5 bg-gray-800 cursor-pointer group"
           onClick={(e) => {
             if (audioRef.current) {
                const rect = e.currentTarget.getBoundingClientRect();
                const x = e.clientX - rect.left;
                const width = rect.width;
                const percent = x / width;
                audioRef.current.currentTime = percent * audioRef.current.duration;
             }
           }}
         >
            <div 
               className="h-full bg-mnac-red transition-all duration-100 ease-linear relative" 
               style={{ width: `${progress}%` }}
            >
               <div className="absolute right-0 top-1/2 -translate-y-1/2 w-3 h-3 bg-white rounded-full shadow opacity-0 group-hover:opacity-100 transition-opacity"></div>
            </div>
         </div>

         <div className="max-w-4xl mx-auto">
            {/* Script Display */}
            <div className="mb-8 min-h-[80px] md:min-h-[100px] flex items-center justify-center">
               {isGeneratingScript ? (
                  <div className="flex items-center gap-3 text-mnac-gold animate-pulse">
                     <Sparkles size={18} />
                     <span className="text-sm font-bold uppercase tracking-widest">Palau está analizando la obra...</span>
                  </div>
               ) : (
                  <p className="text-center text-gray-300 text-sm md:text-lg leading-relaxed font-light animate-fade-in max-w-2xl mx-auto line-clamp-4 md:line-clamp-none">
                     "{script}"
                  </p>
               )}
            </div>

            {/* Controls */}
            <div className="flex items-center justify-center gap-8 md:gap-12">
               <button 
                 onClick={handlePrev}
                 disabled={currentStopIndex === 0}
                 className="text-gray-400 hover:text-white disabled:opacity-30 transition-colors active:scale-90"
               >
                  <SkipBack size={28} />
               </button>

               <button 
                 onClick={togglePlay}
                 disabled={isGeneratingScript || isGeneratingAudio}
                 className={`w-16 h-16 md:w-20 md:h-20 bg-white text-mnac-dark rounded-full flex items-center justify-center transition-all shadow-[0_0_30px_rgba(255,255,255,0.2)] disabled:opacity-50 disabled:scale-100 ${isPlaying ? 'scale-100' : 'hover:scale-105'}`}
               >
                  {isGeneratingAudio ? (
                     <Loader2 size={32} className="animate-spin text-mnac-red" />
                  ) : isPlaying ? (
                     <Pause size={32} fill="currentColor" />
                  ) : (
                     <Play size={32} fill="currentColor" className="ml-1" />
                  )}
               </button>

               <button 
                 onClick={handleNext}
                 disabled={currentStopIndex === currentTour.stops.length - 1}
                 className="text-gray-400 hover:text-white disabled:opacity-30 transition-colors active:scale-90"
               >
                  <SkipForward size={28} />
               </button>
            </div>
            
            {/* Footer Metadata */}
            <div className="mt-8 flex justify-between items-center text-[10px] text-gray-500 font-bold uppercase tracking-widest">
               <div className="flex items-center gap