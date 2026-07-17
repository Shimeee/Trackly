import React from 'react';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useTranslation } from 'react-i18next';
import { ConfirmDialog } from '../../components/ConfirmDialog';
import { useSubscriptionsStore } from '../../store/subscriptionsStore';
import { RootStackParamList } from '../../navigation/types';

export function DeleteConfirmationScreen() {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const route = useRoute<RouteProp<RootStackParamList, 'DeleteConfirmation'>>();
  const { t } = useTranslation();
  const sub = useSubscriptionsStore((s) => s.subscriptions.find((x) => x.id === route.params.id));
  const cancelSubscription = useSubscriptionsStore((s) => s.cancelSubscription);

  if (!sub) return null;

  return (
    <ConfirmDialog
      headline={t('deleteConfirmation.headline', { name: sub.name })}
      message={t('deleteConfirmation.message')}
      confirmLabel={t('common.delete')}
      confirmDestructive
      onConfirm={() => {
        cancelSubscription(sub.id);
        navigation.navigate('Main');
      }}
    />
  );
}
