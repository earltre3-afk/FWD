import React from 'react';
import { Heart, Play, Upload as UploadIcon } from 'lucide-react';
import { GifItem } from '@/data/gifs';
import { useFWD } from '@/contexts/FWDContext';

type Props = {
  gif: GifItem;
  onClick?: (gif: GifItem) => void;
  showHeart?: boolean;
  showShare?: boolean;
  className?: string;
  aspect?: 'square' | 'tall';
};

const GifCard: React.FC<Props> = ({ gif, onClick, showHeart = true, showShare = false, className = '', aspect = 'square' }) => {
  const { isFavorite, toggleFavorite } = useFWD();
  const fav = isFavorite(gif.id);

  return (
    <button
      type="button"
      onClick={() => onClick?.(gif)}
      className={`group relative overflow-hidden rounded-2xl liquid-glass card-shine transition-all duration-500 hover:neon-glow hover:-translate-y-1 hover:scale-[1.02] focus:outline-none focus:ring-2 focus:ring-fuchsia-500/70 ${aspect === 'tall' ? 'aspect-[3/4]' : 'aspect-square'} ${className}`}
    >
      {/* Image with zoom effect */}
      <img
        src={gif.thumbnailUrl}
        alt={gif.altText}
        className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-110"
        loading="lazy"
      />
      
      {/* Gradient overlays */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-black/40 transition-opacity duration-300 group-hover:opacity-90" />
      <div className="absolute inset-0 bg-gradient-to-br from-fuchsia-500/0 via-transparent to-cyan-500/0 opacity-0 group-hover:opacity-20 transition-opacity duration-500" />
      
      {/* GIF badge with glow */}
      <span className="absolute left-2 top-2 rounded-lg border border-white/20 bg-black/60 backdrop-blur-md px-2.5 py-1 text-[10px] font-bold tracking-[0.2em] text-white/90 transition-all duration-300 group-hover:border-fuchsia-500/40 group-hover:bg-fuchsia-500/20 group-hover:text-fuchsia-200">
        GIF
      </span>
      
      {/* Heart button with animation */}
      {showHeart && (
        <span
          onClick={(e) => { e.stopPropagation(); toggleFavorite(gif.id); }}
          className={`absolute right-2 top-2 grid h-9 w-9 place-items-center rounded-xl backdrop-blur-md transition-all duration-300 hover:scale-110 ${
            fav 
              ? 'bg-fuchsia-500/30 text-fuchsia-300 neon-glow-sm' 
              : 'bg-black/50 text-white/80 hover:text-fuchsia-300 hover:bg-fuchsia-500/20'
          }`}
          role="button"
          aria-label={fav ? 'Unfavorite' : 'Favorite'}
        >
          <Heart className={`h-4 w-4 transition-transform duration-300 ${fav ? 'scale-110' : 'group-hover:scale-110'}`} fill={fav ? 'currentColor' : 'none'} />
          {fav && <div className="absolute inset-0 rounded-xl animate-ping bg-fuchsia-500/30" style={{ animationDuration: '1.5s' }} />}
        </span>
      )}
      
      {/* Play button with pulse */}
      <span className="absolute bottom-2 left-2 grid h-8 w-8 place-items-center rounded-xl bg-black/60 text-white/90 backdrop-blur-md transition-all duration-300 group-hover:bg-fuchsia-500/30 group-hover:text-white group-hover:scale-110">
        <Play className="h-3.5 w-3.5" fill="currentColor" />
      </span>
      
      {/* Share button */}
      {showShare && (
        <span className="absolute bottom-2 right-2 grid h-8 w-8 place-items-center rounded-xl bg-black/60 text-white/90 backdrop-blur-md transition-all duration-300 group-hover:bg-cyan-500/30 group-hover:text-white group-hover:scale-110">
          <UploadIcon className="h-3.5 w-3.5" />
        </span>
      )}
      
      {/* Bottom shine effect on hover */}
      <div className="absolute bottom-0 left-0 right-0 h-1/3 bg-gradient-to-t from-fuchsia-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
    </button>
  );
};

export default GifCard;
