import React from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useTranslation } from 'react-i18next';
import { Screen } from '../../components/Screen';
import { Card } from '../../components/Card';
import { Row, Divider } from '../../components/Row';
import { useTheme } from '../../theme/ThemeProvider';
import { type as textType } from '../../theme/typography';
import { useSettingsStore } from '../../store/settingsStore';
import { RootStackParamList } from '../../navigation/types';

export function SettingsScreen() {
  const { colors, spacing, radius } = useTheme();
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const { t } = useTranslation();
  const userName = useSettingsStore((s) => s.userName);
  const userEmail = useSettingsStore((s) => s.userEmail);
  const currency = useSettingsStore((s) => s.currency);
  const region = useSettingsStore((s) => s.region);
  const dateFormat = useSettingsStore((s) => s.dateFormat);
  const defaultReminderDays = useSettingsStore((s) => s.defaultReminderDays);
  const quietHoursStart = useSettingsStore((s) => s.quietHoursStart);
  const quietHoursEnd = useSettingsStore((s) => s.quietHoursEnd);
  const appearance = useSettingsStore((s) => s.appearance);
  const language = useSettingsStore((s) => s.language);

  const appearanceLabel = appearance === 'system' ? t('common.system') : appearance === 'dark' ? t('appearance.dark') : t('appearance.light');
  const initials = userName.split(' ').map((n) => n[0]).slice(0, 2).join('').toUpperCase();

  return (
    <Screen>
      <Text style={[textType.heading, { color: colors.textPrimary }]}>{t('settings.title')}</Text>

      <Pressable onPress={() => navigation.navigate('ProfileAccount')} style={({ pressed }) => ({ opacity: pressed ? 0.7 : 1 })}>
        <Card style={{ flexDirection: 'row', alignItems: 'center', padding: spacing.md, gap: spacing.md }}>
          <View style={[styles.avatar, { backgroundColor: colors.accentPrimary, borderRadius: radius.full }]}>
            <Text style={[textType.bodyMedium, { color: '#FFFFFF' }]}>{initials}</Text>
          </View>
          <View style={{ flex: 1 }}>
            <Text style={[textType.bodyMedium, { color: colors.textPrimary }]}>{userName}</Text>
            <Text style={[textType.bodySmall, { color: colors.textTertiary, marginTop: 2 }]}>{userEmail}</Text>
          </View>
        </Card>
      </Pressable>

      <SettingsSection title={t('settings.sectionPreferences')}>
        <Row label={t('settings.rowDefaultCurrency')} value={currency} onPress={() => navigation.navigate('CurrencyPicker')} />
        <Divider />
        <Row label={t('settings.rowRegionDateFormat')} value={`${region} · ${dateFormat}`} onPress={() => navigation.navigate('RegionDateFormat')} />
        <Divider />
        <Row label={t('settings.rowDefaultReminderTiming')} value={t('common.daysBefore', { count: defaultReminderDays })} onPress={() => navigation.navigate('ReminderTimingPicker')} />
        <Divider />
        <Row label={t('settings.rowQuietHours')} value={`${quietHoursStart} – ${quietHoursEnd}`} onPress={() => navigation.navigate('QuietHoursPicker')} />
        <Divider />
        <Row label={t('settings.rowManageCategories')} onPress={() => navigation.navigate('ManageCategories')} />
        <Divider />
        <Row label={t('settings.rowAppearance')} value={appearanceLabel} onPress={() => navigation.navigate('Appearance')} />
        <Divider />
        <Row label={t('settings.rowLanguage')} value={language === 'system' ? t('common.system') : language === 'ar' ? t('language.arabic') : t('language.english')} onPress={() => navigation.navigate('LanguagePicker')} />
      </SettingsSection>

      <SettingsSection title={t('settings.sectionNotifications')}>
        <Row label={t('settings.rowNotificationPreferences')} onPress={() => navigation.navigate('NotificationPreferences')} />
      </SettingsSection>

      <SettingsSection title={t('settings.sectionData')}>
        <Row label={t('settings.rowExportData')} onPress={() => navigation.navigate('ExportData')} />
        <Divider />
        <Row label={t('settings.rowCloudBackupSync')} value={t('settings.upToDate')} onPress={() => navigation.navigate('CloudBackupSync')} />
        <Divider />
        <Row label={t('settings.rowArchivedItems')} onPress={() => navigation.navigate('ArchivedSubscriptions')} />
      </SettingsSection>

      <SettingsSection title={t('settings.sectionAccount')}>
        <Row label={t('settings.rowPrivacySecurity')} onPress={() => navigation.navigate('PrivacySecurity')} />
        <Divider />
        <Row label={t('settings.rowSignOut')} onPress={() => navigation.navigate('SignOutConfirmation')} />
        <Divider />
        <Row label={t('settings.rowDeleteAccount')} destructive onPress={() => navigation.navigate('DeleteAccountConfirmation')} />
      </SettingsSection>
    </Screen>
  );
}

function SettingsSection({ title, children }: { title: string; children: React.ReactNode }) {
  const { colors } = useTheme();
  return (
    <View style={{ gap: 8 }}>
      <Text style={[textType.label, { color: colors.textTertiary }]}>{title}</Text>
      <Card>{children}</Card>
    </View>
  );
}

const styles = StyleSheet.create({
  avatar: { width: 44, height: 44, alignItems: 'center', justifyContent: 'center' },
});
