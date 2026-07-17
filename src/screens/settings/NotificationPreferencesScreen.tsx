import React, { useCallback, useState } from 'react';
import { View, Text, Alert, Linking } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { useTranslation } from 'react-i18next';
import { Screen } from '../../components/Screen';
import { ScreenHeader } from '../../components/ScreenHeader';
import { Card } from '../../components/Card';
import { Toggle } from '../../components/Toggle';
import { Divider } from '../../components/Row';
import { useTheme } from '../../theme/ThemeProvider';
import { type as textType } from '../../theme/typography';
import { useSettingsStore } from '../../store/settingsStore';
import { getNotificationPermissionState, requestNotificationPermission } from '../../utils/notifications';

function ToggleRow({ label, sub, value, onChange }: { label: string; sub?: string; value: boolean; onChange: (v: boolean) => void }) {
  const { colors, spacing } = useTheme();
  return (
    <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: spacing.md, paddingHorizontal: spacing.lg }}>
      <View style={{ flex: 1, marginRight: 12 }}>
        <Text style={[textType.body, { color: colors.textPrimary }]}>{label}</Text>
        {sub ? <Text style={[textType.caption, { color: colors.textTertiary, marginTop: 2 }]}>{sub}</Text> : null}
      </View>
      <Toggle value={value} onChange={onChange} />
    </View>
  );
}

export function NotificationPreferencesScreen() {
  const { colors } = useTheme();
  const { t } = useTranslation();
  const [renewal, setRenewal] = useState(true);
  const [trial, setTrial] = useState(true);
  const [price, setPrice] = useState(true);
  const [cancellation, setCancellation] = useState(false);
  const [weekly, setWeekly] = useState(false);
  const [monthly, setMonthly] = useState(true);
  const [email, setEmail] = useState(false);
  const setNotificationsEnabled = useSettingsStore((s) => s.setNotificationsEnabled);
  const [osGranted, setOsGranted] = useState(false);
  const [canAskAgain, setCanAskAgain] = useState(true);

  useFocusEffect(
    useCallback(() => {
      getNotificationPermissionState().then(({ granted, canAskAgain: askAgain }) => {
        setOsGranted(granted);
        setCanAskAgain(askAgain);
        setNotificationsEnabled(granted);
      });
    }, [])
  );

  const push = osGranted;

  const togglePush = async (value: boolean) => {
    if (!value) {
      setOsGranted(false);
      setNotificationsEnabled(false);
      return;
    }
    if (!canAskAgain) {
      Alert.alert(
        t('notificationPreferences.offAlertTitle'),
        t('notificationPreferences.offAlertMessage'),
        [{ text: t('common.cancel'), style: 'cancel' }, { text: t('notificationPreferences.openSettings'), onPress: () => Linking.openSettings() }]
      );
      return;
    }
    const state = await requestNotificationPermission();
    setOsGranted(state.granted);
    setCanAskAgain(state.canAskAgain);
    setNotificationsEnabled(state.granted);
  };

  return (
    <Screen>
      <ScreenHeader title={t('notificationPreferences.title')} />

      <Text style={[textType.label, { color: colors.textTertiary }]}>{t('notificationPreferences.sectionReminders')}</Text>
      <Card>
        <ToggleRow label={t('notificationPreferences.renewalReminders')} sub={t('notificationPreferences.renewalRemindersSub')} value={renewal} onChange={setRenewal} />
        <Divider />
        <ToggleRow label={t('notificationPreferences.freeTrialEndings')} sub={t('notificationPreferences.freeTrialEndingsSub')} value={trial} onChange={setTrial} />
        <Divider />
        <ToggleRow label={t('notificationPreferences.priceChanges')} sub={t('notificationPreferences.priceChangesSub')} value={price} onChange={setPrice} />
        <Divider />
        <ToggleRow label={t('notificationPreferences.cancellationDeadlines')} sub={t('notificationPreferences.cancellationDeadlinesSub')} value={cancellation} onChange={setCancellation} />
      </Card>

      <Text style={[textType.label, { color: colors.textTertiary }]}>{t('notificationPreferences.sectionSummaries')}</Text>
      <Card>
        <ToggleRow label={t('notificationPreferences.weeklyDigest')} sub={t('notificationPreferences.weeklyDigestSub')} value={weekly} onChange={setWeekly} />
        <Divider />
        <ToggleRow label={t('notificationPreferences.monthlyReport')} sub={t('notificationPreferences.monthlyReportSub')} value={monthly} onChange={setMonthly} />
      </Card>

      <Text style={[textType.label, { color: colors.textTertiary }]}>{t('notificationPreferences.sectionDelivery')}</Text>
      <Card>
        <ToggleRow label={t('notificationPreferences.pushNotifications')} value={push} onChange={togglePush} />
        <Divider />
        <ToggleRow label={t('notificationPreferences.email')} value={email} onChange={setEmail} />
      </Card>
    </Screen>
  );
}
