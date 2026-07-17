import React, { useEffect } from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useTranslation } from 'react-i18next';
import { Screen } from '../../components/Screen';
import { ScreenHeader } from '../../components/ScreenHeader';
import { useTheme } from '../../theme/ThemeProvider';
import { type as textType } from '../../theme/typography';
import { useSubscriptionsStore } from '../../store/subscriptionsStore';
import { RootStackParamList } from '../../navigation/types';
import { relativeTime } from '../../utils/format';

export function NotificationCenterScreen() {
  const { colors } = useTheme();
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const { t } = useTranslation();
  const notifications = useSubscriptionsStore((s) => s.notifications);
  const markAllNotificationsRead = useSubscriptionsStore((s) => s.markAllNotificationsRead);

  useEffect(() => {
    markAllNotificationsRead();
  }, []);

  return (
    <Screen>
      <ScreenHeader title={t('notificationCenter.title')} />
      {notifications.length === 0 ? (
        <Text style={[textType.body, { color: colors.textTertiary, textAlign: 'center', marginTop: 60 }]}>{t('notificationCenter.empty')}</Text>
      ) : (
        <View style={{ gap: 4 }}>
          {notifications.map((n) => (
            <Pressable
              key={n.id}
              onPress={() => n.subscriptionId && navigation.navigate('SubscriptionDetails', { id: n.subscriptionId })}
              style={styles.item}
            >
              {!n.read && <View style={[styles.dot, { backgroundColor: colors.accentPrimary }]} />}
              <View style={{ flex: 1, marginLeft: n.read ? 16 : 0 }}>
                <View style={styles.rowBetween}>
                  <Text style={[textType.bodyMedium, { color: colors.textPrimary, flex: 1 }]}>{n.title}</Text>
                  <Text style={[textType.caption, { color: colors.textTertiary }]}>{relativeTime(n.createdAt)}</Text>
                </View>
                <Text style={[textType.bodySmall, { color: colors.textTertiary, marginTop: 2 }]}>{n.body}</Text>
              </View>
            </Pressable>
          ))}
        </View>
      )}
    </Screen>
  );
}

const styles = StyleSheet.create({
  item: { flexDirection: 'row', paddingVertical: 10 },
  dot: { width: 8, height: 8, borderRadius: 4, marginTop: 6, marginRight: 8 },
  rowBetween: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' },
});
