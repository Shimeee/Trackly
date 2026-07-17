import React from 'react';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useTranslation } from 'react-i18next';
import { ConfirmDialog } from '../../components/ConfirmDialog';
import { useSettingsStore } from '../../store/settingsStore';
import { useSubscriptionsStore } from '../../store/subscriptionsStore';
import { supabase } from '../../utils/supabase';
import { RootStackParamList } from '../../navigation/types';

export function DeleteAccountConfirmationScreen() {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const { t } = useTranslation();
  const resetAccount = useSettingsStore((s) => s.resetAccount);
  const clearAll = useSubscriptionsStore((s) => s.clearAll);

  return (
    <ConfirmDialog
      headline={t('deleteAccountConfirmation.headline')}
      message={t('deleteAccountConfirmation.message')}
      confirmLabel={t('deleteAccountConfirmation.confirmLabel')}
      confirmDestructive
      onConfirm={async () => {
        clearAll();
        resetAccount();
        await supabase.auth.signOut().catch(() => {});
        navigation.reset({ index: 0, routes: [{ name: 'Auth' }] });
      }}
    />
  );
}
