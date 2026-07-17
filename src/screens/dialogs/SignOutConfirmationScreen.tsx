import React from 'react';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useTranslation } from 'react-i18next';
import { ConfirmDialog } from '../../components/ConfirmDialog';
import { useSettingsStore } from '../../store/settingsStore';
import { supabase } from '../../utils/supabase';
import { RootStackParamList } from '../../navigation/types';

export function SignOutConfirmationScreen() {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const { t } = useTranslation();
  const signOut = useSettingsStore((s) => s.signOut);

  return (
    <ConfirmDialog
      headline={t('signOutConfirmation.headline')}
      message={t('signOutConfirmation.message')}
      confirmLabel={t('signOutConfirmation.confirmLabel')}
      confirmDestructive
      onConfirm={async () => {
        signOut();
        await supabase.auth.signOut().catch(() => {});
        navigation.reset({ index: 0, routes: [{ name: 'Auth' }] });
      }}
    />
  );
}
