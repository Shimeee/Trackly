import React from 'react';
import { View } from 'react-native';
import { Clapperboard, Laptop, Wifi, HeartPulse, MoreHorizontal, LucideIcon } from 'lucide-react-native';
import { useTheme } from '../theme/ThemeProvider';

const iconMap: Record<string, LucideIcon> = {
  clapperboard: Clapperboard,
  laptop: Laptop,
  wifi: Wifi,
  'heart-pulse': HeartPulse,
  'more-horizontal': MoreHorizontal,
};

export function CategoryIcon({ icon, color, size = 44 }: { icon: string; color: string; size?: number }) {
  const { radius } = useTheme();
  const Icon = iconMap[icon] || MoreHorizontal;
  return (
    <View
      style={{
        width: size,
        height: size,
        borderRadius: radius.md,
        backgroundColor: color + '22',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <Icon size={size * 0.5} color={color} />
    </View>
  );
}
