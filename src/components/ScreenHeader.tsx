import React from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import { ChevronLeft, ChevronRight } from 'lucide-react-native';
import { useNavigation } from '@react-navigation/native';
import { useTheme } from '../theme/ThemeProvider';
import { type as textType } from '../theme/typography';
import { useIsRTL } from '../i18n';

export function ScreenHeader({ title, rightSlot }: { title: string; rightSlot?: React.ReactNode }) {
  const { colors, spacing } = useTheme();
  const navigation = useNavigation();
  const isRTL = useIsRTL();
  const BackIcon = isRTL ? ChevronRight : ChevronLeft;

  return (
    <View style={[styles.row, { paddingBottom: spacing.md }]}>
      <Pressable onPress={() => navigation.goBack()} hitSlop={12} style={[styles.backBtn, { marginLeft: -4 }]}>
        <BackIcon size={24} color={colors.textPrimary} />
      </Pressable>
      <Text style={[textType.subheading, { color: colors.textPrimary, flex: 1 }]}>{title}</Text>
      {rightSlot}
    </View>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'center' },
  backBtn: { marginRight: 8 },
});
