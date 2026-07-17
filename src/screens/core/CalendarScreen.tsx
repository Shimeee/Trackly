import React, { useMemo, useState } from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import { ChevronLeft, ChevronRight } from 'lucide-react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useTranslation } from 'react-i18next';
import { useIsRTL } from '../../i18n';
import { Screen } from '../../components/Screen';
import { Card } from '../../components/Card';
import { SubscriptionListItem } from '../../components/SubscriptionListItem';
import { useTheme } from '../../theme/ThemeProvider';
import { type as textType } from '../../theme/typography';
import { useSubscriptionsStore, selectActive } from '../../store/subscriptionsStore';
import { useSettingsStore } from '../../store/settingsStore';
import { RootStackParamList } from '../../navigation/types';
import { formatMoney } from '../../utils/format';

export function CalendarScreen() {
  const { colors, spacing, radius } = useTheme();
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const { t } = useTranslation();
  const isRTL = useIsRTL();
  const WEEKDAYS = t('calendar.weekdays', { returnObjects: true }) as string[];
  const MONTHS = t('calendar.months', { returnObjects: true }) as string[];
  const currency = useSettingsStore((s) => s.currency);
  const subscriptions = useSubscriptionsStore((s) => s.subscriptions);
  const active = useMemo(() => selectActive(subscriptions), [subscriptions]);
  const [cursor, setCursor] = useState(() => { const d = new Date(); d.setDate(1); return d; });
  const [selectedDay, setSelectedDay] = useState(new Date().getDate());

  const year = cursor.getFullYear();
  const month = cursor.getMonth();
  const isCurrentMonth = new Date().getFullYear() === year && new Date().getMonth() === month;

  const daysWithPayments = useMemo(() => {
    const map: Record<number, number> = {};
    for (const sub of active) {
      const d = new Date(sub.nextBillingDate);
      if (d.getFullYear() === year && d.getMonth() === month) {
        map[d.getDate()] = (map[d.getDate()] || 0) + 1;
      }
    }
    return map;
  }, [active, year, month]);

  const firstWeekday = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const cells: (number | null)[] = [...Array(firstWeekday).fill(null), ...Array.from({ length: daysInMonth }, (_, i) => i + 1)];

  const selectedSubs = active.filter((s) => {
    const d = new Date(s.nextBillingDate);
    return d.getFullYear() === year && d.getMonth() === month && d.getDate() === selectedDay;
  });
  const selectedTotal = selectedSubs.reduce((sum, s) => sum + s.cost, 0);

  const upcoming = [...active]
    .filter((s) => new Date(s.nextBillingDate).getTime() >= Date.now())
    .sort((a, b) => new Date(a.nextBillingDate).getTime() - new Date(b.nextBillingDate).getTime())
    .slice(0, 5);

  return (
    <Screen>
      <Text style={[textType.heading, { color: colors.textPrimary }]}>{t('calendar.title')}</Text>

      <Card style={{ padding: spacing.lg, gap: spacing.md }}>
        <View style={styles.monthRow}>
          <Text style={[textType.bodyMedium, { color: colors.textPrimary }]}>{MONTHS[month]} {year}</Text>
          <View style={styles.arrowRow}>
            <Pressable onPress={() => setCursor(new Date(year, month - 1, 1))} hitSlop={8}>
              {isRTL ? <ChevronRight size={20} color={colors.textPrimary} /> : <ChevronLeft size={20} color={colors.textPrimary} />}
            </Pressable>
            <Pressable onPress={() => setCursor(new Date(year, month + 1, 1))} hitSlop={8}>
              {isRTL ? <ChevronLeft size={20} color={colors.textPrimary} /> : <ChevronRight size={20} color={colors.textPrimary} />}
            </Pressable>
          </View>
        </View>

        <View style={styles.weekRow}>
          {WEEKDAYS.map((w, i) => (
            <Text key={i} style={[textType.caption, { color: colors.textTertiary, width: 36, textAlign: 'center' }]}>{w}</Text>
          ))}
        </View>

        <View style={styles.grid}>
          {cells.map((day, i) => {
            const isSelected = isCurrentMonth ? day === selectedDay : false;
            const hasPayment = day ? !!daysWithPayments[day] : false;
            return (
              <Pressable
                key={i}
                disabled={!day}
                onPress={() => day && setSelectedDay(day)}
                style={[
                  styles.cell,
                  { borderRadius: radius.full },
                  isSelected && { backgroundColor: colors.accentPrimary },
                ]}
              >
                {day ? (
                  <>
                    <Text style={[textType.bodySmall, { color: isSelected ? '#FFFFFF' : colors.textPrimary }]}>{day}</Text>
                    {hasPayment && <View style={[styles.dot, { backgroundColor: isSelected ? '#FFFFFF' : colors.accentPrimary }]} />}
                  </>
                ) : null}
              </Pressable>
            );
          })}
        </View>
      </Card>

      {selectedSubs.length > 0 && (
        <View style={[styles.totalCard, { backgroundColor: colors.accentSubtleBg, borderRadius: radius.lg }]}>
          <Text style={[textType.bodySmall, { color: colors.accentPrimary }]}>
            {MONTHS[month].slice(0, 3)} {selectedDay} · {t('calendar.paymentsDue', { count: selectedSubs.length })}
          </Text>
          <Text style={[textType.bodyMedium, { color: colors.accentPrimary }]}>{formatMoney(selectedTotal, currency)}</Text>
        </View>
      )}

      <Text style={[textType.subheading, { color: colors.textPrimary }]}>{t('calendar.upcoming')}</Text>
      {upcoming.length === 0 ? (
        <Text style={[textType.body, { color: colors.textTertiary }]}>{t('calendar.noUpcoming')}</Text>
      ) : (
        <View style={{ gap: 12 }}>
          {upcoming.map((sub) => (
            <SubscriptionListItem key={sub.id} sub={sub} onPress={() => navigation.navigate('SubscriptionDetails', { id: sub.id })} />
          ))}
        </View>
      )}
    </Screen>
  );
}

const styles = StyleSheet.create({
  monthRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  arrowRow: { flexDirection: 'row', gap: 16 },
  weekRow: { flexDirection: 'row', justifyContent: 'space-between' },
  grid: { flexDirection: 'row', flexWrap: 'wrap' },
  cell: { width: '14.28%', height: 40, alignItems: 'center', justifyContent: 'center' },
  dot: { width: 4, height: 4, borderRadius: 2, marginTop: 2 },
  totalCard: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 16 },
});
