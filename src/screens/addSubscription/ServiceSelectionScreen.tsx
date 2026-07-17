import React, { useState } from 'react';
import { View, Text, Pressable, TextInput, StyleSheet } from 'react-native';
import { Search, Plus } from 'lucide-react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useTranslation } from 'react-i18next';
import { Screen } from '../../components/Screen';
import { ScreenHeader } from '../../components/ScreenHeader';
import { useTheme } from '../../theme/ThemeProvider';
import { type as textType } from '../../theme/typography';
import { getServiceIcon } from '../../utils/serviceIcons';
import { RootStackParamList } from '../../navigation/types';

const POPULAR_SERVICES = [
  { name: 'Netflix', color: '#E11D2E', category: 'entertainment' },
  { name: 'Spotify', color: '#1DB855', category: 'entertainment' },
  { name: 'iCloud+', color: '#4C9AFF', category: 'mobile' },
  { name: 'Disney+', color: '#113CCF', category: 'entertainment' },
  { name: 'YouTube Premium', color: '#E11D2E', category: 'entertainment' },
  { name: 'Canva Pro', color: '#8B3DFF', category: 'software' },
];

export function ServiceSelectionScreen() {
  const { colors, spacing, radius } = useTheme();
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const { t } = useTranslation();
  const [query, setQuery] = useState('');

  const filtered = POPULAR_SERVICES.filter((s) => s.name.toLowerCase().includes(query.toLowerCase()));

  const pick = (service?: (typeof POPULAR_SERVICES)[number]) => {
    navigation.navigate('AddDetailsForm', {
      serviceName: service?.name,
      serviceColor: service?.color,
      categoryId: service?.category,
    });
  };

  return (
    <Screen>
      <ScreenHeader title={t('serviceSelection.title')} />
      <View style={[styles.searchBar, { backgroundColor: colors.bgSurfaceSecondary, borderRadius: radius.full }]}>
        <Search size={18} color={colors.textTertiary} />
        <TextInput
          value={query}
          onChangeText={setQuery}
          placeholder={t('serviceSelection.searchPlaceholder')}
          placeholderTextColor={colors.textTertiary}
          style={[textType.body, { color: colors.textPrimary, flex: 1, marginLeft: 8 }]}
        />
      </View>

      <Text style={[textType.bodySmall, { color: colors.textTertiary }]}>{t('serviceSelection.popularServices')}</Text>
      <View style={styles.grid}>
        {filtered.map((service) => {
          const Icon = getServiceIcon(service.name);
          return (
            <Pressable key={service.name} onPress={() => pick(service)} style={styles.gridItem}>
              <View style={[styles.serviceCircle, { backgroundColor: service.color, borderRadius: radius.full }]}>
                <Icon size={24} color="#FFFFFF" />
              </View>
              <Text style={[textType.bodySmall, { color: colors.textPrimary, marginTop: 8, textAlign: 'center' }]}>{service.name}</Text>
            </Pressable>
          );
        })}
      </View>

      <Pressable
        onPress={() => pick()}
        style={[styles.customRow, { borderColor: colors.borderDefault, borderRadius: radius.lg }]}
      >
        <Plus size={20} color={colors.accentPrimary} />
        <Text style={[textType.bodyMedium, { color: colors.accentPrimary, marginLeft: 8 }]}>{t('serviceSelection.addCustom')}</Text>
      </Pressable>
    </Screen>
  );
}

const styles = StyleSheet.create({
  searchBar: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16, height: 48 },
  grid: { flexDirection: 'row', flexWrap: 'wrap', gap: 16 },
  gridItem: { width: '30%', alignItems: 'center' },
  serviceCircle: { width: 56, height: 56, alignItems: 'center', justifyContent: 'center' },
  customRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', height: 56, borderWidth: 1 },
});
