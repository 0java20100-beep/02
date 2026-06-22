"use client";

import Image from "next/image";
import { Star } from "lucide-react";

export interface ReviewData {
  id: string;
  name: string;
  company: string | null;
  avatar: string | null;
  rating: number;
  text: string;
}

export function ReviewsSection({ reviews }: { reviews: ReviewData[] }) {
  if (reviews.length === 0) return null;
  // Duplicate for a seamless marquee loop.
  const loop = reviews.length >= 3 ? [...reviews, ...reviews] : reviews;

  return (
    <section className="relative py-24 overflow-hidden">
      <div className="mx-auto max-w-7xl px-4">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <span className="inline-block rounded-full glass px-4 py-1 text-xs tracking-widest text-primary mb-4">
            ОТЗЫВЫ
          </span>
          <h2 className="text-3xl md:text-5xl font-bold gradient-text">
            Нам доверяют
          </h2>
        </div>
      </div>

      <div className="relative">
        <div className="absolute left-0 top-0 bottom-0 w-24 bg-gradient-to-r from-background to-transparent z-10" />
        <div className="absolute right-0 top-0 bottom-0 w-24 bg-gradient-to-l from-background to-transparent z-10" />
        <div className="flex gap-6 w-max animate-marquee hover:[animation-play-state:paused] px-4">
          {loop.map((r, i) => (
            <ReviewCard key={`${r.id}-${i}`} review={r} />
          ))}
        </div>
      </div>
    </section>
  );
}

function ReviewCard({ review }: { review: ReviewData }) {
  return (
    <figure className="w-[340px] shrink-0 glass rounded-2xl p-6 card-hover">
      <div className="flex gap-0.5 mb-3">
        {Array.from({ length: 5 }).map((_, i) => (
          <Star
            key={i}
            className={
              i < review.rating
                ? "h-4 w-4 fill-primary text-primary"
                : "h-4 w-4 text-white/15"
            }
          />
        ))}
      </div>
      <blockquote className="text-sm text-foreground/90 line-clamp-5">
        “{review.text}”
      </blockquote>
      <figcaption className="mt-5 flex items-center gap-3">
        {review.avatar ? (
          <Image
            src={review.avatar}
            alt={review.name}
            width={40}
            height={40}
            className="h-10 w-10 rounded-full object-cover"
          />
        ) : (
          <span className="grid h-10 w-10 place-items-center rounded-full bg-gradient-to-br from-primary to-secondary text-sm font-bold text-white">
            {review.name.slice(0, 1)}
          </span>
        )}
        <div>
          <div className="text-sm font-medium">{review.name}</div>
          {review.company && (
            <div className="text-xs text-muted">{review.company}</div>
          )}
        </div>
      </figcaption>
    </figure>
  );
}
