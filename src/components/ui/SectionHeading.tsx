import Reveal from "./Reveal";
import { cn } from "@/lib/utils";

interface SectionHeadingProps {
  eyebrow?: string;
  title: string;
  subtitle?: string;
  align?: "left" | "center";
  light?: boolean;
  className?: string;
}

export default function SectionHeading({
  eyebrow,
  title,
  subtitle,
  align = "center",
  light = false,
  className,
}: SectionHeadingProps) {
  return (
    <Reveal
      className={cn(
        "max-w-2xl",
        align === "center" && "mx-auto text-center",
        className,
      )}
    >
      {eyebrow && (
        <span className="chip mb-4">
          <span className="h-1.5 w-1.5 rounded-full bg-watermelon-500" />
          {eyebrow}
        </span>
      )}
      <h2
        className={cn(
          "heading-display text-3xl sm:text-4xl lg:text-5xl",
          light ? "text-white" : "text-ink-950",
        )}
      >
        {title}
      </h2>
      {subtitle && (
        <p
          className={cn(
            "mt-4 text-base sm:text-lg",
            light ? "text-white/70" : "text-ink-800/70",
          )}
        >
          {subtitle}
        </p>
      )}
    </Reveal>
  );
}
