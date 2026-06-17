import { Star } from "lucide-react";
import { cn } from "@/lib/utils";

interface RatingStarsProps {
  rating: number;
  size?: number;
  className?: string;
}

export default function RatingStars({ rating, size = 16, className }: RatingStarsProps) {
  return (
    <div className={cn("flex items-center gap-0.5", className)} aria-label={`${rating} out of 5`}>
      {Array.from({ length: 5 }).map((_, i) => (
        <Star
          key={i}
          width={size}
          height={size}
          className={cn(
            i < Math.round(rating)
              ? "fill-gold-400 text-gold-400"
              : "fill-transparent text-ink-900/20",
          )}
        />
      ))}
    </div>
  );
}
