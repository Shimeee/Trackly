import { useEffect } from 'react';
import * as Updates from 'expo-updates';
import { useSettingsStore } from '../store/settingsStore';
import i18n, { applyRTL, resolveLanguage } from './index';

export function useLanguageSync() {
  const language = useSettingsStore((s) => s.language);

  useEffect(() => {
    const resolved = resolveLanguage(language);
    i18n.changeLanguage(resolved);
    const needsReload = applyRTL(resolved);
    if (needsReload) {
      Updates.reloadAsync().catch(() => {});
    }
  }, [language]);
}
