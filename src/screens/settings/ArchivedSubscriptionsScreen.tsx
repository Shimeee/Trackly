import React, { useMemo } from 'react';
import { Text } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useTranslation } from 'react-i18next';
import { Screen } from '../../components/Screen';
import { ScreenHeader } from '../../components/ScreenHeader';
import { SubscriptionListItem } from '../../components/SubscriptionListItem';
import { useTheme } from '../../theme/ThemeProvider';
import { type as textType } from '../../theme/typography';
import { useSubscriptionsStore, selectArchived } from '../../store/subscriptionsStore';
import { RootStackParamList } from '../../navigation/types';

export function ArchivedSubscriptionsScreen() {
  const { colors } = useTheme();
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const { t } = useTranslation();
  const subscriptions = useSubscriptionsStore((s) => s.subscriptions);
  const archived = useMemo(() => selectArchived(subscriptions), [subscriptions]);

  return (
    <Screen>
      <ScreenHeader title={t('archivedSubscriptions.title')} />
      <Text style={[textType.body, { color: colors.textTertiary }]}>{t('archivedSubscriptions.subtitle')}</Text>

      {archived.length === 0 ? (
        <Text style={[textType.body, { color: colors.textTertiary, textAlign: 'center', marginTop: 40 }]}>{t('archivedSubscriptions.empty')}</Text>
      ) : (
        archived.map((sub) => (
          <SubscriptionListItem key={sub.id} sub={sub} onPress={() => navigation.navigate('SubscriptionDetails', { id: sub.id })} />
        ))
      )}
    </Screen>
  );
}
