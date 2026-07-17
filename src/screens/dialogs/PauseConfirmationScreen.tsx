import React from 'react';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useTranslation } from 'react-i18next';
import { ConfirmDialog } from '../../components/ConfirmDialog';
import { useSubscriptionsStore } from '../../store/subscriptionsStore';
import { RootStackParamList } from '../../navigation/types';

export function PauseConfirmationScreen() {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const route = useRoute<RouteProp<RootStackParamList, 'PauseConfirmation'>>();
  const { t } = useTranslation();
  const sub = useSubscriptionsStore((s) => s.subscriptions.find((x) => x.id === route.params.id));
  const pauseSubscription = useSubscriptionsStore((s) => s.pauseSubscription);

  if (!sub) return null;

  return (
    <ConfirmDialog
      headline={t('pauseConfirmation.headline', { name: sub.name })}
      message={t('pauseConfirmation.message')}
      confirmLabel={t('pauseConfirmation.confirmLabel')}
      onConfirm={() => {
        pauseSubscription(sub.id);
        navigation.goBack();
      }}
    />
  );
}
