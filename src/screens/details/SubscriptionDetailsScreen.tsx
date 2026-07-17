import React from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useTranslation } from 'react-i18next';
import { Screen } from '../../components/Screen';
import { ScreenHeader } from '../../components/ScreenHeader';
import { Badge } from '../../components/Badge';
import { Button } from '../../components/Button';
import { Card } from '../../components/Card';
import { Divider } from '../../components/Row';
import { useTheme } from '../../theme/ThemeProvider';
import { type as textType } from '../../theme/typography';
import { useSubscriptionsStore } from '../../store/subscriptionsStore';
import { useSettingsStore } from '../../store/settingsStore';
import { RootStackParamList } from '../../navigation/types';
import { formatMoney, formatLongDate } from '../../utils/format';
import { getServiceIcon } from '../../utils/serviceIcons';
import { categoryName } from '../../utils/categoryLabel';

export function SubscriptionDetailsScreen() {
  const { colors, spacing, radius } = useTheme();
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const route = useRoute<RouteProp<RootStackParamList, 'SubscriptionDetails'>>();
  const { t } = useTranslation();
  const currency = useSettingsStore((s) => s.currency);
  const CYCLE_LABELS: Record<string, string> = {
    Monthly: t('detailsForm.cycleMonthly'),
    Yearly: t('detailsForm.cycleYearly'),
    Weekly: t('detailsForm.cycleWeekly'),
  };
  const CYCLE_UNITS: Record<string, string> = {
    Monthly: t('detailsForm.cycleUnitMonth'),
    Yearly: t('detailsForm.cycleUnitYear'),
    Weekly: t('detailsForm.cycleUnitWeek'),
  };
  const categories = useSettingsStore((s) => s.categories);
  const sub = useSubscriptionsStore((s) => s.subscriptions.find((x) => x.id === route.params.id));
  const pauseSubscription = useSubscriptionsStore((s) => s.pauseSubscription);
  const restoreSubscription = useSubscriptionsStore((s) => s.restoreSubscription);

  if (!sub) {
    return (
      <Screen>
        <ScreenHeader title={t('subscriptionDetails.title')} />
        <Text style={[textType.body, { color: colors.textTertiary }]}>{t('subscriptionDetails.notFound')}</Text>
      </Screen>
    );
  }

  const category = categories.find((c) => c.id === sub.categoryId);
  const rows: [string, string][] = [
    [t('subscriptionDetails.labelCategory'), categoryName(category, t)],
    [t('subscriptionDetails.labelBillingCycle'), CYCLE_LABELS[sub.billingCycle] || sub.billingCycle],
    [t('subscriptionDetails.labelNextPayment'), formatLongDate(sub.nextBillingDate)],
    [t('subscriptionDetails.labelStartDate'), formatLongDate(sub.startDate)],
  ];
  if (sub.paymentMethod) rows.push([t('subscriptionDetails.labelPaymentMethod'), sub.paymentMethod]);
  rows.push([t('subscriptionDetails.labelAutoRenew'), sub.autoRenew ? t('subscriptionDetails.autoRenewOn') : t('subscriptionDetails.autoRenewOff')]);

  return (
    <Screen>
      <ScreenHeader
        title={t('subscriptionDetails.title')}
        rightSlot={
          sub.status !== 'cancelled' ? (
            <Pressable onPress={() => navigation.navigate('EditSubscription', { id: sub.id })}>
              <Text style={[textType.bodyMedium, { color: colors.accentPrimary }]}>{t('subscriptionDetails.edit')}</Text>
            </Pressable>
          ) : undefined
        }
      />

      <View style={styles.centerBlock}>
        <View style={[styles.logo, { backgroundColor: sub.color, borderRadius: radius.full }]}>
          {React.createElement(getServiceIcon(sub.name), { size: 28, color: '#FFFFFF' })}
        </View>
        <Text style={[textType.heading, { color: colors.textPrimary, marginTop: 12 }]}>{sub.name}</Text>
        <View style={{ marginTop: 8 }}>
          <Badge status={sub.status} />
        </View>
        <Text style={[textType.display, { color: colors.textPrimary, marginTop: 16 }]}>
          {formatMoney(sub.cost, currency)} / {CYCLE_UNITS[sub.billingCycle] || sub.billingCycle}
        </Text>
      </View>

      <Card style={{ padding: spacing.lg, gap: spacing.md }}>
        {rows.map(([label, value], i) => (
          <React.Fragment key={label}>
            <View style={styles.detailRow}>
              <Text style={[textType.bodySmall, { color: colors.textTertiary }]}>{label}</Text>
              <Text style={[textType.bodyMedium, { color: colors.textPrimary }]}>{value}</Text>
            </View>
            {i < rows.length - 1 && <Divider />}
          </React.Fragment>
        ))}
      </Card>

      {sub.notes ? (
        <View>
          <Text style={[textType.bodySmall, { color: colors.textTertiary }]}>{t('subscriptionDetails.notes')}</Text>
          <Text style={[textType.body, { color: colors.textPrimary, marginTop: 4 }]}>{sub.notes}</Text>
        </View>
      ) : null}

      <View style={{ gap: 12 }}>
        {sub.status === 'paused' || sub.status === 'cancelled' ? (
          <Button label={t('subscriptionDetails.restoreSubscription')} onPress={() => navigation.navigate('RestoreConfirmation', { id: sub.id })} />
        ) : (
          <View style={styles.actionRow}>
            <View style={{ flex: 1 }}>
              <Button label={t('subscriptionDetails.pause')} variant="secondary" onPress={() => navigation.navigate('PauseConfirmation', { id: sub.id })} />
            </View>
            <View style={{ flex: 1 }}>
              <Button label={t('common.delete')} variant="destructive" onPress={() => navigation.navigate('DeleteConfirmation', { id: sub.id })} />
            </View>
          </View>
        )}
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  centerBlock: { alignItems: 'center', paddingVertical: 8 },
  logo: { width: 64, height: 64, alignItems: 'center', justifyContent: 'center' },
  detailRow: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 4 },
  actionRow: { flexDirection: 'row', gap: 12 },
});
