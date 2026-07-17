import React, { useState } from 'react';
import { View, Text, Pressable, Share, StyleSheet } from 'react-native';
import { useTranslation } from 'react-i18next';
import { Screen } from '../../components/Screen';
import { ScreenHeader } from '../../components/ScreenHeader';
import { Button } from '../../components/Button';
import { useTheme } from '../../theme/ThemeProvider';
import { type as textType } from '../../theme/typography';
import { useSubscriptionsStore } from '../../store/subscriptionsStore';
import { useSettingsStore } from '../../store/settingsStore';
import { formatMoney } from '../../utils/format';

export function ExportDataScreen() {
  const { colors, radius } = useTheme();
  const { t } = useTranslation();
  const subscriptions = useSubscriptionsStore((s) => s.subscriptions);
  const currency = useSettingsStore((s) => s.currency);
  const [format, setFormat] = useState<'CSV' | 'PDF'>('CSV');

  const totalValue = subscriptions.reduce((sum, s) => sum + s.cost, 0);

  const [exportError, setExportError] = useState('');

  const onExport = async () => {
    setExportError('');
    const header = 'Name,Category,Cost,Cycle,Status,Next Billing Date\n';
    const rows = subscriptions
      .map((s) => `${s.name},${s.categoryId},${s.cost},${s.billingCycle},${s.status},${s.nextBillingDate.slice(0, 10)}`)
      .join('\n');
    try {
      await Share.share({ message: header + rows, title: 'Trackly subscriptions export' });
    } catch {
      setExportError(t('exportData.exportError'));
    }
  };

  return (
    <Screen>
      <ScreenHeader title={t('exportData.title')} />

      <Text style={[textType.label, { color: colors.textTertiary }]}>{t('exportData.format')}</Text>
      <View style={styles.row}>
        {(['CSV', 'PDF'] as const).map((f) => (
          <Pressable
            key={f}
            onPress={() => setFormat(f)}
            style={[
              styles.chip,
              { borderColor: colors.borderDefault, borderRadius: radius.lg },
              format === f && { backgroundColor: colors.accentSubtleBg, borderColor: colors.accentPrimary },
            ]}
          >
            <Text style={[textType.bodyMedium, { color: format === f ? colors.accentPrimary : colors.textPrimary }]}>{f}</Text>
          </Pressable>
        ))}
      </View>

      <View style={[styles.preview, { backgroundColor: colors.bgSurfaceSecondary, borderRadius: radius.lg }]}>
        <Text style={[textType.label, { color: colors.textTertiary }]}>{t('exportData.preview')}</Text>
        <Text style={[textType.body, { color: colors.textPrimary, marginTop: 4 }]}>{t('exportData.subscriptionsIncluded', { count: subscriptions.length })}</Text>
        <Text style={[textType.body, { color: colors.textPrimary }]}>{t('exportData.totalValue', { amount: formatMoney(totalValue, currency) })}</Text>
      </View>

      {exportError ? <Text style={[textType.bodySmall, { color: colors.statusError }]}>{exportError}</Text> : null}
      <Button label={t('exportData.exportButton')} onPress={onExport} disabled={subscriptions.length === 0} />
    </Screen>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', gap: 12 },
  chip: { flex: 1, paddingVertical: 16, alignItems: 'center', borderWidth: 1 },
  preview: { padding: 16 },
});
