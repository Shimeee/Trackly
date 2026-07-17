import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { CalendarClock, BellRing, BarChart3 } from 'lucide-react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useTranslation } from 'react-i18next';
import { Screen } from '../../components/Screen';
import { Button } from '../../components/Button';
import { useTheme } from '../../theme/ThemeProvider';
import { type as textType } from '../../theme/typography';
import { RootStackParamList } from '../../navigation/types';

export function OnboardingBenefitsScreen() {
  const { colors, radius } = useTheme();
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const { t } = useTranslation();

  const BENEFITS = [
    { key: 'track', icon: CalendarClock, title: t('onboardingBenefits.trackTitle'), body: t('onboardingBenefits.trackBody') },
    { key: 'reminders', icon: BellRing, title: t('onboardingBenefits.remindersTitle'), body: t('onboardingBenefits.remindersBody') },
    { key: 'spending', icon: BarChart3, title: t('onboardingBenefits.spendingTitle'), body: t('onboardingBenefits.spendingBody') },
  ];

  return (
    <Screen scroll={false}>
      <View style={{ flex: 1 }}>
        <Text style={[textType.title, { color: colors.textPrimary }]}>{t('onboardingBenefits.heading')}</Text>
        <View style={{ marginTop: 32, gap: 24 }}>
          {BENEFITS.map((b) => (
            <View key={b.key} style={styles.row}>
              <View style={[styles.iconWrap, { backgroundColor: colors.accentSubtleBg, borderRadius: radius.md }]}>
                <b.icon size={22} color={colors.accentPrimary} />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={[textType.bodyMedium, { color: colors.textPrimary }]}>{b.title}</Text>
                <Text style={[textType.bodySmall, { color: colors.textTertiary, marginTop: 2 }]}>{b.body}</Text>
              </View>
            </View>
          ))}
        </View>
      </View>
      <View style={styles.dots}>
        <View style={[styles.dot, styles.dotActive, { backgroundColor: colors.accentPrimary }]} />
        <View style={[styles.dot, { backgroundColor: colors.borderDefault }]} />
        <View style={[styles.dot, { backgroundColor: colors.borderDefault }]} />
      </View>
      <Button label={t('common.continue')} onPress={() => navigation.navigate('OnboardingPreferences')} />
    </Screen>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', gap: 14, alignItems: 'flex-start' },
  iconWrap: { width: 44, height: 44, alignItems: 'center', justifyContent: 'center' },
  dots: { flexDirection: 'row', gap: 6, justifyContent: 'center', marginBottom: 8 },
  dot: { width: 6, height: 6, borderRadius: 3 },
  dotActive: { width: 20 },
});
