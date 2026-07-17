import React, { useMemo, useState } from 'react';
import { View, Text, TextInput, Pressable, StyleSheet } from 'react-native';
import { Search as SearchIcon } from 'lucide-react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useTranslation } from 'react-i18next';
import { Screen } from '../../components/Screen';
import { ScreenHeader } from '../../components/ScreenHeader';
import { SubscriptionListItem } from '../../components/SubscriptionListItem';
import { useTheme } from '../../theme/ThemeProvider';
import { type as textType } from '../../theme/typography';
import { useSubscriptionsStore, SubStatus } from '../../store/subscriptionsStore';
import { useSettingsStore } from '../../store/settingsStore';
import { categoryName } from '../../utils/categoryLabel';
import { RootStackParamList } from '../../navigation/types';

export function SearchFiltersScreen() {
  const { colors, radius } = useTheme();
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const { t } = useTranslation();
  const FILTERS: { label: string; value: SubStatus | 'all' }[] = [
    { label: t('searchFilters.filterAll'), value: 'all' },
    { label: t('searchFilters.filterActive'), value: 'active' },
    { label: t('searchFilters.filterTrial'), value: 'trial' },
    { label: t('searchFilters.filterPaused'), value: 'paused' },
    { label: t('searchFilters.filterCancelled'), value: 'cancelled' },
  ];
  const subscriptions = useSubscriptionsStore((s) => s.subscriptions);
  const categories = useSettingsStore((s) => s.categories);
  const [query, setQuery] = useState('');
  const [filter, setFilter] = useState<SubStatus | 'all'>('all');

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    return subscriptions
      .filter((s) => filter === 'all' || s.status === filter)
      .filter((s) => {
        if (!q) return true;
        const cat = categories.find((c) => c.id === s.categoryId);
        return (
          s.name.toLowerCase().includes(q) ||
          (s.notes || '').toLowerCase().includes(q) ||
          categoryName(cat, t).toLowerCase().includes(q)
        );
      })
      .sort((a, b) => new Date(a.nextBillingDate).getTime() - new Date(b.nextBillingDate).getTime());
  }, [subscriptions, query, filter, categories, t]);

  return (
    <Screen>
      <ScreenHeader title={t('searchFilters.title')} />
      <View style={[styles.searchBar, { backgroundColor: colors.bgSurfaceSecondary, borderRadius: radius.full }]}>
        <SearchIcon size={18} color={colors.textTertiary} />
        <TextInput
          value={query}
          onChangeText={setQuery}
          placeholder={t('searchFilters.searchPlaceholder')}
          placeholderTextColor={colors.textTertiary}
          style={[textType.body, { color: colors.textPrimary, flex: 1, marginLeft: 8 }]}
        />
      </View>

      <View style={styles.chipRow}>
        {FILTERS.map((f) => (
          <Pressable
            key={f.value}
            onPress={() => setFilter(f.value)}
            style={[
              styles.chip,
              { borderColor: colors.borderDefault, borderRadius: radius.full },
              filter === f.value && { backgroundColor: colors.accentPrimary, borderColor: colors.accentPrimary },
            ]}
          >
            <Text style={[textType.bodySmall, { color: filter === f.value ? colors.textOnAccent : colors.textPrimary }]}>{f.label}</Text>
          </Pressable>
        ))}
      </View>

      <Text style={[textType.bodySmall, { color: colors.textTertiary }]}>{t('searchFilters.resultsCount', { count: results.length })}</Text>

      {results.length === 0 ? (
        <View style={styles.emptyWrap}>
          <View style={[styles.emptyIcon, { backgroundColor: colors.accentSubtleBg, borderRadius: radius.full }]}>
            <SearchIcon size={28} color={colors.accentPrimary} />
          </View>
          <Text style={[textType.subheading, { color: colors.textPrimary, marginTop: 16 }]}>{t('searchFilters.noMatches')}</Text>
          <Text style={[textType.body, { color: colors.textTertiary, marginTop: 4, textAlign: 'center' }]}>{t('searchFilters.noMatchesBody')}</Text>
        </View>
      ) : (
        <View style={{ gap: 12 }}>
          {results.map((sub) => (
            <SubscriptionListItem key={sub.id} sub={sub} onPress={() => navigation.navigate('SubscriptionDetails', { id: sub.id })} />
          ))}
        </View>
      )}
    </Screen>
  );
}

const styles = StyleSheet.create({
  searchBar: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16, height: 48 },
  chipRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  chip: { paddingHorizontal: 14, paddingVertical: 8, borderWidth: 1 },
  emptyWrap: { alignItems: 'center', paddingTop: 40 },
  emptyIcon: { width: 64, height: 64, alignItems: 'center', justifyContent: 'center' },
});
