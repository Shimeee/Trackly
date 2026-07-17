import React from 'react';
import { View, ScrollView, StyleSheet, ViewStyle } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from '../theme/ThemeProvider';

type Props = {
  children: React.ReactNode;
  scroll?: boolean;
  style?: ViewStyle;
  edges?: ('top' | 'bottom' | 'left' | 'right')[];
};

export function Screen({ children, scroll = true, style, edges = ['top'] }: Props) {
  const { colors, spacing } = useTheme();
  const Container = scroll ? ScrollView : View;
  const containerProps = scroll
    ? { contentContainerStyle: [styles.scrollContent, { padding: spacing.lg }, style], showsVerticalScrollIndicator: false }
    : { style: [styles.flexContent, { padding: spacing.lg }, style] };

  return (
    <SafeAreaView edges={edges} style={[styles.safe, { backgroundColor: colors.bgCanvas }]}>
      <Container {...(containerProps as any)}>{children}</Container>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1 },
  scrollContent: { flexGrow: 1, gap: 20, paddingBottom: 40 },
  flexContent: { flex: 1, gap: 20 },
});
