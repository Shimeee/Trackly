import React, { useEffect, useRef } from 'react';
import { View, Text, Pressable, Animated, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { createBottomTabNavigator, BottomTabBarProps } from '@react-navigation/bottom-tabs';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Home, Calendar, Plus, BarChart3, Settings as SettingsIcon } from 'lucide-react-native';
import { useTranslation } from 'react-i18next';
import { DashboardScreen } from '../screens/core/DashboardScreen';
import { CalendarScreen } from '../screens/core/CalendarScreen';
import { InsightsScreen } from '../screens/core/InsightsScreen';
import { SettingsScreen } from '../screens/settings/SettingsScreen';
import { useTheme } from '../theme/ThemeProvider';
import { type as textType } from '../theme/typography';
import { TabParamList } from './types';

const Tab = createBottomTabNavigator<TabParamList>();

const ICONS: Record<string, any> = { Home, Calendar, Insights: BarChart3, Settings: SettingsIcon };

function TabItem({ focused, Icon, label, onPress }: { focused: boolean; Icon: any; label: string; onPress: () => void }) {
  const { colors, radius } = useTheme();
  const scale = useRef(new Animated.Value(focused ? 1 : 0)).current;

  useEffect(() => {
    Animated.spring(scale, { toValue: focused ? 1 : 0, useNativeDriver: false, friction: 7, tension: 90 }).start();
  }, [focused]);

  const pillOpacity = scale;
  const pillScale = scale.interpolate({ inputRange: [0, 1], outputRange: [0.7, 1] });

  return (
    <Pressable onPress={onPress} style={styles.tabItem}>
      <Animated.View
        style={[
          styles.iconPill,
          { borderRadius: radius.full, backgroundColor: colors.accentSubtleBg, opacity: pillOpacity, transform: [{ scale: pillScale }] },
        ]}
      />
      <View style={styles.iconPillOverlay}>
        <Icon size={22} color={focused ? colors.accentPrimary : colors.textTertiary} />
      </View>
      <Text style={[textType.caption, { color: focused ? colors.accentPrimary : colors.textTertiary, marginTop: 2 }]}>{label}</Text>
    </Pressable>
  );
}

function FabButton({ onPress }: { onPress: () => void }) {
  const { colors, radius } = useTheme();
  const scale = useRef(new Animated.Value(1)).current;

  const pressIn = () => Animated.spring(scale, { toValue: 0.88, useNativeDriver: true, friction: 6 }).start();
  const pressOut = () => Animated.spring(scale, { toValue: 1, useNativeDriver: true, friction: 5 }).start();

  return (
    <Pressable onPress={onPress} onPressIn={pressIn} onPressOut={pressOut}>
      <Animated.View style={[styles.fab, { borderRadius: radius.full, transform: [{ scale }] }]}>
        <LinearGradient
          colors={[colors.accentPrimary, '#6D28D9']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={[styles.fabGradient, { borderRadius: radius.full }]}
        >
          <Plus size={26} color="#FFFFFF" />
        </LinearGradient>
      </Animated.View>
    </Pressable>
  );
}

function CustomTabBar({ state, navigation }: BottomTabBarProps) {
  const { colors, radius } = useTheme();
  const { t } = useTranslation();

  return (
    <View style={[styles.shadowWrap, { shadowColor: colors.textPrimary }]}>
      <SafeAreaView
        edges={['bottom']}
        style={[
          styles.wrap,
          { backgroundColor: colors.bgSurface, borderColor: colors.borderDefault, borderTopLeftRadius: radius.xl, borderTopRightRadius: radius.xl },
        ]}
      >
        {state.routes.map((route, index) => {
          if (route.name === 'AddTab') {
            return <FabButton key={route.key} onPress={() => navigation.navigate('AddServiceSelection' as never)} />;
          }
          const focused = state.index === index;
          const Icon = ICONS[route.name];
          return (
            <TabItem
              key={route.key}
              focused={focused}
              Icon={Icon}
              label={t(`tabs.${route.name}`)}
              onPress={() => navigation.navigate(route.name as never)}
            />
          );
        })}
      </SafeAreaView>
    </View>
  );
}

export function TabNavigator() {
  return (
    <Tab.Navigator screenOptions={{ headerShown: false }} tabBar={(props) => <CustomTabBar {...props} />}>
      <Tab.Screen name="Home" component={DashboardScreen} />
      <Tab.Screen name="Calendar" component={CalendarScreen} />
      <Tab.Screen name="AddTab" component={DashboardScreen} />
      <Tab.Screen name="Insights" component={InsightsScreen} />
      <Tab.Screen name="Settings" component={SettingsScreen} />
    </Tab.Navigator>
  );
}

const styles = StyleSheet.create({
  shadowWrap: {
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.08,
    shadowRadius: 16,
    elevation: 12,
  },
  wrap: { flexDirection: 'row', borderTopWidth: 1, paddingTop: 10 },
  tabItem: { flex: 1, alignItems: 'center', paddingBottom: 4 },
  iconPill: { position: 'absolute', top: 0, width: 52, height: 30 },
  iconPillOverlay: { width: 52, height: 30, alignItems: 'center', justifyContent: 'center' },
  fab: {
    width: 56,
    height: 56,
    alignSelf: 'center',
    marginTop: -22,
    shadowColor: '#4338CA',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.4,
    shadowRadius: 14,
    elevation: 8,
  },
  fabGradient: { flex: 1, alignItems: 'center', justifyContent: 'center' },
});
