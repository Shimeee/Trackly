import React from 'react';
import { Pressable, View, Text, StyleSheet } from 'react-native';
import { useTranslation } from 'react-i18next';
import { useTheme } from '../theme/ThemeProvider';
import { type as textType } from '../theme/typography';
import { Card } from './Card';
import { Badge } from './Badge';
import { CategoryIcon } from './CategoryIcon';
import { Subscription } from '../store/subscriptionsStore';
import { useSettingsStore } from '../store/settingsStore';
import { formatMoney, formatShortDate } from '../utils/format';

export function SubscriptionListItem({ sub, onPress }: { sub: Subscription; onPress: () => void }) {
  const { colors, spacing } = useTheme();
  const { t } = useTranslation();
  const categories = useSettingsStore((s) => s.categories);
  const currency = useSettingsStore((s) => s.currency);
  const category = categories.find((c) => c.id === sub.categoryId) || categories[categories.length - 1];

  const cycle = cycleAbbr(sub.billingCycle, t);
  const amount = formatMoney(sub.cost, currency);
  const metaText =
    sub.status === 'trial'
      ? t('subscriptionListItem.trialEnds', { date: formatShortDate(sub.trialEndsDate || sub.nextBillingDate), amount, cycle })
      : sub.status === 'paused'
      ? t('subscriptionListItem.paused', { amount, cycle })
      : sub.status === 'cancelled'
      ? t('subscriptionListItem.cancelled', { amount, cycle })
      : t('subscriptionListItem.renews', { date: formatShortDate(sub.nextBillingDate), amount, cycle });

  return (
    <Pressable onPress={onPress} style={({ pressed }) => ({ opacity: pressed ? 0.7 : 1 })}>
      <Card style={{ flexDirection: 'row', alignItems: 'center', padding: spacing.md, gap: spacing.md }}>
        <CategoryIcon icon={category.icon} color={category.color} />
        <View style={{ flex: 1 }}>
          <Text style={[textType.bodyMedium, { color: colors.textPrimary }]}>{sub.name}</Text>
          <Text style={[textType.bodySmall, { color: colors.textTertiary, marginTop: 2 }]}>{metaText}</Text>
        </View>
        <Badge status={sub.status} />
      </Card>
    </Pressable>
  );
}

function cycleAbbr(cycle: string, t: (key: string) => string) {
  if (cycle === 'Yearly') return t('subscriptionListItem.cycleYr');
  if (cycle === 'Weekly') return t('subscriptionListItem.cycleWk');
  return t('subscriptionListItem.cycleMo');
}

const styles = StyleSheet.create({});
