
import React, { useEffect, useState, useRef } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, Bookmark, Share2, Info, Calendar, User as UserIcon, Palette, Download, PlusCircle, Headphones, Map, Check, Pause, Loader2, Tag } from 'lucide-react';
import { UserRole } from '../types';
import { ARTWORKS_DATA } from '../data/artworks';
import ArtCard from '../components/ArtCard';
import Footer from '../components/Footer';
import { generateTourScript, textToSpeech } from '../services/geminiService';
import OptimizedImage from '../components/OptimizedImage';

interface ArtworkDetailProps {
  userRole: UserRole;
  easyReading: boolean;
  savedArtIds: string[];
  onToggleSave: (id: string) => void;
  onVisit?: (id: string) => void;
}

const ArtworkDetail: React.FC<ArtworkDetailProps> = ({ userRole, easyReading, savedArtIds, onToggleSave, onVisit }) => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  
  const [isAudioPlaying, setIsAudioPlaying] = useState(false);
  const [isGeneratingAudio, setIsGeneratingAudio] = useState(false);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const artwork = ARTWORKS_DATA.find(a => a.id === id);
  const isSaved = artwork ? savedArtIds.includes(artwork.id) : false;

  useEffect(() => {
    window.scrollTo(0, 0);
    if (id && onVisit) {
       onVisit(id);
    }
    return () => {
      if (audioRef.current) audioRef.current.pause();
      if (audioUrl) URL.revokeObjectURL(audioUrl);
    };
  }, [id]);

  if (!artwork) return null;

  const handleAudioEnded = () => setIsAudioPlaying(false);

  const handlePrimaryAction = async () => {
    if (userRole === 'teacher') {
      onToggleSave(artwork.id);
    } else {
      if (isAudioPlaying) {
        audioRef.current?.pause();
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
        const script = await generateTourScript(artwork, 'student');
        const url = await textToSpeech(script);
        if (url) {
          setAudioUrl(url);
          setTimeout(() => {
             if(audioRef.current) {
                audioRef.current.play();
                setIsAudioPlaying(true);
             }
          }, 100);
        }
      } catch (error) {
        console.error(error);
      } finally {
        setIsGeneratingAudio(false);
      }
    }
  };

  return (
    <div className="bg-mnac-bg min-h-screen text-mnac-textPrimary">
      {audioUrl && <audio ref={audioRef} src={audioUrl} onEnded={handleAudioEnded} />}

      {/* Back Button */}
      <div className="fixed top-24 left-0 w-full px-6 md:px-12 z-40 pointer-events-none">
        <button onClick={() => navigate(-1)} className="pointer-events-auto bg-[#121212]/80 backdrop-blur-md border border-white/10 p-3 rounded-full shadow-lg text-white hover:border-mnac-accent hover:text-mnac-accent transition-all group">
          <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform"/>
        </button>
      </div>

      <div className="pt-32 pb-12 px-6 md:px-12 max-w-[1920px] mx-auto">
        <div className="flex flex-col lg:flex-row gap-12 lg:gap-20">
          
          {/* IMAGE COLUMN */}
          <div className="lg:w-1/2">
            <div className="relative overflow-hidden bg-mnac-surface shadow-[0_0_50px_rgba(0,0,0,0.5)] rounded-sm group border border-white/5">
              <OptimizedImage 
                src={artwork.imageUrl} 
                alt={artwork.title} 
                priority={true}
                aspectRatio="aspect-auto"
                className="max-h-[75vh] mx-auto"
              />
              <div className="absolute bottom-6 right-6 flex gap-3">
                 <button 
                    onClick={() => onToggleSave(artwork.id)} 
                    className={`p-4 rounded-full backdrop-blur-md shadow-xl transition-all border ${isSaved ? 'bg-mnac-accent border-mnac-accent text-white scale-110' : 'bg-black/50 border-white/20 text-white hover:bg-white hover:text-black'}`}
                    aria-label="Guardar obra"
                 >
                   <Bookmark size={20} fill={isSaved ? "currentColor" : "none"} />
                 </button>
              </div>
            </div>
          </div>

          {/* TEXT COLUMN */}
          <div className="lg:w-1/2 flex flex-col justify-center animate-slide-up">
            <div className="flex items-center gap-3 mb-6">
                <span className="text-mnac-accent text-[10px] font-bold uppercase tracking-[0.3em] flex items-center gap-2">
                  <Palette size={12} /> {artwork.period}
                </span>
                <div className="h-px w-8 bg-white/20"></div>
                <span className="text-gray-500 text-[10px] font-mono font-bold">{artwork.year}</span>
            </div>
            
            <h1 className="font-serif italic text-5xl md:text-8xl text-white mb-6 leading-[1.1] tracking-tight">
              {artwork.title}
            </h1>
            
            <p className="text-xl font-sans font-light text-gray-400 mb-8 border-l border-mnac-accent pl-6">
                {artwork.artist}
            </p>

            <p className="text-gray-300 leading-relaxed mb-8 text-lg font-light max-w-xl">
              {userRole === 'teacher' ? artwork.teacherDescription : (easyReading ? artwork.simpleDescription : artwork.description)}
            </p>
            
            <div className="flex flex-wrap gap-2 mb-10">
                {artwork.tags.map(tag => (
                    <span key={tag} className="text-[9px] uppercase tracking-widest text-gray-500 border border-white/10 px-3 py-1 rounded-full hover:border-white/30 cursor-default transition-colors">
                        {tag}
                    </span>
                ))}
            </div>

            {/* Action Buttons Row */}
            <div className="flex flex-wrap gap-4 pt-8 border-t border-white/10">
               {/* Primary Action */}
               <button 
                  onClick={handlePrimaryAction} 
                  className="bg-white text-black hover:bg-mnac-accent hover:text-white px-8 py-4 text-xs font-bold uppercase tracking-widest transition-all shadow-lg flex items-center gap-3 rounded-sm"
               >
                  {isGeneratingAudio ? <Loader2 size={16} className="animate-spin" /> : (isAudioPlaying ? <Pause size={16} /> : (userRole === 'teacher' ? <PlusCircle size={16}/> : <Headphones size={16} />))}
                  {userRole === 'teacher' ? (isSaved ? 'Obra en tu Guía' : 'Añadir a Guía') : (isAudioPlaying ? 'Pausar Audio' : 'Oír Audioguía')}
               </button>

               {/* Secondary Action */}
               <button 
                  onClick={() => onToggleSave(artwork.id)}
                  className={`px-8 py-4 text-xs font-bold uppercase tracking-widest border transition-all flex items-center gap-3 rounded-sm ${
                    isSaved 
                      ? 'bg-transparent border-mnac-accent text-mnac-accent hover:bg-mnac-accent/10' 
                      : 'bg-transparent border-white/20 text-white hover:border-white'
                  }`}
               >
                  <Bookmark size={16} fill={isSaved ? "currentColor" : "none"} />
                  {isSaved ? 'Guardado' : 'Guardar'}
               </button>
            </div>
          </div>
        </div>
      </div>
      <Footer role={userRole} />
    </div>
  );
};

export default ArtworkDetail;
