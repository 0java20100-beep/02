import {
  Send,
  Instagram,
  Mail,
  Phone,
  CreditCard,
  MapPin,
  Bot,
  Globe,
  type LucideIcon,
} from "lucide-react";

const MAP: Record<string, LucideIcon> = {
  telegram: Send,
  telegram_bot: Bot,
  bot: Bot,
  instagram: Instagram,
  email: Mail,
  mail: Mail,
  phone: Phone,
  card: CreditCard,
  address: MapPin,
  send: Send,
  globe: Globe,
};

export function ContactIcon({
  type,
  icon,
  className,
}: {
  type: string;
  icon?: string | null;
  className?: string;
}) {
  const Icon = MAP[icon || ""] || MAP[type] || Globe;
  return <Icon className={className} />;
}

export function contactHref(type: string, value: string): string {
  const v = value.trim();
  switch (type) {
    case "telegram":
    case "telegram_bot":
      return `https://t.me/${v.replace(/^@/, "")}`;
    case "instagram":
      return `https://instagram.com/${v.replace(/^@/, "")}`;
    case "email":
      return `mailto:${v}`;
    case "phone":
      return `tel:${v.replace(/[^+\d]/g, "")}`;
    default:
      return v.startsWith("http") ? v : "#";
  }
}
