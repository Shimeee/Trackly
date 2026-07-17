import React, { useState } from 'react';
import { View, Text, TextInput, Pressable, StyleSheet } from 'react-native';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useTranslation } from 'react-i18next';
import { Screen } from '../../components/Screen';
import { ScreenHeader } from '../../components/ScreenHeader';
import { Button } from '../../components/Button';
import { Toggle } from '../../components/Toggle';
import { useTheme } from '../../theme/ThemeProvider';
import { type as textType } from '../../theme/typography';
import { useSettingsStore } from '../../store/settingsStore';
import { RootStackParamList } from '../../navigation/types';
import { formatMoney, formatLongDate } from '../../utils/format';
import { categoryName } from '../../utils/categoryLabel';

function addDays(days: number) {
  const d = new Date();
  d.setDate(d.getDate() + days);
  return d.toISOString();
}

export function DetailsFormScreen() {
  const { colors, spacing, radius } = useTheme();
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const route = useRoute<RouteProp<RootStackParamList, 'AddDetailsForm'>>();
  const { t } = useTranslation();
  const categories = useSettingsStore((s) => s.categories);
  const currency = useSettingsStore((s) => s.currency);
  const CYCLE_LABELS: Record<'Monthly' | 'Yearly' | 'Weekly', string> = {
    Monthly: t('detailsForm.cycleMonthly'),
    Yearly: t('detailsForm.cycleYearly'),
    Weekly: t('detailsForm.cycleWeekly'),
  };

  const [name, setName] = useState(route.params?.serviceName || '');
  const [categoryId, setCategoryId] = useState(route.params?.categoryId || categories[0].id);
  const [cost, setCost] = useState('');
  const [billingCycle, setBillingCycle] = useState<'Monthly' | 'Yearly' | 'Weekly'>('Monthly');
  const [nextBillingDate, setNextBillingDate] = useState(addDays(30));
  const [paymentMethod, setPaymentMethod] = useState('');
  const [isFreeTrial, setIsFreeTrial] = useState(false);
  const [autoRenew, setAutoRenew] = useState(true);
  const [error, setError] = useState('');

  const costNum = parseFloat(cost) || 0;
  const color = route.params?.serviceColor || '#4338CA';

  const onContinue = () => {
    if (!name.trim()) { setError(t('detailsForm.nameRequiredError')); return; }
    if (costNum <= 0) { setError(t('detailsForm.costInvalidError')); return; }
    navigation.navigate('AddReminderConfig', {
      serviceName: name.trim(),
      serviceColor: color,
      categoryId,
      cost,
      billingCycle,
      nextBillingDate,
      paymentMethod,
      isFreeTrial,
      autoRenew,
    });
  };

  return (
    <Screen>
      <ScreenHeader title={t('detailsForm.title')} />

      <View style={{ gap: 8 }}>
        <Text style={[textType.caption, { color: colors.textSecondary }]}>{t('detailsForm.serviceName')}</Text>
        <TextInput
          value={name}
          onChangeText={(v) => { setName(v); setError(''); }}
          placeholder={t('detailsForm.serviceNamePlaceholder')}
          placeholderTextColor={colors.textTertiary}
          style={[styles.input, textType.body, { color: colors.textPrimary, borderColor: error ? colors.statusError : colors.borderDefault, borderRadius: radius.lg }]}
        />
        {error ? <Text style={[textType.bodySmall, { color: colors.statusError }]}>{error}</Text> : null}
      </View>

      <View style={{ gap: 8 }}>
        <Text style={[textType.caption, { color: colors.textSecondary }]}>{t('detailsForm.category')}</Text>
        <View style={styles.chipRow}>
          {categories.map((c) => (
            <Pressable
              key={c.id}
              onPress={() => setCategoryId(c.id)}
              style={[
                styles.chip,
                { borderRadius: radius.full, borderColor: colors.borderDefault },
                categoryId === c.id && { backgroundColor: colors.accentPrimary, borderColor: colors.accentPrimary },
              ]}
            >
              <Text style={[textType.bodySmall, { color: categoryId === c.id ? colors.textOnAccent : colors.textPrimary }]}>{categoryName(c, t)}</Text>
            </Pressable>
          ))}
        </View>
      </View>

      <View style={{ gap: 8 }}>
        <Text style={[textType.caption, { color: colors.textSecondary }]}>{t('detailsForm.cost')}</Text>
        <TextInput
          value={cost}
          onChangeText={setCost}
          placeholder={`${currency} 0`}
          keyboardType="decimal-pad"
          placeholderTextColor={colors.textTertiary}
          style={[styles.input, textType.body, { color: colors.textPrimary, borderColor: colors.borderDefault, borderRadius: radius.lg }]}
        />
      </View>

      <View style={{ gap: 8 }}>
        <Text style={[textType.caption, { color: colors.textSecondary }]}>{t('detailsForm.billingCycle')}</Text>
        <View style={{ flexDirection: 'row', gap: 8 }}>
          {(['Monthly', 'Yearly', 'Weekly'] as const).map((c) => (
            <Pressable
              key={c}
              onPress={() => setBillingCycle(c)}
              style={[
                styles.cycleChip,
                { borderColor: colors.borderDefault, borderRadius: radius.md },
                billingCycle === c && { backgroundColor: colors.accentSubtleBg, borderColor: colors.accentPrimary },
              ]}
            >
              <Text numberOfLines={1} style={[textType.bodySmall, { color: billingCycle === c ? colors.accentPrimary : colors.textSecondary }]}>{CYCLE_LABELS[c]}</Text>
            </Pressable>
          ))}
        </View>
      </View>

      <View style={{ gap: 8 }}>
        <Text style={[textType.caption, { color: colors.textSecondary }]}>{t('detailsForm.nextBillingDate')}</Text>
        <View style={{ flexDirection: 'row', gap: 8 }}>
          {[7, 30, 365].map((d) => (
            <Pressable
              key={d}
              onPress={() => setNextBillingDate(addDays(d))}
              style={[styles.dateChip, { borderColor: colors.borderDefault, borderRadius: radius.md }]}
            >
              <Text style={[textType.caption, { color: colors.textPrimary }]}>+{d}d</Text>
            </Pressable>
          ))}
        </View>
        <Text style={[textType.body, { color: colors.textPrimary }]}>{formatLongDate(nextBillingDate)}</Text>
      </View>

      <View style={{ gap: 8 }}>
        <Text style={[textType.caption, { color: colors.textSecondary }]}>{t('detailsForm.paymentMethod')}</Text>
        <TextInput
          value={paymentMethod}
          onChangeText={setPaymentMethod}
          placeholder={t('detailsForm.paymentMethodPlaceholder')}
          placeholderTextColor={colors.textTertiary}
          style={[styles.input, textType.body, { color: colors.textPrimary, borderColor: colors.borderDefault, borderRadius: radius.lg }]}
        />
      </View>

      <View style={styles.toggleRow}>
        <Text style={[textType.body, { color: colors.textPrimary }]}>{t('detailsForm.freeTrial')}</Text>
        <Toggle value={isFreeTrial} onChange={setIsFreeTrial} />
      </View>
      <View style={styles.toggleRow}>
        <Text style={[textType.body, { color: colors.textPrimary }]}>{t('detailsForm.autoRenew')}</Text>
        <Toggle value={autoRenew} onChange={setAutoRenew} />
      </View>

      {name && costNum > 0 ? (
        <View style={[styles.summary, { backgroundColor: colors.accentSubtleBg, borderRadius: radius.lg }]}>
          <Text style={[textType.bodySmall, { color: colors.accentPrimary }]}>
            {t('detailsForm.summary', { name, date: formatLongDate(nextBillingDate), amount: formatMoney(costNum, currency), cycle: CYCLE_LABELS[billingCycle].toLowerCase() })}
          </Text>
        </View>
      ) : null}

      <Button label={t('common.continue')} onPress={onContinue} />
    </Screen>
  );
}

const styles = StyleSheet.create({
  input: { height: 48, borderWidth: 1, paddingHorizontal: 16 },
  chipRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  chip: { paddingHorizontal: 14, paddingVertical: 8, borderWidth: 1 },
  cycleChip: { flex: 1, height: 48, alignItems: 'center', justifyContent: 'center', borderWidth: 1, paddingHorizontal: 4 },
  dateChip: { paddingHorizontal: 12, paddingVertical: 6, borderWidth: 1 },
  toggleRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  summary: { padding: 16 },
});
