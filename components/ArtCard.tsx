
import React from 'react';
import { ArtWork } from '../types';
import { Bookmark, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import OptimizedImage from './OptimizedImage';
import { hapticService } from '../services/hapticService';

interface ArtCardProps {
  artwork: ArtWork;
  isSaved?: boolean;
  onToggleSave?: () => void;
}

const ArtCard: React.FC<ArtCardProps> = ({ artwork, isSaved, onToggleSave }) => {
  const handleSaveClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    hapticService.medium();
    onToggleSave?.();
  };

  return (
    <div className="group flex flex-col h-full relative mb-8">
      {/* Image Container - Clean Edge */}
      <Link to={`/artwork/${artwork.id}`} className="block relative w-full aspect-[3/4] overflow-hidden bg-mnac-surface rounded-2xl border border-white/10 mb-3.5 active:scale-[0.98] transition-transform duration-150 ease-[cubic-bezier(0.23,1,0.32,1)]">
        <OptimizedImage 
          src={artwork.imageUrl} 
          alt={artwork.title} 
          aspectRatio="h-full w-full"
          className="transition-transform duration-500 ease-[cubic-bezier(0.23,1,0.32,1)] group-hover:scale-105 opacity-90 group-hover:opacity-100"
        />
        
        {/* Floating Action Button (FAB) Style for Save */}
        <button 
          onClick={handleSaveClick}
          aria-label={isSaved ? 'Quitar de guardados' : 'Guardar obra'}
          className={`absolute top-3 right-3 z-20 w-11 h-11 flex items-center justify-center rounded-full transition-[transform,background-color] duration-150 ease-[cubic-bezier(0.23,1,0.32,1)] active:scale-90 ${
            isSaved 
              ? 'bg-mnac-accent text-white shadow-[0_4px_14px_rgba(0,0,0,0.35)]' 
              : 'bg-black/50 backdrop-blur-md text-white hover:bg-white hover:text-black'
          }`}
        >
          <Bookmark
            key={isSaved ? 'saved' : 'unsaved'}
            size={16}
            fill={isSaved ? 'currentColor' : 'none'}
            className={isSaved ? 'animate-bookmark-pop' : ''}
          />
        </button>
      </Link>
      
      {/* Editorial Text Layout */}
      <div className="flex flex-col border-t border-mnac-divider pt-4">
        <div className="flex justify-between items-baseline mb-1">
            <span className="text-[10px] font-bold tracking-[0.2em] uppercase text-mnac-accent">{artwork.period}</span>
            <span className="text-[10px] font-mono text-mnac-textSecondary">{artwork.year}</span>
        </div>
        
        <Link to={`/artwork/${artwork.id}`} className="group/title block">
            <h3 className="font-serif italic text-2xl leading-none text-white group-hover/title:text-mnac-textSecondary transition-colors duration-300 mb-1 tracking-tight">
            {artwork.title}
            </h3>
        </Link>
        
        <p className="text-xs text-mnac-textSecondary uppercase tracking-wide font-medium">
            {artwork.artist}
        </p>
      </div>
    </div>
  );
};

export default ArtCard;
