import React from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import { useTranslation } from 'react-i18next';
import { Screen } from '../../components/Screen';
import { ScreenHeader } from '../../components/ScreenHeader';
import { Card } from '../../components/Card';
import { Divider } from '../../components/Row';
import { useTheme } from '../../theme/ThemeProvider';
import { type as textType } from '../../theme/typography';
import { useSettingsStore, LanguagePreference } from '../../store/settingsStore';

export function LanguagePickerScreen() {
  const { colors } = useTheme();
  const { t } = useTranslation();
  const language = useSettingsStore((s) => s.language);
  const setLanguage = useSettingsStore((s) => s.setLanguage);

  const OPTIONS: { value: LanguagePreference; label: string; sub?: string }[] = [
    { value: 'system', label: t('common.system'), sub: t('language.systemSub') },
    { value: 'en', label: t('language.english') },
    { value: 'ar', label: t('language.arabic') },
  ];

  return (
    <Screen>
      <ScreenHeader title={t('language.title')} />
      <Card>
        {OPTIONS.map((opt, i) => (
          <React.Fragment key={opt.value}>
            <Pressable onPress={() => setLanguage(opt.value)} style={styles.row}>
              <View style={{ flex: 1 }}>
                <Text style={[textType.body, { color: colors.textPrimary }]}>{opt.label}</Text>
                {opt.sub ? <Text style={[textType.caption, { color: colors.textTertiary, marginTop: 2 }]}>{opt.sub}</Text> : null}
              </View>
              <View
                style={[
                  styles.radio,
                  { borderColor: language === opt.value ? colors.accentPrimary : colors.borderDefault, borderWidth: language === opt.value ? 7 : 2 },
                ]}
              />
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
  radio: { width: 22, height: 22, borderRadius: 11 },
});
