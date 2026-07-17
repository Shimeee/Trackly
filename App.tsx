import 'react-native-gesture-handler';
import './src/i18n';
import React, { useEffect, useState } from 'react';
import { StatusBar } from 'expo-status-bar';
import { NavigationContainer, DefaultTheme, DarkTheme } from '@react-navigation/native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { useFonts, Outfit_400Regular, Outfit_500Medium, Outfit_600SemiBold, Outfit_700Bold } from '@expo-google-fonts/outfit';
import {
  PublicSans_400Regular,
  PublicSans_500Medium,
  PublicSans_600SemiBold,
  PublicSans_700Bold,
} from '@expo-google-fonts/public-sans';
import { View } from 'react-native';

import { ThemeProvider, useTheme } from './src/theme/ThemeProvider';
import { RootNavigator } from './src/navigation/RootNavigator';
import { useSubscriptionsStore } from './src/store/subscriptionsStore';
import { useSettingsStore } from './src/store/settingsStore';
import { syncReminderNotifications } from './src/utils/notifications';
import { useLanguageSync } from './src/i18n/useLanguageSync';

function AppShell() {
  const { colors, isDark } = useTheme();
  const navTheme = {
    ...(isDark ? DarkTheme : DefaultTheme),
    colors: { ...(isDark ? DarkTheme.colors : DefaultTheme.colors), background: colors.bgCanvas },
  };

  const subscriptions = useSubscriptionsStore((s) => s.subscriptions);
  const notificationsEnabled = useSettingsStore((s) => s.notificationsEnabled);

  useLanguageSync();

  useEffect(() => {
    syncReminderNotifications(subscriptions, notificationsEnabled);
  }, [subscriptions, notificationsEnabled]);

  return (
    <View style={{ flex: 1, backgroundColor: colors.bgCanvas }}>
      <StatusBar style={isDark ? 'light' : 'dark'} />
      <NavigationContainer theme={navTheme}>
        <RootNavigator />
      </NavigationContainer>
    </View>
  );
}

function useStoresHydrated() {
  const [hydrated, setHydrated] = useState(
    () => useSubscriptionsStore.persist.hasHydrated() && useSettingsStore.persist.hasHydrated()
  );

  useEffect(() => {
    if (hydrated) return;
    const checkDone = () => {
      if (useSubscriptionsStore.persist.hasHydrated() && useSettingsStore.persist.hasHydrated()) {
        setHydrated(true);
      }
    };
    const unsub1 = useSubscriptionsStore.persist.onFinishHydration(checkDone);
    const unsub2 = useSettingsStore.persist.onFinishHydration(checkDone);
    checkDone();
    return () => { unsub1(); unsub2(); };
  }, [hydrated]);

  return hydrated;
}

export default function App() {
  const [fontsLoaded] = useFonts({
    Outfit_400Regular, Outfit_500Medium, Outfit_600SemiBold, Outfit_700Bold,
    PublicSans_400Regular, PublicSans_500Medium, PublicSans_600SemiBold, PublicSans_700Bold,
  });
  const storesHydrated = useStoresHydrated();

  if (!fontsLoaded || !storesHydrated) return null;

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <ThemeProvider>
        <AppShell />
      </ThemeProvider>
    </GestureHandlerRootView>
  );
}
