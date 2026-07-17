import React from 'react';
import { View, Text, Image } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useTranslation } from 'react-i18next';
import { Screen } from '../../components/Screen';
import { Button } from '../../components/Button';
import { useTheme } from '../../theme/ThemeProvider';
import { type as textType } from '../../theme/typography';
import { RootStackParamList } from '../../navigation/types';

export function AuthScreen() {
  const { colors } = useTheme();
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const { t } = useTranslation();

  return (
    <Screen scroll={false}>
      <View>
        <Text style={[textType.title, { color: colors.textPrimary }]}>{t('auth.welcome')}</Text>
        <Text style={[textType.body, { color: colors.textTertiary, marginTop: 8 }]}>{t('auth.subtitle')}</Text>
      </View>
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
        <Image
          source={require('../../../assets/trackly_mark.png')}
          style={{ width: 140, height: 140 }}
          resizeMode="contain"
        />
      </View>
      <View style={{ gap: 12 }}>
        <Button label={t('auth.signUp')} onPress={() => navigation.navigate('SignUp')} />
        <Button label={t('auth.signIn')} variant="secondary" onPress={() => navigation.navigate('SignIn')} />
      </View>
      <Text style={[textType.caption, { color: colors.textTertiary, textAlign: 'center', marginTop: 12 }]}>
        {t('auth.legal')}
      </Text>
    </Screen>
  );
}
