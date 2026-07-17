import React from 'react';
import { Pressable, Text, StyleSheet, ActivityIndicator } from 'react-native';
import { useTheme } from '../theme/ThemeProvider';
import { type as textType } from '../theme/typography';

type Props = {
  label: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary' | 'ghost' | 'destructive';
  disabled?: boolean;
  loading?: boolean;
};

export function Button({ label, onPress, variant = 'primary', disabled, loading }: Props) {
  const { colors, radius } = useTheme();

  const bg =
    variant === 'primary' ? colors.accentPrimary :
    variant === 'destructive' ? colors.statusError :
    variant === 'secondary' ? 'transparent' : 'transparent';

  const border = variant === 'secondary' ? colors.borderDefault : 'transparent';
  const textColor =
    variant === 'primary' || variant === 'destructive' ? colors.textOnAccent :
    variant === 'secondary' ? colors.textPrimary : colors.accentPrimary;

  return (
    <Pressable
      onPress={onPress}
      disabled={disabled || loading}
      style={({ pressed }) => [
        styles.base,
        {
          backgroundColor: bg,
          borderColor: border,
          borderWidth: variant === 'secondary' ? 1 : 0,
          borderRadius: radius.lg,
          opacity: disabled ? 0.4 : pressed ? 0.85 : 1,
        },
      ]}
    >
      {loading ? (
        <ActivityIndicator color={textColor} />
      ) : (
        <Text style={[textType.button, { color: textColor }]}>{label}</Text>
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  base: {
    height: 48,
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
  },
});
