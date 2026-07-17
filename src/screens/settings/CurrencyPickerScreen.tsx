import React from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
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

const CURRENCY_CODES = ['EGP', 'USD', 'EUR', 'GBP', 'SAR', 'AED'];

export function CurrencyPickerScreen() {
  const { colors } = useTheme();
  const navigation = useNavigation();
  const { t } = useTranslation();
  const currency = useSettingsStore((s) => s.currency);
  const setCurrency = useSettingsStore((s) => s.setCurrency);

  return (
    <Screen>
      <ScreenHeader title={t('currencyPicker.title')} />
      <Card>
        {CURRENCY_CODES.map((code, i) => (
          <React.Fragment key={code}>
            <Pressable
              onPress={() => { setCurrency(code); navigation.goBack(); }}
              style={styles.row}
            >
              <Text style={[textType.bodyMedium, { color: currency === code ? colors.accentPrimary : colors.textPrimary, width: 56 }]}>{code}</Text>
              <Text style={[textType.body, { color: colors.textTertiary, flex: 1 }]}>{t(`currencyPicker.names.${code}`)}</Text>
              {currency === code && <Check size={20} color={colors.accentPrimary} />}
            </Pressable>
            {i < CURRENCY_CODES.length - 1 && <Divider />}
          </React.Fragment>
        ))}
      </Card>
    </Screen>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'center', paddingVertical: 14, paddingHorizontal: 16 },
});
