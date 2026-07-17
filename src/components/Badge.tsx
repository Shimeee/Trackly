import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useTranslation } from 'react-i18next';
import { useTheme } from '../theme/ThemeProvider';
import { statusBadgeColors } from '../theme/colors';
import { type as textType } from '../theme/typography';
import { SubStatus } from '../store/subscriptionsStore';

export function Badge({ status }: { status: SubStatus }) {
  const { isDark, radius } = useTheme();
  const { t } = useTranslation();
  const color = statusBadgeColors[status][isDark ? 'dark' : 'light'];

  return (
    <View style={[styles.base, { backgroundColor: color + '22', borderRadius: radius.full }]}>
      <Text style={[textType.label, { color, letterSpacing: 0.4 }]}>{t(`badge.${status}`)}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  base: { paddingHorizontal: 10, paddingVertical: 4 },
});
