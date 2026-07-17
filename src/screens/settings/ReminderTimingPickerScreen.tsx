import React from 'react';
import { Text, Pressable, StyleSheet } from 'react-native';
import { Check } from 'lucide-react-native';
import { useNavigation } from '@react-navigation/native';
import { useTranslation } from 'react-i18next';
import { Screen } from '../../components/Screen';
import { ScreenHeader } from '../../components/ScreenHeader';
import { Card } from '../../components/Card';
import { Divider } from '../../components/Row';
import { useTheme } from '../../theme/ThemeProvider';
import { type as textType } from '../../theme/typography';
import { useSettingsStore } from '../../store/settingsStore';

export function ReminderTimingPickerScreen() {
  const { colors } = useTheme();
  const navigation = useNavigation();
  const { t } = useTranslation();
  const defaultReminderDays = useSettingsStore((s) => s.defaultReminderDays);
  const setDefaultReminderDays = useSettingsStore((s) => s.setDefaultReminderDays);

  const OPTIONS = [
    { value: 0, label: t('common.onBillingDate') },
    { value: 1, label: t('common.daysBefore', { count: 1 }) },
    { value: 3, label: t('common.daysBefore', { count: 3 }) },
    { value: 7, label: t('common.daysBefore', { count: 7 }) },
    { value: 14, label: t('common.daysBefore', { count: 14 }) },
    { value: 30, label: t('common.daysBefore', { count: 30 }) },
  ];

  return (
    <Screen>
      <ScreenHeader title={t('reminderTimingPicker.title')} />
      <Text style={[textType.body, { color: colors.textTertiary }]}>{t('reminderTimingPicker.subtitle')}</Text>
      <Card>
        {OPTIONS.map((opt, i) => (
          <React.Fragment key={opt.value}>
            <Pressable onPress={() => { setDefaultReminderDays(opt.value); navigation.goBack(); }} style={styles.row}>
              <Text style={[textType.body, { color: defaultReminderDays === opt.value ? colors.accentPrimary : colors.textPrimary, flex: 1 }]}>{opt.label}</Text>
              {defaultReminderDays === opt.value && <Check size={20} color={colors.accentPrimary} />}
            </Pressable>
            {i < OPTIONS.length - 1 && <Divider />}
          </React.Fragment>
        ))}
      </Card>
    </Screen>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'center', paddingVertical: 14, paddingHorizontal: 16 },
});
