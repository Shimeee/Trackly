import React from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import { ChevronRight, ChevronLeft } from 'lucide-react-native';
import { useTheme } from '../theme/ThemeProvider';
import { type as textType } from '../theme/typography';
import { useIsRTL } from '../i18n';

type Props = {
  label: string;
  value?: string;
  sub?: string;
  onPress?: () => void;
  showChevron?: boolean;
  destructive?: boolean;
  right?: React.ReactNode;
};

export function Row({ label, value, sub, onPress, showChevron = true, destructive, right }: Props) {
  const { colors, spacing } = useTheme();
  const Wrapper = onPress ? Pressable : View;
  const isRTL = useIsRTL();
  const DisclosureIcon = isRTL ? ChevronLeft : ChevronRight;

  return (
    <Wrapper onPress={onPress} style={({ pressed }: any) => [styles.row, { paddingVertical: spacing.md, opacity: pressed ? 0.6 : 1 }]}>
      <View style={{ flex: 1 }}>
        <Text style={[textType.body, { color: destructive ? colors.statusError : colors.textPrimary }]}>{label}</Text>
        {sub ? <Text style={[textType.caption, { color: colors.textTertiary, marginTop: 2 }]}>{sub}</Text> : null}
      </View>
      <View style={styles.right}>
        {value ? <Text style={[textType.bodySmall, { color: colors.textTertiary, marginRight: 6 }]}>{value}</Text> : null}
        {right}
        {showChevron && onPress ? <DisclosureIcon size={20} color={colors.textPrimary} /> : null}
      </View>
    </Wrapper>
  );
}

export function Divider() {
  const { colors } = useTheme();
  return <View style={{ height: 1, backgroundColor: colors.borderSubtle }} />;
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16 },
  right: { flexDirection: 'row', alignItems: 'center' },
});
