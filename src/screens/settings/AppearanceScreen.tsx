import React from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import { useTranslation } from 'react-i18next';
import { Screen } from '../../components/Screen';
import { ScreenHeader } from '../../components/ScreenHeader';
import { Card } from '../../components/Card';
import { Divider } from '../../components/Row';
import { useTheme } from '../../theme/ThemeProvider';
import { type as textType } from '../../theme/typography';
import { useSettingsStore, Appearance } from '../../store/settingsStore';

export function AppearanceScreen() {
  const { colors } = useTheme();
  const { t } = useTranslation();
  const appearance = useSettingsStore((s) => s.appearance);
  const setAppearance = useSettingsStore((s) => s.setAppearance);

  const OPTIONS: { value: Appearance; label: string; sub?: string }[] = [
    { value: 'system', label: t('common.system'), sub: t('appearance.systemSub') },
    { value: 'light', label: t('appearance.light') },
    { value: 'dark', label: t('appearance.dark') },
  ];

  return (
    <Screen>
      <ScreenHeader title={t('appearance.title')} />
      <Card>
        {OPTIONS.map((opt, i) => (
          <React.Fragment key={opt.value}>
            <Pressable onPress={() => setAppearance(opt.value)} style={styles.row}>
              <View style={{ flex: 1 }}>
                <Text style={[textType.body, { color: colors.textPrimary }]}>{opt.label}</Text>
                {opt.sub ? <Text style={[textType.caption, { color: colors.textTertiary, marginTop: 2 }]}>{opt.sub}</Text> : null}
              </View>
              <View
                style={[
                  styles.radio,
                  { borderColor: appearance === opt.value ? colors.accentPrimary : colors.borderDefault, borderWidth: appearance === opt.value ? 7 : 2 },
                ]}
              />
            </Pressable>
            {i < OPTIONS.length - 1 && <Divider />}
          </React.Fragment>
        ))}
      </Card>
      <Text style={[textType.caption, { color: colors.textTertiary }]}>{t('appearance.oledNote')}</Text>
    </Screen>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'center', paddingVertical: 14, paddingHorizontal: 16 },
  radio: { width: 22, height: 22, borderRadius: 11 },
});
