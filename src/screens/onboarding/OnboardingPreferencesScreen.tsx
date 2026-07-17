import React from 'react';
import { View, Text } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useTranslation } from 'react-i18next';
import { Screen } from '../../components/Screen';
import { Button } from '../../components/Button';
import { Row, Divider } from '../../components/Row';
import { Card } from '../../components/Card';
import { useTheme } from '../../theme/ThemeProvider';
import { type as textType } from '../../theme/typography';
import { useSettingsStore } from '../../store/settingsStore';
import { RootStackParamList } from '../../navigation/types';

export function OnboardingPreferencesScreen() {
  const { colors } = useTheme();
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const { t } = useTranslation();
  const currency = useSettingsStore((s) => s.currency);
  const region = useSettingsStore((s) => s.region);
  const defaultReminderDays = useSettingsStore((s) => s.defaultReminderDays);

  return (
    <Screen>
      <Text style={[textType.title, { color: colors.textPrimary }]}>{t('onboardingPreferences.heading')}</Text>
      <Text style={[textType.body, { color: colors.textTertiary }]}>{t('onboardingPreferences.subheading')}</Text>

      <Card>
        <Row label={t('onboardingPreferences.defaultCurrency')} value={`${currency} — Egyptian Pound`} onPress={() => navigation.navigate('CurrencyPicker')} />
        <Divider />
        <Row label={t('onboardingPreferences.countryRegion')} value={region} onPress={() => navigation.navigate('RegionDateFormat')} />
        <Divider />
        <Row label={t('onboardingPreferences.reminderTiming')} value={t('onboardingPreferences.daysBefore', { count: defaultReminderDays })} onPress={() => navigation.navigate('ReminderTimingPicker')} />
      </Card>

      <View style={{ flex: 1 }} />
      <Button label={t('common.continue')} onPress={() => navigation.navigate('NotificationPrePermission')} />
    </Screen>
  );
}
