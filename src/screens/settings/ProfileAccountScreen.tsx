import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useTranslation } from 'react-i18next';
import { Screen } from '../../components/Screen';
import { ScreenHeader } from '../../components/ScreenHeader';
import { Card } from '../../components/Card';
import { Divider } from '../../components/Row';
import { Button } from '../../components/Button';
import { useTheme } from '../../theme/ThemeProvider';
import { type as textType } from '../../theme/typography';
import { useSettingsStore } from '../../store/settingsStore';
import { RootStackParamList } from '../../navigation/types';

export function ProfileAccountScreen() {
  const { colors, spacing, radius } = useTheme();
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const { t } = useTranslation();
  const userName = useSettingsStore((s) => s.userName);
  const userEmail = useSettingsStore((s) => s.userEmail);
  const firstName = useSettingsStore((s) => s.firstName);
  const lastName = useSettingsStore((s) => s.lastName);
  const setName = useSettingsStore((s) => s.setName);
  const saveEmail = useSettingsStore((s) => s.setEmail);
  const memberSince = useSettingsStore((s) => s.memberSince);
  const [first, setFirst] = useState(firstName);
  const [last, setLast] = useState(lastName);
  const [email, setEmail] = useState(userEmail);
  const initials = `${first[0] || ''}${last[0] || ''}`.toUpperCase();

  return (
    <Screen>
      <ScreenHeader title={t('profileAccount.title')} />

      <View style={styles.center}>
        <View style={[styles.avatar, { backgroundColor: colors.accentPrimary, borderRadius: radius.full }]}>
          <Text style={[textType.heading, { color: '#FFFFFF' }]}>{initials}</Text>
        </View>
        <Text style={[textType.heading, { color: colors.textPrimary, marginTop: 12 }]}>{userName}</Text>
        {memberSince ? (
          <Text style={[textType.bodySmall, { color: colors.textTertiary, marginTop: 2 }]}>
            {t('profileAccount.memberSince', { year: new Date(memberSince).getFullYear() })}
          </Text>
        ) : null}
      </View>

      <Text style={[textType.label, { color: colors.textTertiary }]}>{t('profileAccount.personalInfo')}</Text>
      <Card style={{ padding: spacing.lg, gap: 12 }}>
        <View>
          <Text style={[textType.caption, { color: colors.textTertiary }]}>{t('profileAccount.firstName')}</Text>
          <TextInput value={first} onChangeText={setFirst} style={[textType.body, { color: colors.textPrimary, paddingVertical: 4 }]} />
        </View>
        <Divider />
        <View>
          <Text style={[textType.caption, { color: colors.textTertiary }]}>{t('profileAccount.lastName')}</Text>
          <TextInput value={last} onChangeText={setLast} style={[textType.body, { color: colors.textPrimary, paddingVertical: 4 }]} />
        </View>
        <Divider />
        <View>
          <Text style={[textType.caption, { color: colors.textTertiary }]}>{t('profileAccount.email')}</Text>
          <TextInput value={email} onChangeText={setEmail} autoCapitalize="none" style={[textType.body, { color: colors.textPrimary, paddingVertical: 4 }]} />
        </View>
      </Card>

      <Button label={t('common.saveChanges')} onPress={() => { setName(first.trim(), last.trim()); saveEmail(email.trim()); navigation.goBack(); }} />

      <Text
        onPress={() => navigation.navigate('SignOutConfirmation')}
        style={[textType.bodyMedium, { color: colors.statusError, textAlign: 'center', marginTop: 8 }]}
      >
        {t('signOutConfirmation.confirmLabel')}
      </Text>
    </Screen>
  );
}

const styles = StyleSheet.create({
  center: { alignItems: 'center' },
  avatar: { width: 72, height: 72, alignItems: 'center', justifyContent: 'center' },
});
