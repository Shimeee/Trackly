import React, { useMemo } from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Bell, Calendar, Search } from 'lucide-react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useTranslation } from 'react-i18next';
import { Screen } from '../../components/Screen';
import { Button } from '../../components/Button';
import { StatTile } from '../../components/StatTile';
import { SubscriptionListItem } from '../../components/SubscriptionListItem';
import { Card } from '../../components/Card';
import { AnimatedProgressBar } from '../../components/AnimatedProgressBar';
import { FadeSlideIn } from '../../components/FadeSlideIn';
import { useTheme } from '../../theme/ThemeProvider';
import { type as textType } from '../../theme/typography';
import {
  useSubscriptionsStore,
  selectActive,
  selectMonthlySpend,
  selectYearlyProjected,
  selectDueSoon,
  selectCategoryBreakdown,
} from '../../store/subscriptionsStore';
import { useSettingsStore } from '../../store/settingsStore';
import { formatMoney, formatShortDate } from '../../utils/format';
import { getServiceIcon } from '../../utils/serviceIcons';
import { categoryName } from '../../utils/categoryLabel';
import { RootStackParamList } from '../../navigation/types';

export function DashboardScreen() {
  const { colors, spacing, radius } = useTheme();
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const { t } = useTranslation();
  const currency = useSettingsStore((s) => s.currency);
  const categories = useSettingsStore((s) => s.categories);
  const firstName = useSettingsStore((s) => s.firstName);
  const notificationsEnabled = useSettingsStore((s) => s.notificationsEnabled);

  const subscriptions = useSubscriptionsStore((s) => s.subscriptions);
  const notifications = useSubscriptionsStore((s) => s.notifications);

  const active = useMemo(() => selectActive(subscriptions), [subscriptions]);
  const monthlySpend = useMemo(() => selectMonthlySpend(subscriptions), [subscriptions]);
  const yearlyProjected = useMemo(() => selectYearlyProjected(subscriptions), [subscriptions]);
  const dueSoon = useMemo(() => selectDueSoon(subscriptions, 14), [subscriptions]);
  const categoryBreakdown = useMemo(() => selectCategoryBreakdown(subscriptions), [subscriptions]);
  const unreadCount = useMemo(() => notifications.filter((n) => !n.read).length, [notifications]);

  const hour = new Date().getHours();
  const greetingKey = hour < 12 ? 'dashboard.greetingMorning' : hour < 18 ? 'dashboard.greetingAfternoon' : 'dashboard.greetingEvening';
  const nextCharge = dueSoon[0];

  return (
    <Screen>
      <View style={styles.headerRow}>
        <Text style={[textType.heading, { color: colors.textPrimary }]}>{t(greetingKey, { name: firstName })}</Text>
        <View style={styles.headerActions}>
          <Pressable onPress={() => navigation.navigate('SearchFilters')} hitSlop={10}>
            <Search size={24} color={colors.textPrimary} />
          </Pressable>
          <Pressable onPress={() => navigation.navigate('NotificationCenter')} hitSlop={10}>
            <Bell size={24} color={colors.textPrimary} />
            {unreadCount > 0 && <View style={[styles.dot, { backgroundColor: colors.statusError }]} />}
          </Pressable>
        </View>
      </View>

      {active.length === 0 ? (
        <View style={styles.emptyWrap}>
          <View style={[styles.emptyIcon, { backgroundColor: colors.accentSubtleBg, borderRadius: radius.full }]}>
            <Calendar size={32} color={colors.accentPrimary} />
          </View>
          <Text style={[textType.subheading, { color: colors.textPrimary, textAlign: 'center', marginTop: 16 }]}>
            {t('dashboard.emptyTitle')}
          </Text>
          <Text style={[textType.body, { color: colors.textTertiary, textAlign: 'center', marginTop: 8 }]}>
            {t('dashboard.emptyBody')}
          </Text>
          <View style={{ marginTop: 20, width: '100%' }}>
            <Button label={t('dashboard.addSubscription')} onPress={() => navigation.navigate('AddServiceSelection')} />
          </View>
        </View>
      ) : (
        <>
          <View style={styles.statRow}>
            <StatTile label={t('dashboard.monthlySpend')} value={formatMoney(monthlySpend, currency)} />
            <StatTile label={t('dashboard.yearlyProjected')} value={formatMoney(yearlyProjected, currency)} />
          </View>

          <Text style={[textType.bodySmall, { color: colors.textTertiary }]}>{t('dashboard.activeSubscriptions', { count: active.length })}</Text>

          {nextCharge ? (
            <FadeSlideIn>
              <Pressable onPress={() => navigation.navigate('SubscriptionDetails', { id: nextCharge.id })}>
                <LinearGradient
                  colors={[colors.accentPrimary, '#6D28D9']}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                  style={[styles.heroCard, { borderRadius: radius.xl }]}
                >
                  <View style={styles.heroTopRow}>
                    <Text style={[textType.label, { color: '#E4E8FF' }]}>{t('dashboard.nextCharge')}</Text>
                    <View style={[styles.heroIconWrap, { backgroundColor: 'rgba(255,255,255,0.18)', borderRadius: radius.full }]}>
                      {React.createElement(getServiceIcon(nextCharge.name), { size: 16, color: '#FFFFFF' })}
                    </View>
                  </View>
                  <View style={styles.heroRow}>
                    <Text style={[textType.subheading, { color: '#FFFFFF' }]}>{nextCharge.name}</Text>
                    <Text style={[textType.subheading, { color: '#FFFFFF' }]}>{formatMoney(nextCharge.cost, currency)}</Text>
                  </View>
                  <Text style={[textType.bodySmall, { color: '#E4E8FF', marginTop: 8 }]}>
                    {t('dashboard.renews', { date: formatShortDate(nextCharge.nextBillingDate) })}
                  </Text>
                </LinearGradient>
              </Pressable>
            </FadeSlideIn>
          ) : null}

          {dueSoon.length > 1 && (
            <View style={{ gap: 12 }}>
              <Text style={[textType.subheading, { color: colors.textPrimary }]}>{t('dashboard.dueSoon')}</Text>
              {dueSoon.slice(1, 4).map((sub, i) => (
                <FadeSlideIn key={sub.id} delay={80 * (i + 1)}>
                  <SubscriptionListItem sub={sub} onPress={() => navigation.navigate('SubscriptionDetails', { id: sub.id })} />
                </FadeSlideIn>
              ))}
            </View>
          )}

          {categoryBreakdown.length > 0 && (
            <View style={{ gap: 12 }}>
              <Text style={[textType.subheading, { color: colors.textPrimary }]}>{t('dashboard.spendingByCategory')}</Text>
              <Card style={{ padding: spacing.lg, gap: 14 }}>
                {categoryBreakdown.map((cb, i) => {
                  const cat = categories.find((c) => c.id === cb.categoryId);
                  return (
                    <View key={cb.categoryId} style={{ gap: 4 }}>
                      <View style={styles.catLabelRow}>
                        <Text style={[textType.bodySmall, { color: colors.textPrimary }]}>{categoryName(cat, t)}</Text>
                        <Text style={[textType.bodySmall, { color: colors.textTertiary }]}>{cb.percent}%</Text>
                      </View>
                      <AnimatedProgressBar percent={cb.percent} color={cat?.color || colors.textTertiary} delay={i * 80} />
                    </View>
                  );
                })}
              </Card>
            </View>
          )}
        </>
      )}
    </Screen>
  );
}

const styles = StyleSheet.create({
  headerRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  headerActions: { flexDirection: 'row', alignItems: 'center', gap: 16 },
  dot: { position: 'absolute', top: -2, right: -2, width: 8, height: 8, borderRadius: 4 },
  emptyWrap: { alignItems: 'center', paddingTop: 80 },
  emptyIcon: { width: 72, height: 72, alignItems: 'center', justifyContent: 'center' },
  statRow: { flexDirection: 'row', gap: 12 },
  heroCard: {
    padding: 20,
    gap: 6,
    shadowColor: '#4338CA',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 16,
    elevation: 6,
  },
  heroTopRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  heroIconWrap: { width: 28, height: 28, alignItems: 'center', justifyContent: 'center' },
  heroRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 8 },
  catLabelRow: { flexDirection: 'row', justifyContent: 'space-between' },
});
