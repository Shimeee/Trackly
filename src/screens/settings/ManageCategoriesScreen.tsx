import React from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import { Plus } from 'lucide-react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useTranslation } from 'react-i18next';
import { Screen } from '../../components/Screen';
import { ScreenHeader } from '../../components/ScreenHeader';
import { Card } from '../../components/Card';
import { Divider } from '../../components/Row';
import { useTheme } from '../../theme/ThemeProvider';
import { type as textType } from '../../theme/typography';
import { useSettingsStore } from '../../store/settingsStore';
import { useSubscriptionsStore } from '../../store/subscriptionsStore';
import { RootStackParamList } from '../../navigation/types';
import { categoryName } from '../../utils/categoryLabel';

export function ManageCategoriesScreen() {
  const { colors, spacing } = useTheme();
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const { t } = useTranslation();
  const categories = useSettingsStore((s) => s.categories);
  const subscriptions = useSubscriptionsStore((s) => s.subscriptions);

  return (
    <Screen>
      <ScreenHeader title={t('manageCategories.title')} />
      <Card>
        {categories.map((c, i) => {
          const count = subscriptions.filter((s) => s.categoryId === c.id).length;
          return (
            <React.Fragment key={c.id}>
              <View style={[styles.row, { paddingVertical: spacing.md, paddingHorizontal: spacing.lg }]}>
                <View style={[styles.dot, { backgroundColor: c.color }]} />
                <View style={{ flex: 1, marginLeft: 12 }}>
                  <Text style={[textType.body, { color: colors.textPrimary }]}>{categoryName(c, t)}</Text>
                  <Text style={[textType.caption, { color: colors.textTertiary, marginTop: 2 }]}>{t('manageCategories.subscriptionsCount', { count })}</Text>
                </View>
              </View>
              {i < categories.length - 1 && <Divider />}
            </React.Fragment>
          );
        })}
      </Card>

      <Pressable onPress={() => navigation.navigate('AddCategory')} style={styles.addRow}>
        <Plus size={20} color={colors.accentPrimary} />
        <Text style={[textType.bodyMedium, { color: colors.accentPrimary, marginLeft: 8 }]}>{t('manageCategories.addCategory')}</Text>
      </Pressable>
    </Screen>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'center' },
  dot: { width: 12, height: 12, borderRadius: 6 },
  addRow: { flexDirection: 'row', alignItems: 'center', paddingVertical: 8 },
});
