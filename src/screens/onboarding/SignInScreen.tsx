import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useTranslation } from 'react-i18next';
import { Screen } from '../../components/Screen';
import { ScreenHeader } from '../../components/ScreenHeader';
import { Button } from '../../components/Button';
import { useTheme } from '../../theme/ThemeProvider';
import { type as textType } from '../../theme/typography';
import { useSettingsStore } from '../../store/settingsStore';
import { signInWithPassword } from '../../utils/supabaseAuth';
import { RootStackParamList } from '../../navigation/types';

export function SignInScreen() {
  const { colors, radius } = useTheme();
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const { t } = useTranslation();
  const signIn = useSettingsStore((s) => s.signIn);
  const completeOnboarding = useSettingsStore((s) => s.completeOnboarding);

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const canSubmit = email.includes('@') && password.length >= 6;

  const onSubmit = async () => {
    setError('');
    setLoading(true);
    try {
      const account = await signInWithPassword(email.trim(), password);
      completeOnboarding();
      signIn(account.firstName, account.lastName, account.email, account.createdAt);
      navigation.reset({ index: 0, routes: [{ name: 'Main' }] });
    } catch (e) {
      setError(e instanceof Error ? e.message : t('signIn.genericError'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <Screen>
      <ScreenHeader title={t('signIn.title')} />
      <Text style={[textType.body, { color: colors.textSecondary }]}>{t('signIn.subtitle')}</Text>

      <View style={{ gap: 8 }}>
        <Text style={[textType.caption, { color: colors.textSecondary }]}>{t('signIn.email')}</Text>
        <TextInput
          value={email}
          onChangeText={setEmail}
          placeholder="you@example.com"
          autoCapitalize="none"
          keyboardType="email-address"
          placeholderTextColor={colors.textTertiary}
          style={[styles.input, textType.body, { color: colors.textPrimary, borderColor: colors.borderDefault, borderRadius: radius.lg }]}
        />
      </View>

      <View style={{ gap: 8 }}>
        <Text style={[textType.caption, { color: colors.textSecondary }]}>{t('signIn.password')}</Text>
        <TextInput
          value={password}
          onChangeText={setPassword}
          placeholder={t('signIn.passwordPlaceholder')}
          secureTextEntry
          autoCapitalize="none"
          placeholderTextColor={colors.textTertiary}
          style={[styles.input, textType.body, { color: colors.textPrimary, borderColor: colors.borderDefault, borderRadius: radius.lg }]}
        />
      </View>

      {error ? <Text style={[textType.bodySmall, { color: colors.statusError }]}>{error}</Text> : null}

      <Button label={t('signIn.submit')} disabled={!canSubmit} loading={loading} onPress={onSubmit} />
    </Screen>
  );
}

const styles = StyleSheet.create({
  input: { height: 48, borderWidth: 1, paddingHorizontal: 16 },
});
