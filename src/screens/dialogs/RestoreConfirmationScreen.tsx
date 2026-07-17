import React from 'react';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useTranslation } from 'react-i18next';
import { ConfirmDialog } from '../../components/ConfirmDialog';
import { useSubscriptionsStore } from '../../store/subscriptionsStore';
import { RootStackParamList } from '../../navigation/types';

export function RestoreConfirmationScreen() {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const route = useRoute<RouteProp<RootStackParamList, 'RestoreConfirmation'>>();
  const { t } = useTranslation();
  const sub = useSubscriptionsStore((s) => s.subscriptions.find((x) => x.id === route.params.id));
  const restoreSubscription = useSubscriptionsStore((s) => s.restoreSubscription);

  if (!sub) return null;

  return (
    <ConfirmDialog
      headline={t('restoreConfirmation.headline', { name: sub.name })}
      message={t('restoreConfirmation.message')}
      confirmLabel={t('common.restore')}
      onConfirm={() => {
        restoreSubscription(sub.id);
        navigation.goBack();
      }}
    />
  );
}
