import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { TrendingUp } from 'lucide-react-native';
import { useTheme } from '../theme/ThemeProvider';
import { type as textType } from '../theme/typography';
import { Card } from './Card';

type Props = {
  label: string;
  value: string;
  trend?: string;
  trendPositive?: boolean;
};

export function StatTile({ label, value, trend, trendPositive = true }: Props) {
  const { colors, spacing } = useTheme();
  return (
    <Card style={{ flex: 1, padding: spacing.lg }}>
      <Text style={[textType.label, { color: colors.textTertiary, textTransform: 'uppercase' }]}>{label}</Text>
      <Text style={[textType.numericLarge, { color: colors.textPrimary, marginTop: 6, fontSize: 19, lineHeight: 23 }]}>{value}</Text>
      {trend ? (
        <View style={styles.trendRow}>
          <TrendingUp size={12} color={trendPositive ? colors.statusSuccess : colors.statusError} />
          <Text
            style={[
              textType.caption,
              { color: trendPositive ? colors.statusSuccess : colors.statusError, marginLeft: 4, fontFamily: 'PublicSans_600SemiBold' },
            ]}
          >
            {trend}
          </Text>
        </View>
      ) : null}
    </Card>
  );
}

const styles = StyleSheet.create({
  trendRow: { flexDirection: 'row', alignItems: 'center', marginTop: 6 },
});
