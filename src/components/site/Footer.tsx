import Link from "next/link";
import { Logo } from "@/components/ui/Logo";
import { ContactIcon, contactHref } from "@/components/ui/ContactIcon";

interface Contact {
  id: string;
  type: string;
  label: string;
  value: string;
  icon: string | null;
}

export function Footer({
  contacts,
  site,
}: {
  contacts: Contact[];
  site: { brand: string; tagline: string; logoUrl: string };
}) {
  return (
    <footer className="relative mt-24 border-t border-white/10">
      <div className="mx-auto max-w-7xl px-4 py-14 grid gap-10 md:grid-cols-4">
        <div className="md:col-span-2">
          <Logo
            brand={site.brand}
            tagline={site.tagline}
            logoUrl={site.logoUrl}
            size="md"
          />
          <p className="mt-4 max-w-sm text-sm text-muted">
            {site.tagline}. Премиум digital-агентство: сайты, веб-приложения и
            цифровые продукты будущего.
          </p>
          <div className="flex gap-3 mt-5">
            {contacts
              .filter((c) =>
                ["telegram", "telegram_bot", "instagram"].includes(c.type)
              )
              .map((c) => (
                <a
                  key={c.id}
                  href={contactHref(c.type, c.value)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="grid place-items-center h-10 w-10 rounded-lg glass card-hover text-primary"
                  aria-label={c.label}
                >
                  <ContactIcon type={c.type} icon={c.icon} className="h-5 w-5" />
                </a>
              ))}
          </div>
        </div>

        <div>
          <h4 className="font-semibold mb-4">Навигация</h4>
          <ul className="space-y-2 text-sm text-muted">
            <li><Link href="/projects" className="hover:text-foreground">Проекты</Link></li>
            <li><Link href="/sites" className="hover:text-foreground">Готовые сайты</Link></li>
            <li><Link href="/services" className="hover:text-foreground">Услуги</Link></li>
            <li><Link href="/contacts" className="hover:text-foreground">Контакты</Link></li>
            <li><Link href="/#order" className="hover:text-foreground">Заказать</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="font-semibold mb-4">Контакты</h4>
          <ul className="space-y-3 text-sm text-muted">
            {contacts.map((c) => (
              <li key={c.id} className="flex items-center gap-2">
                <ContactIcon type={c.type} icon={c.icon} className="h-4 w-4 text-primary shrink-0" />
                {["telegram", "telegram_bot", "instagram", "email", "phone"].includes(c.type) ? (
                  <a href={contactHref(c.type, c.value)} target="_blank" rel="noopener noreferrer" className="hover:text-foreground break-all">
                    {c.value}
                  </a>
                ) : (
                  <span className="break-all">{c.value}</span>
                )}
              </li>
            ))}
          </ul>
        </div>
      </div>
      <div className="border-t border-white/10">
        <div className="mx-auto max-w-7xl px-4 py-5 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-muted">
          <span>© {new Date().getFullYear()} {site.brand}. Все права защищены.</span>
          <span>navix.uz — {site.tagline}</span>
        </div>
      </div>
    </footer>
  );
}
