import React, { useMemo } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useTranslation } from 'react-i18next';
import { Screen } from '../../components/Screen';
import { Card } from '../../components/Card';
import { StatTile } from '../../components/StatTile';
import { Divider } from '../../components/Row';
import { useTheme } from '../../theme/ThemeProvider';
import { type as textType } from '../../theme/typography';
import {
  useSubscriptionsStore,
  selectActive,
  selectMonthlySpend,
  selectCategoryBreakdown,
  selectMostExpensive,
  selectArchived,
} from '../../store/subscriptionsStore';
import { useSettingsStore } from '../../store/settingsStore';
import { formatMoney } from '../../utils/format';
import { categoryName } from '../../utils/categoryLabel';

export function InsightsScreen() {
  const { colors, spacing, radius } = useTheme();
  const { t } = useTranslation();
  const CYCLE_UNITS: Record<string, string> = {
    Monthly: t('detailsForm.cycleUnitMonth'),
    Yearly: t('detailsForm.cycleUnitYear'),
    Weekly: t('detailsForm.cycleUnitWeek'),
  };
  const currency = useSettingsStore((s) => s.currency);
  const categories = useSettingsStore((s) => s.categories);
  const subscriptions = useSubscriptionsStore((s) => s.subscriptions);
  const active = useMemo(() => selectActive(subscriptions), [subscriptions]);
  const monthlySpend = useMemo(() => selectMonthlySpend(subscriptions), [subscriptions]);
  const categoryBreakdown = useMemo(() => selectCategoryBreakdown(subscriptions), [subscriptions]);
  const mostExpensive = useMemo(() => selectMostExpensive(subscriptions, 3), [subscriptions]);
  const archived = useMemo(() => selectArchived(subscriptions), [subscriptions]);

  const topCategory = categoryBreakdown[0];
  const topCategoryName = categoryName(categories.find((c) => c.id === topCategory?.categoryId), t);
  const potentialSavings = archived.reduce((sum, s) => sum + s.cost * 12, 0);

  if (active.length === 0) {
    return (
      <Screen>
        <Text style={[textType.heading, { color: colors.textPrimary }]}>{t('insights.title')}</Text>
        <Text style={[textType.body, { color: colors.textTertiary, marginTop: 40, textAlign: 'center' }]}>
          {t('insights.emptyBody')}
        </Text>
      </Screen>
    );
  }

  return (
    <Screen>
      <Text style={[textType.heading, { color: colors.textPrimary }]}>{t('insights.title')}</Text>

      <View style={styles.statRow}>
        <StatTile label={t('insights.thisMonth')} value={formatMoney(monthlySpend, currency)} />
        <StatTile label={t('insights.vsLastMonth')} value="+4.2%" trend={t('insights.trendingUp')} trendPositive={false} />
      </View>

      {topCategory && (
        <View style={[styles.banner, { backgroundColor: colors.statusWarningBg, borderRadius: radius.lg }]}>
          <Text style={[textType.bodySmall, { color: colors.statusWarning }]}>
            {t('insights.topCategoryBanner', { name: topCategoryName, percent: topCategory.percent })}
          </Text>
        </View>
      )}

      <Text style={[textType.subheading, { color: colors.textPrimary }]}>{t('insights.categoryBreakdown')}</Text>
      <Card style={{ padding: spacing.lg, gap: 14 }}>
        {categoryBreakdown.map((cb) => {
          const cat = categories.find((c) => c.id === cb.categoryId);
          return (
            <View key={cb.categoryId} style={{ gap: 4 }}>
              <View style={styles.rowBetween}>
                <Text style={[textType.bodySmall, { color: colors.textPrimary }]}>{categoryName(cat, t)}</Text>
                <Text style={[textType.bodySmall, { color: colors.textTertiary }]}>{cb.percent}% · {formatMoney(cb.total, currency)}</Text>
              </View>
              <View style={[styles.barBg, { backgroundColor: colors.bgSurfaceSecondary, borderRadius: 3 }]}>
                <View style={[styles.barFill, { width: `${cb.percent}%`, backgroundColor: cat?.color || colors.textTertiary, borderRadius: 3 }]} />
              </View>
            </View>
          );
        })}
      </Card>

      <Text style={[textType.subheading, { color: colors.textPrimary }]}>{t('insights.mostExpensive')}</Text>
      <Card style={{ paddingHorizontal: spacing.lg }}>
        {mostExpensive.map((sub, i) => (
          <React.Fragment key={sub.id}>
            <View style={[styles.expRow, { paddingVertical: spacing.md }]}>
              <Text style={[textType.body, { color: colors.textPrimary }]}>{sub.name}</Text>
              <Text style={[textType.bodySmall, { color: colors.textTertiary }]}>{formatMoney(sub.cost, currency)}/{CYCLE_UNITS[sub.billingCycle] || sub.billingCycle}</Text>
            </View>
            {i < mostExpensive.length - 1 && <Divider />}
          </React.Fragment>
        ))}
      </Card>

      {archived.length > 0 && (
        <View style={[styles.banner, { backgroundColor: colors.statusSuccessBg, borderRadius: radius.lg }]}>
          <Text style={[textType.caption, { color: colors.statusSuccess }]}>{t('insights.savedByCancelling')}</Text>
          <Text style={[textType.subheading, { color: colors.statusSuccess, marginTop: 2 }]}>{t('insights.thisYear', { amount: formatMoney(potentialSavings, currency) })}</Text>
        </View>
      )}
    </Screen>
  );
}

const styles = StyleSheet.create({
  statRow: { flexDirection: 'row', gap: 12 },
  banner: { padding: 16 },
  rowBetween: { flexDirection: 'row', justifyContent: 'space-between' },
  barBg: { height: 6, overflow: 'hidden' },
  barFill: { height: 6 },
  expRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
});
