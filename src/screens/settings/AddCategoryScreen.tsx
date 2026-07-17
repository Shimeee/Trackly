import React, { useState } from 'react';
import { View, Text, TextInput, Pressable, StyleSheet } from 'react-native';
import { Check, Laptop, Clapperboard, Wifi, HeartPulse, MoreHorizontal } from 'lucide-react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useTranslation } from 'react-i18next';
import { Screen } from '../../components/Screen';
import { ScreenHeader } from '../../components/ScreenHeader';
import { Button } from '../../components/Button';
import { useTheme } from '../../theme/ThemeProvider';
import { type as textType } from '../../theme/typography';
import { useSettingsStore } from '../../store/settingsStore';
import { RootStackParamList } from '../../navigation/types';

const SWATCHES = ['#DC3D3D', '#1DB855', '#4C9AFF', '#113CCF', '#EA8317', '#8B3DFF', '#4338CA', '#E64B8F'];
const ICONS = [
  { key: 'wifi', Icon: Wifi }, { key: 'clapperboard', Icon: Clapperboard }, { key: 'laptop', Icon: Laptop },
  { key: 'heart-pulse', Icon: HeartPulse }, { key: 'more-horizontal', Icon: MoreHorizontal },
];

export function AddCategoryScreen() {
  const { colors, radius } = useTheme();
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const { t } = useTranslation();
  const addCategory = useSettingsStore((s) => s.addCategory);
  const [name, setName] = useState('');
  const [color, setColor] = useState(SWATCHES[0]);
  const [icon, setIcon] = useState(ICONS[0].key);

  const onSave = () => {
    if (!name.trim()) return;
    addCategory({ id: name.trim().toLowerCase().replace(/\s+/g, '-') + '-' + Date.now(), name: name.trim(), color, icon });
    navigation.goBack();
  };

  return (
    <Screen>
      <ScreenHeader title={t('addCategory.title')} />
      <TextInput
        value={name}
        onChangeText={setName}
        placeholder={t('addCategory.namePlaceholder')}
        placeholderTextColor={colors.textTertiary}
        style={[styles.input, textType.body, { color: colors.textPrimary, borderColor: colors.borderDefault, borderRadius: radius.lg }]}
      />

      <Text style={[textType.label, { color: colors.textTertiary }]}>{t('addCategory.colorLabel')}</Text>
      <View style={styles.grid}>
        {SWATCHES.map((c) => (
          <Pressable key={c} onPress={() => setColor(c)} style={[styles.swatch, { backgroundColor: c, borderRadius: radius.full }]}>
            {color === c && <Check size={18} color="#FFFFFF" />}
          </Pressable>
        ))}
      </View>

      <Text style={[textType.label, { color: colors.textTertiary }]}>{t('addCategory.iconLabel')}</Text>
      <View style={styles.grid}>
        {ICONS.map(({ key, Icon }) => (
          <Pressable
            key={key}
            onPress={() => setIcon(key)}
            style={[
              styles.iconTile,
              { backgroundColor: colors.bgSurfaceSecondary, borderRadius: radius.md, borderColor: icon === key ? colors.accentPrimary : 'transparent' },
            ]}
          >
            <Icon size={20} color={icon === key ? colors.accentPrimary : colors.textPrimary} />
          </Pressable>
        ))}
      </View>

      <Button label={t('addCategory.saveCategory')} disabled={!name.trim()} onPress={onSave} />
    </Screen>
  );
}

const styles = StyleSheet.create({
  input: { height: 48, borderWidth: 1, paddingHorizontal: 16 },
  grid: { flexDirection: 'row', flexWrap: 'wrap', gap: 14 },
  swatch: { width: 40, height: 40, alignItems: 'center', justifyContent: 'center' },
  iconTile: { width: 44, height: 44, alignItems: 'center', justifyContent: 'center', borderWidth: 2 },
});
