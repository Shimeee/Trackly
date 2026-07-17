import React from 'react';
import { Pressable, Text, StyleSheet } from 'react-native';
import { Check } from 'lucide-react-native';
import { useTranslation } from 'react-i18next';
import { Screen } from '../../components/Screen';
import { ScreenHeader } from '../../components/ScreenHeader';
import { Card } from '../../components/Card';
import { Divider } from '../../components/Row';
import { useTheme } from '../../theme/ThemeProvider';
import { type as textType } from '../../theme/typography';
import { useSettingsStore } from '../../store/settingsStore';

const REGIONS = ['Egypt', 'United Arab Emirates', 'Saudi Arabia', 'United States', 'United Kingdom'];
const FORMATS = [
  { value: 'DD/MM/YYYY', example: '18/08/2026' },
  { value: 'MM/DD/YYYY', example: '08/18/2026' },
  { value: 'YYYY-MM-DD', example: '2026-08-18' },
];

export function RegionDateFormatScreen() {
  const { colors } = useTheme();
  const { t } = useTranslation();
  const region = useSettingsStore((s) => s.region);
  const dateFormat = useSettingsStore((s) => s.dateFormat);
  const setRegion = useSettingsStore((s) => s.setRegion);
  const setDateFormat = useSettingsStore((s) => s.setDateFormat);

  return (
    <Screen>
      <ScreenHeader title={t('regionDateFormat.title')} />

      <Text style={[textType.label, { color: colors.textTertiary }]}>{t('regionDateFormat.region')}</Text>
      <Card>
        {REGIONS.map((r, i) => (
          <React.Fragment key={r}>
            <Pressable onPress={() => setRegion(r)} style={styles.row}>
              <Text style={[textType.body, { color: region === r ? colors.accentPrimary : colors.textPrimary, flex: 1 }]}>{t(`regionDateFormat.regions.${r}`)}</Text>
              {region === r && <Check size={20} color={colors.accentPrimary} />}
            </Pressable>
            {i < REGIONS.length - 1 && <Divider />}
          </React.Fragment>
        ))}
      </Card>

      <Text style={[textType.label, { color: colors.textTertiary }]}>{t('regionDateFormat.dateFormatLabel')}</Text>
      <Card>
        {FORMATS.map((f, i) => (
          <React.Fragment key={f.value}>
            <Pressable onPress={() => setDateFormat(f.value)} style={styles.row}>
              <Text style={[textType.body, { color: dateFormat === f.value ? colors.accentPrimary : colors.textPrimary }]}>{f.value}</Text>
              <Text style={[textType.bodySmall, { color: colors.textTertiary, flex: 1, textAlign: 'right', marginRight: 8 }]}>{f.example}</Text>
              {dateFormat === f.value && <Check size={20} color={colors.accentPrimary} />}
            </Pressable>
            {i < FORMATS.length - 1 && <Divider />}
          </React.Fragment>
        ))}
      </Card>
    </Screen>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'center', paddingVertical: 14, paddingHorizontal: 16 },
});
