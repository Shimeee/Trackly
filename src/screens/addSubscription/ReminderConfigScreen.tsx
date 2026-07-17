import React, { useState } from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import { Check } from 'lucide-react-native';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useTranslation } from 'react-i18next';
import { Screen } from '../../components/Screen';
import { ScreenHeader } from '../../components/ScreenHeader';
import { Button } from '../../components/Button';
import { Toggle } from '../../components/Toggle';
import { useTheme } from '../../theme/ThemeProvider';
import { type as textType } from '../../theme/typography';
import { useSubscriptionsStore } from '../../store/subscriptionsStore';
import { useSettingsStore } from '../../store/settingsStore';
import { RootStackParamList } from '../../navigation/types';
import { formatMoney } from '../../utils/format';

export function ReminderConfigScreen() {
  const { colors, spacing, radius } = useTheme();
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const route = useRoute<RouteProp<RootStackParamList, 'AddReminderConfig'>>();
  const { t } = useTranslation();
  const DAY_OPTIONS = [
    { label: t('common.onBillingDate'), value: 0 },
    { label: t('common.daysBefore', { count: 1 }), value: 1 },
    { label: t('common.daysBefore', { count: 3 }), value: 3 },
    { label: t('common.daysBefore', { count: 7 }), value: 7 },
    { label: t('common.daysBefore', { count: 14 }), value: 14 },
    { label: t('common.daysBefore', { count: 30 }), value: 30 },
  ];
  const p = route.params;
  const addSubscription = useSubscriptionsStore((s) => s.addSubscription);
  const defaultReminderDays = useSettingsStore((s) => s.defaultReminderDays);
  const quietStart = useSettingsStore((s) => s.quietHoursStart);
  const quietEnd = useSettingsStore((s) => s.quietHoursEnd);
  const currency = useSettingsStore((s) => s.currency);

  const [remindersOn, setRemindersOn] = useState(true);
  const [selectedDays, setSelectedDays] = useState<number[]>([defaultReminderDays]);
  const [renewalReminder, setRenewalReminder] = useState(true);
  const [freeTrialEnding, setFreeTrialEnding] = useState(true);
  const [cancellationDeadline, setCancellationDeadline] = useState(false);
  const [muteNonCritical, setMuteNonCritical] = useState(true);

  const toggleDay = (v: number) => {
    setSelectedDays((prev) => (prev.includes(v) ? prev.filter((d) => d !== v) : [...prev, v]));
  };

  const onSave = () => {
    addSubscription({
      name: p.serviceName,
      categoryId: p.categoryId,
      cost: parseFloat(p.cost) || 0,
      billingCycle: p.billingCycle,
      nextBillingDate: p.nextBillingDate,
      startDate: new Date().toISOString(),
      paymentMethod: p.paymentMethod || undefined,
      isFreeTrial: p.isFreeTrial,
      trialEndsDate: p.isFreeTrial ? p.nextBillingDate : undefined,
      autoRenew: p.autoRenew,
      notes: undefined,
      color: p.serviceColor,
      reminders: {
        onBillingDate: selectedDays.includes(0),
        daysBefore: selectedDays.filter((d) => d > 0),
        renewalReminder,
        freeTrialEnding,
        cancellationDeadline,
        muteNonCritical,
      },
    });
    navigation.navigate('AddConfirmation');
  };

  const previewDays = selectedDays.filter((d) => d > 0).sort((a, b) => a - b)[0] ?? 0;

  return (
    <Screen>
      <ScreenHeader title={t('reminderConfig.title')} />

      <View style={styles.toggleRow}>
        <Text style={[textType.subheading, { color: colors.textPrimary }]}>{t('reminderConfig.reminders')}</Text>
        <Toggle value={remindersOn} onChange={setRemindersOn} />
      </View>

      {remindersOn && (
        <>
          <Text style={[textType.bodySmall, { color: colors.textTertiary }]}>{t('reminderConfig.remindMe')}</Text>
          <View style={{ gap: 4 }}>
            {DAY_OPTIONS.map((opt) => {
              const checked = selectedDays.includes(opt.value);
              return (
                <Pressable key={opt.value} onPress={() => toggleDay(opt.value)} style={styles.checkRow}>
                  <View
                    style={[
                      styles.checkbox,
                      { borderColor: checked ? colors.accentPrimary : colors.borderDefault, backgroundColor: checked ? colors.accentPrimary : 'transparent', borderRadius: 6 },
                    ]}
                  >
                    {checked && <Check size={14} color="#FFFFFF" />}
                  </View>
                  <Text style={[textType.body, { color: colors.textPrimary, marginLeft: 12 }]}>{opt.label}</Text>
                </Pressable>
              );
            })}
          </View>

          <Text style={[textType.bodySmall, { color: colors.textTertiary }]}>{t('reminderConfig.notificationType')}</Text>
          <View style={styles.toggleRow}>
            <Text style={[textType.body, { color: colors.textPrimary }]}>{t('reminderConfig.renewalReminder')}</Text>
            <Toggle value={renewalReminder} onChange={setRenewalReminder} />
          </View>
          <View style={styles.toggleRow}>
            <Text style={[textType.body, { color: colors.textPrimary }]}>{t('reminderConfig.freeTrialEnding')}</Text>
            <Toggle value={freeTrialEnding} onChange={setFreeTrialEnding} />
          </View>
          <View style={styles.toggleRow}>
            <Text style={[textType.body, { color: colors.textPrimary }]}>{t('reminderConfig.cancellationDeadline')}</Text>
            <Toggle value={cancellationDeadline} onChange={setCancellationDeadline} />
          </View>

          <View style={styles.toggleRow}>
            <View>
              <Text style={[textType.body, { color: colors.textPrimary }]}>{t('reminderConfig.muteNonCritical')}</Text>
              <Text style={[textType.caption, { color: colors.textTertiary, marginTop: 2 }]}>{quietStart} – {quietEnd}</Text>
            </View>
            <Toggle value={muteNonCritical} onChange={setMuteNonCritical} />
          </View>

          <View style={[styles.preview, { backgroundColor: colors.bgSurfaceSecondary, borderRadius: radius.lg }]}>
            <Text style={[textType.label, { color: colors.textTertiary }]}>{t('reminderConfig.preview')}</Text>
            <Text style={[textType.bodySmall, { color: colors.textPrimary, marginTop: 4 }]}>
              {t('reminderConfig.previewText', {
                name: p.serviceName,
                when: previewDays > 0 ? t('common.inDays', { count: previewDays }) : t('common.today'),
                amount: formatMoney(parseFloat(p.cost) || 0, currency),
              })}
            </Text>
          </View>
        </>
      )}

      <Button label={t('reminderConfig.saveSubscription')} onPress={onSave} />
    </Screen>
  );
}

const styles = StyleSheet.create({
  toggleRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  checkRow: { flexDirection: 'row', alignItems: 'center', paddingVertical: 8 },
  checkbox: { width: 22, height: 22, borderWidth: 2, alignItems: 'center', justifyContent: 'center' },
  preview: { padding: 16 },
});
