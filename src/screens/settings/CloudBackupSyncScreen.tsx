import React, { useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Check } from 'lucide-react-native';
import { useTranslation } from 'react-i18next';
import { Screen } from '../../components/Screen';
import { ScreenHeader } from '../../components/ScreenHeader';
import { Card } from '../../components/Card';
import { Row, Divider } from '../../components/Row';
import { Toggle } from '../../components/Toggle';
import { Button } from '../../components/Button';
import { useTheme } from '../../theme/ThemeProvider';
import { type as textType } from '../../theme/typography';
import { useSubscriptionsStore } from '../../store/subscriptionsStore';

export function CloudBackupSyncScreen() {
  const { colors, spacing, radius } = useTheme();
  const { t } = useTranslation();
  const subscriptions = useSubscriptionsStore((s) => s.subscriptions);
  const [autoSync, setAutoSync] = useState(true);
  const [cellular, setCellular] = useState(false);
  const sizeKb = Math.max(1, Math.round(JSON.stringify(subscriptions).length / 1024 * 10) / 10);

  return (
    <Screen>
      <ScreenHeader title={t('cloudBackupSync.title')} />

      <View style={[styles.status, { backgroundColor: colors.statusSuccessBg, borderRadius: radius.lg }]}>
        <Check size={20} color={colors.statusSuccess} />
        <View style={{ marginLeft: 12 }}>
          <Text style={[textType.bodyMedium, { color: colors.statusSuccess }]}>{t('cloudBackupSync.storedOnDevice')}</Text>
          <Text style={[textType.caption, { color: colors.statusSuccess, marginTop: 2 }]}>{t('cloudBackupSync.localAlwaysUpToDate')}</Text>
        </View>
      </View>

      <Text style={[textType.label, { color: colors.textTertiary }]}>{t('cloudBackupSync.syncSettings')}</Text>
      <Card style={{ padding: spacing.lg, gap: 4 }}>
        <View style={styles.toggleRow}>
          <Text style={[textType.body, { color: colors.textPrimary }]}>{t('cloudBackupSync.autoSync')}</Text>
          <Toggle value={autoSync} onChange={setAutoSync} />
        </View>
        <View style={{ height: 12 }} />
        <View style={styles.toggleRow}>
          <Text style={[textType.body, { color: colors.textPrimary }]}>{t('cloudBackupSync.syncOverCellular')}</Text>
          <Toggle value={cellular} onChange={setCellular} />
        </View>
      </Card>

      <Text style={[textType.label, { color: colors.textTertiary }]}>{t('cloudBackupSync.storage')}</Text>
      <Card>
        <Row label={t('cloudBackupSync.localStorageUsed')} value={`${sizeKb} KB`} showChevron={false} />
        <Divider />
        <Row label={t('cloudBackupSync.backupFrequency')} value={t('cloudBackupSync.realTime')} showChevron={false} />
      </Card>
    </Screen>
  );
}

const styles = StyleSheet.create({
  status: { flexDirection: 'row', alignItems: 'center', padding: 16 },
  toggleRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
});
