import { Reveal } from "./Reveal";

export function SectionHeading({
  eyebrow,
  title,
  subtitle,
}: {
  eyebrow?: string;
  title: string;
  subtitle?: string;
}) {
  return (
    <Reveal className="text-center max-w-2xl mx-auto mb-12">
      {eyebrow && (
        <span className="inline-block rounded-full glass px-4 py-1 text-xs tracking-widest text-primary mb-4">
          {eyebrow}
        </span>
      )}
      <h2 className="text-3xl md:text-5xl font-bold">
        <span className="gradient-text">{title}</span>
      </h2>
      {subtitle && <p className="mt-4 text-muted">{subtitle}</p>}
    </Reveal>
  );
}
