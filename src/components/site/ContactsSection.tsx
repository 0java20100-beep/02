import { SectionHeading } from "@/components/ui/SectionHeading";
import { Reveal } from "@/components/ui/Reveal";
import { ContactIcon, contactHref } from "@/components/ui/ContactIcon";

interface Contact {
  id: string;
  type: string;
  label: string;
  value: string;
  icon: string | null;
}

const LINKABLE = ["telegram", "telegram_bot", "instagram", "email", "phone"];

export function ContactsSection({ contacts }: { contacts: Contact[] }) {
  return (
    <section id="contacts" className="relative py-24">
      <div className="mx-auto max-w-7xl px-4">
        <SectionHeading
          eyebrow="КОНТАКТЫ"
          title="Свяжитесь с нами"
          subtitle="Мы на связи в Telegram, Instagram и по email. Ответим быстро."
        />
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {contacts.map((c, i) => {
            const linkable = LINKABLE.includes(c.type);
            const inner = (
              <div className="h-full glass rounded-2xl p-6 card-hover neon-border text-center">
                <div className="mx-auto grid place-items-center h-14 w-14 rounded-2xl bg-gradient-to-br from-primary/20 to-secondary/20 text-primary mb-4">
                  <ContactIcon type={c.type} icon={c.icon} className="h-6 w-6" />
                </div>
                <div className="text-sm text-muted">{c.label}</div>
                <div className="mt-1 font-medium break-all">{c.value}</div>
              </div>
            );
            return (
              <Reveal key={c.id} delay={i * 0.06}>
                {linkable ? (
                  <a
                    href={contactHref(c.type, c.value)}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {inner}
                  </a>
                ) : (
                  inner
                )}
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}
