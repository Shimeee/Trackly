import { Tv, Music2, Cloud, Sparkles, PlaySquare, Palette, CreditCard, LucideIcon } from 'lucide-react-native';

const SERVICE_ICON_MAP: { match: RegExp; icon: LucideIcon }[] = [
  { match: /netflix/i, icon: Tv },
  { match: /spotify/i, icon: Music2 },
  { match: /icloud/i, icon: Cloud },
  { match: /disney/i, icon: Sparkles },
  { match: /you\s*tube/i, icon: PlaySquare },
  { match: /canva/i, icon: Palette },
];

export function getServiceIcon(name: string): LucideIcon {
  const hit = SERVICE_ICON_MAP.find((s) => s.match.test(name));
  return hit ? hit.icon : CreditCard;
}
