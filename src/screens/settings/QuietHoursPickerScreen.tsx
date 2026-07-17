import React, { useState } from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useTranslation } from 'react-i18next';
import { Screen } from '../../components/Screen';
import { ScreenHeader } from '../../components/ScreenHeader';
import { Button } from '../../components/Button';
import { Card } from '../../components/Card';
import { useTheme } from '../../theme/ThemeProvider';
import { type as textType } from '../../theme/typography';
import { useSettingsStore } from '../../store/settingsStore';

const TIMES = ['8:00 PM', '9:00 PM', '10:00 PM', '11:00 PM', '6:00 AM', '7:00 AM', '8:00 AM', '9:00 AM'];

export function QuietHoursPickerScreen() {
  const { colors, spacing, radius } = useTheme();
  const navigation = useNavigation();
  const { t } = useTranslation();
  const quietHoursStart = useSettingsStore((s) => s.quietHoursStart);
  const quietHoursEnd = useSettingsStore((s) => s.quietHoursEnd);
  const setQuietHours = useSettingsStore((s) => s.setQuietHours);

  const [start, setStart] = useState(quietHoursStart);
  const [end, setEnd] = useState(quietHoursEnd);
  const [editing, setEditing] = useState<'start' | 'end'>('start');

  return (
    <Screen>
      <ScreenHeader title={t('quietHoursPicker.title')} />
      <Text style={[textType.body, { color: colors.textTertiary }]}>{t('quietHoursPicker.subtitle')}</Text>

      <View style={styles.row}>
        <Pressable onPress={() => setEditing('start')} style={{ flex: 1 }}>
          <Card style={[styles.timeBox, editing === 'start' && { borderColor: colors.accentPrimary }]}>
            <Text style={[textType.caption, { color: colors.textTertiary }]}>{t('quietHoursPicker.from')}</Text>
            <Text style={[textType.heading, { color: colors.textPrimary, marginTop: 4 }]}>{start}</Text>
          </Card>
        </Pressable>
        <Pressable onPress={() => setEditing('end')} style={{ flex: 1 }}>
          <Card style={[styles.timeBox, editing === 'end' && { borderColor: colors.accentPrimary }]}>
            <Text style={[textType.caption, { color: colors.textTertiary }]}>{t('quietHoursPicker.to')}</Text>
            <Text style={[textType.heading, { color: colors.textPrimary, marginTop: 4 }]}>{end}</Text>
          </Card>
        </Pressable>
      </View>

      <Text style={[textType.label, { color: colors.textTertiary }]}>{t('quietHoursPicker.selectTime')}</Text>
      <View style={styles.grid}>
        {TIMES.map((t) => (
          <Pressable
            key={t}
            onPress={() => (editing === 'start' ? setStart(t) : setEnd(t))}
            style={[
              styles.timeChip,
              { borderColor: colors.borderDefault, borderRadius: radius.md },
              (editing === 'start' ? start : end) === t && { backgroundColor: colors.accentSubtleBg, borderColor: colors.accentPrimary },
            ]}
          >
            <Text style={[textType.bodySmall, { color: colors.textPrimary }]}>{t}</Text>
          </Pressable>
        ))}
      </View>

      <Button label={t('common.save')} onPress={() => { setQuietHours(start, end); navigation.goBack(); }} />
    </Screen>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', gap: 12 },
  timeBox: { padding: 16, borderWidth: 1 },
  grid: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  timeChip: { paddingHorizontal: 14, paddingVertical: 10, borderWidth: 1 },
});
