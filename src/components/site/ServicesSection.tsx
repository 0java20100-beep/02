import {
  Layout,
  Building2,
  ShoppingCart,
  AppWindow,
  LayoutDashboard,
  Cloud,
  Palette,
  Search,
  type LucideIcon,
} from "lucide-react";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Reveal } from "@/components/ui/Reveal";

interface ServiceGroup {
  icon: LucideIcon;
  title: string;
  items: string[];
}

export const SERVICE_GROUPS: ServiceGroup[] = [
  {
    icon: Layout,
    title: "Разработка сайтов",
    items: ["Лендинг", "Корпоративный сайт", "Интернет-магазин"],
  },
  {
    icon: AppWindow,
    title: "Разработка приложений",
    items: ["CRM", "ERP", "Dashboard", "SaaS", "Web App"],
  },
  {
    icon: Palette,
    title: "Дизайн",
    items: ["UI/UX", "Branding", "Design System"],
  },
  {
    icon: Search,
    title: "Продвижение",
    items: ["SEO", "Оптимизация скорости", "Аналитика"],
  },
];

const HIGHLIGHTS: { icon: LucideIcon; label: string }[] = [
  { icon: Building2, label: "Corporate" },
  { icon: ShoppingCart, label: "E-commerce" },
  { icon: LayoutDashboard, label: "Dashboards" },
  { icon: Cloud, label: "SaaS" },
];

export function ServicesSection() {
  return (
    <section id="services" className="relative py-24">
      <div className="mx-auto max-w-7xl px-4">
        <SectionHeading
          eyebrow="УСЛУГИ"
          title="Что мы создаём"
          subtitle="Полный цикл разработки цифровых продуктов — от идеи до запуска и продвижения."
        />
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {SERVICE_GROUPS.map((group, i) => (
            <Reveal key={group.title} delay={i * 0.08}>
              <div className="relative h-full glass rounded-2xl p-6 card-hover neon-border">
                <div className="grid place-items-center h-12 w-12 rounded-xl bg-gradient-to-br from-primary/20 to-secondary/20 text-primary mb-4">
                  <group.icon className="h-6 w-6" />
                </div>
                <h3 className="font-semibold text-lg">{group.title}</h3>
                <ul className="mt-3 space-y-2 text-sm text-muted">
                  {group.items.map((item) => (
                    <li key={item} className="flex items-center gap-2">
                      <span className="h-1.5 w-1.5 rounded-full bg-gradient-to-r from-primary to-secondary" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            </Reveal>
          ))}
        </div>

        <div className="mt-10 flex flex-wrap justify-center gap-3">
          {HIGHLIGHTS.map((h) => (
            <span
              key={h.label}
              className="inline-flex items-center gap-2 rounded-full glass px-4 py-2 text-sm text-muted"
            >
              <h.icon className="h-4 w-4 text-primary" />
              {h.label}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
