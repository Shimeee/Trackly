import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet } from 'react-native';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useTranslation } from 'react-i18next';
import { Screen } from '../../components/Screen';
import { ScreenHeader } from '../../components/ScreenHeader';
import { Button } from '../../components/Button';
import { Toggle } from '../../components/Toggle';
import { useTheme } from '../../theme/ThemeProvider';
import { type as textType } from '../../theme/typography';
import { useSubscriptionsStore } from '../../store/subscriptionsStore';
import { RootStackParamList } from '../../navigation/types';

export function EditSubscriptionScreen() {
  const { colors, radius } = useTheme();
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const { t } = useTranslation();
  const route = useRoute<RouteProp<RootStackParamList, 'EditSubscription'>>();
  const sub = useSubscriptionsStore((s) => s.subscriptions.find((x) => x.id === route.params.id));
  const updateSubscription = useSubscriptionsStore((s) => s.updateSubscription);

  const [name, setName] = useState(sub?.name || '');
  const [cost, setCost] = useState(String(sub?.cost || ''));
  const [paymentMethod, setPaymentMethod] = useState(sub?.paymentMethod || '');
  const [autoRenew, setAutoRenew] = useState(sub?.autoRenew ?? true);
  const [notes, setNotes] = useState(sub?.notes || '');

  if (!sub) return null;

  const onSave = () => {
    updateSubscription(sub.id, {
      name: name.trim() || sub.name,
      cost: parseFloat(cost) || sub.cost,
      paymentMethod: paymentMethod || undefined,
      autoRenew,
      notes: notes || undefined,
    });
    navigation.goBack();
  };

  return (
    <Screen>
      <ScreenHeader title={t('editSubscription.title')} />

      <View style={{ gap: 8 }}>
        <Text style={[textType.caption, { color: colors.textSecondary }]}>{t('editSubscription.serviceName')}</Text>
        <TextInput value={name} onChangeText={setName} style={[styles.input, textType.body, { color: colors.textPrimary, borderColor: colors.borderDefault, borderRadius: radius.lg }]} />
      </View>

      <View style={{ gap: 8 }}>
        <Text style={[textType.caption, { color: colors.textSecondary }]}>{t('editSubscription.cost')}</Text>
        <TextInput value={cost} onChangeText={setCost} keyboardType="decimal-pad" style={[styles.input, textType.body, { color: colors.textPrimary, borderColor: colors.borderDefault, borderRadius: radius.lg }]} />
      </View>

      <View style={{ gap: 8 }}>
        <Text style={[textType.caption, { color: colors.textSecondary }]}>{t('editSubscription.paymentMethod')}</Text>
        <TextInput value={paymentMethod} onChangeText={setPaymentMethod} style={[styles.input, textType.body, { color: colors.textPrimary, borderColor: colors.borderDefault, borderRadius: radius.lg }]} />
      </View>

      <View style={{ gap: 8 }}>
        <Text style={[textType.caption, { color: colors.textSecondary }]}>{t('editSubscription.notes')}</Text>
        <TextInput
          value={notes}
          onChangeText={setNotes}
          multiline
          style={[styles.input, styles.multiline, textType.body, { color: colors.textPrimary, borderColor: colors.borderDefault, borderRadius: radius.lg }]}
        />
      </View>

      <View style={styles.toggleRow}>
        <Text style={[textType.body, { color: colors.textPrimary }]}>{t('editSubscription.autoRenew')}</Text>
        <Toggle value={autoRenew} onChange={setAutoRenew} />
      </View>

      <Button label={t('common.saveChanges')} onPress={onSave} />
    </Screen>
  );
}

const styles = StyleSheet.create({
  input: { height: 48, borderWidth: 1, paddingHorizontal: 16 },
  multiline: { height: 88, paddingTop: 12, textAlignVertical: 'top' },
  toggleRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
});
