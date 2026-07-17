import i18n from 'i18next';
import { initReactI18next, useTranslation } from 'react-i18next';
import * as Localization from 'expo-localization';
import { I18nManager, Platform } from 'react-native';
import en from './locales/en';
import ar from './locales/ar';

export type LanguagePreference = 'system' | 'en' | 'ar';
export type SupportedLanguage = 'en' | 'ar';

const RTL_LANGUAGES: SupportedLanguage[] = ['ar'];

export function resolveLanguage(preference: LanguagePreference): SupportedLanguage {
  if (preference === 'en' || preference === 'ar') return preference;
  const deviceLang = Localization.getLocales()[0]?.languageCode;
  return deviceLang === 'ar' ? 'ar' : 'en';
}

export function isRTLLanguage(lang: SupportedLanguage): boolean {
  return RTL_LANGUAGES.includes(lang);
}

i18n.use(initReactI18next).init({
  resources: { en: { translation: en }, ar: { translation: ar } },
  lng: resolveLanguage('system'),
  fallbackLng: 'en',
  interpolation: { escapeValue: false },
});

export function applyRTL(lang: SupportedLanguage): boolean {
  const wantsRTL = isRTLLanguage(lang);

  if (Platform.OS === 'web') {
    if (typeof document !== 'undefined') {
      document.documentElement.dir = wantsRTL ? 'rtl' : 'ltr';
      document.documentElement.lang = lang;
    }
    return false;
  }

  if (I18nManager.isRTL !== wantsRTL) {
    I18nManager.allowRTL(true);
    I18nManager.forceRTL(wantsRTL);
    return true;
  }
  return false;
}

export function useIsRTL(): boolean {
  const { i18n: instance } = useTranslation();
  return isRTLLanguage(instance.language as SupportedLanguage);
}

export default i18n;
