import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useTranslation } from 'react-i18next';
import { useTheme } from '../theme/ThemeProvider';
import { type as textType } from '../theme/typography';
import { Button } from './Button';

type Props = {
  headline: string;
  message: string;
  confirmLabel: string;
  confirmDestructive?: boolean;
  onConfirm: () => void;
  cancelLabel?: string;
};

export function ConfirmDialog({ headline, message, confirmLabel, confirmDestructive, onConfirm, cancelLabel }: Props) {
  const navigation = useNavigation();
  const { colors, radius, spacing } = useTheme();
  const { t } = useTranslation();

  return (
    <View style={[styles.scrim, { backgroundColor: 'rgba(4,8,20,0.5)' }]}>
      <View style={[styles.dialog, { backgroundColor: colors.bgSurface, borderRadius: radius.xl, padding: spacing.xl }]}>
        <Text style={[textType.heading, { color: colors.textPrimary }]}>{headline}</Text>
        <Text style={[textType.body, { color: colors.textSecondary, marginTop: 12 }]}>{message}</Text>
        <View style={styles.actions}>
          <View style={{ flex: 1 }}>
            <Button label={cancelLabel ?? t('common.cancel')} variant="ghost" onPress={() => navigation.goBack()} />
          </View>
          <View style={{ flex: 1 }}>
            <Button
              label={confirmLabel}
              variant={confirmDestructive ? 'destructive' : 'primary'}
              onPress={onConfirm}
            />
          </View>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  scrim: { flex: 1, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 24 },
  dialog: { width: '100%', maxWidth: 340 },
  actions: { flexDirection: 'row', gap: 12, marginTop: 24 },
});
