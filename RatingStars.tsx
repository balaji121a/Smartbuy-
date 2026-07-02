import { Star, StarHalf } from 'lucide-react';

interface RatingStarsProps {
  rating: number;
  count?: number;
  size?: number;
}

export default function RatingStars({ rating, count, size = 16 }: RatingStarsProps) {
  const fullStars = Math.floor(rating);
  const hasHalfStar = rating % 1 >= 0.4;
  const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);

  return (
    <div className="flex items-center gap-1" id="rating-stars-container">
      {/* Full Stars */}
      {Array.from({ length: fullStars }).map((_, i) => (
        <Star 
          key={`full-${i}`} 
          className="fill-amber-400 text-amber-400" 
          style={{ width: size, height: size }} 
        />
      ))}
      
      {/* Half Star */}
      {hasHalfStar && (
        <StarHalf 
          className="fill-amber-400 text-amber-400" 
          style={{ width: size, height: size }} 
        />
      )}

      {/* Empty Stars */}
      {Array.from({ length: emptyStars }).map((_, i) => (
        <Star 
          key={`empty-${i}`} 
          className="text-zinc-300 dark:text-zinc-700" 
          style={{ width: size, height: size }} 
        />
      ))}

      {/* Rating Indicator text */}
      <span className="text-xs font-semibold text-zinc-500 dark:text-zinc-400 ml-1">
        {rating.toFixed(1)}
      </span>

      {count !== undefined && (
        <span className="text-xs text-zinc-400 dark:text-zinc-500 font-medium">
          ({count} reviews)
        </span>
      )}
    </div>
  );
}
