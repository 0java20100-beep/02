import { Star } from "lucide-react";
import { cn } from "@/lib/utils";

interface RatingProps {
  value: number;
  className?: string;
  showValue?: boolean;
}

export function Rating({ value, className, showValue = true }: RatingProps) {
  return (
    <span className={cn("inline-flex items-center gap-1", className)}>
      <Star className="h-4 w-4 fill-gold text-gold" />
      {showValue && (
        <span className="text-sm font-semibold text-gold-400">
          {value.toFixed(1)}
        </span>
      )}
    </span>
  );
}
