import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Bell } from 'lucide-react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useTranslation } from 'react-i18next';
import { Screen } from '../../components/Screen';
import { Button } from '../../components/Button';
import { useTheme } from '../../theme/ThemeProvider';
import { type as textType } from '../../theme/typography';
import { useSettingsStore } from '../../store/settingsStore';
import { requestNotificationPermission } from '../../utils/notifications';
import { RootStackParamList } from '../../navigation/types';

export function NotificationPrePermissionScreen() {
  const { colors, radius } = useTheme();
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const { t } = useTranslation();
  const setNotificationsEnabled = useSettingsStore((s) => s.setNotificationsEnabled);

  const proceed = async (requestPermission: boolean) => {
    const state = requestPermission ? await requestNotificationPermission() : { granted: false };
    setNotificationsEnabled(state.granted);
    navigation.navigate('Auth');
  };

  return (
    <Screen scroll={false}>
      <View style={styles.center}>
        <View style={[styles.iconWrap, { backgroundColor: colors.accentSubtleBg, borderRadius: radius.full }]}>
          <Bell size={32} color={colors.accentPrimary} />
        </View>
        <Text style={[textType.heading, { color: colors.textPrimary, marginTop: 20, textAlign: 'center' }]}>{t('notificationPrePermission.heading')}</Text>
        <Text style={[textType.body, { color: colors.textTertiary, marginTop: 8, textAlign: 'center' }]}>
          {t('notificationPrePermission.body')}
        </Text>
      </View>
      <Button label={t('notificationPrePermission.enableReminders')} onPress={() => proceed(true)} />
      <View style={{ marginTop: 8, alignItems: 'center' }}>
        <Text onPress={() => proceed(false)} style={[textType.bodyMedium, { color: colors.accentPrimary }]}>{t('common.notNow')}</Text>
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  center: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  iconWrap: { width: 88, height: 88, alignItems: 'center', justifyContent: 'center' },
});
