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
      className={`group relative overflow-hidden rounded-2xl border border-white/10 bg-black/60 backdrop-blur-xl transition-all hover:border-fuchsia-500/60 hover:shadow-[0_0_24px_rgba(217,70,239,0.45)] focus:outline-none focus:ring-2 focus:ring-fuchsia-500/70 ${aspect === 'tall' ? 'aspect-[3/4]' : 'aspect-square'} ${className}`}
    >
      <img
        src={gif.thumbnailUrl}
        alt={gif.altText}
        className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
        loading="lazy"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/0 to-black/30" />
      <span className="absolute left-2 top-2 rounded-md border border-white/15 bg-black/60 px-2 py-0.5 text-[10px] font-bold tracking-widest text-white/90 backdrop-blur">
        GIF
      </span>
      {showHeart && (
        <span
          onClick={(e) => { e.stopPropagation(); toggleFavorite(gif.id); }}
          className={`absolute right-2 top-2 grid h-8 w-8 place-items-center rounded-full backdrop-blur transition ${fav ? 'bg-fuchsia-500/30 text-fuchsia-300' : 'bg-black/50 text-white/80 hover:text-fuchsia-300'}`}
          role="button"
          aria-label={fav ? 'Unfavorite' : 'Favorite'}
        >
          <Heart className="h-4 w-4" fill={fav ? 'currentColor' : 'none'} />
        </span>
      )}
      <span className="absolute bottom-2 left-2 grid h-7 w-7 place-items-center rounded-full bg-black/60 text-white/90 backdrop-blur">
        <Play className="h-3.5 w-3.5" fill="currentColor" />
      </span>
      {showShare && (
        <span className="absolute bottom-2 right-2 grid h-7 w-7 place-items-center rounded-full bg-black/60 text-white/90 backdrop-blur">
          <UploadIcon className="h-3.5 w-3.5" />
        </span>
      )}
    </button>
  );
};

export default GifCard;
