import React from 'react';
import {
  Text,
  View,
  TouchableOpacity,
  StyleSheet,
  ViewStyle,
  TextStyle,
  StyleProp,
  ScrollView,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { colors, radius, spacing, shadow, gradients, Gradient } from '../theme/colors';

export const Card: React.FC<{ children: React.ReactNode; style?: StyleProp<ViewStyle> }> = ({
  children,
  style,
}) => <View style={[styles.card, style]}>{children}</View>;

export const GradientCard: React.FC<{
  children: React.ReactNode;
  colorsArr?: Gradient;
  style?: StyleProp<ViewStyle>;
  glow?: boolean;
}> = ({ children, colorsArr = gradients.hero, style, glow }) => (
  <LinearGradient
    colors={colorsArr}
    start={{ x: 0, y: 0 }}
    end={{ x: 1, y: 1 }}
    style={[styles.gradientCard, glow && shadow.glow, style]}
  >
    {children}
  </LinearGradient>
);

export const Screen: React.FC<{ children: React.ReactNode; scroll?: boolean; style?: StyleProp<ViewStyle> }> = ({
  children,
  scroll = true,
  style,
}) => (
  <LinearGradient colors={gradients.screen} style={styles.screen}>
    <SafeAreaView style={styles.flex} edges={['top']}>
      {scroll ? (
        <ScrollView contentContainerStyle={[styles.scrollContent, style]} showsVerticalScrollIndicator={false}>
          {children}
        </ScrollView>
      ) : (
        <View style={[styles.flex, style]}>{children}</View>
      )}
    </SafeAreaView>
  </LinearGradient>
);

export const H1: React.FC<{ children: React.ReactNode; style?: StyleProp<TextStyle> }> = ({ children, style }) => (
  <Text style={[styles.h1, style]}>{children}</Text>
);
export const H2: React.FC<{ children: React.ReactNode; style?: StyleProp<TextStyle> }> = ({ children, style }) => (
  <Text style={[styles.h2, style]}>{children}</Text>
);
export const Body: React.FC<{ children: React.ReactNode; muted?: boolean; style?: StyleProp<TextStyle> }> = ({
  children,
  muted,
  style,
}) => <Text style={[styles.body, muted && { color: colors.textMuted }, style]}>{children}</Text>;

export const Eyebrow: React.FC<{ children: React.ReactNode; color?: string; style?: StyleProp<TextStyle> }> = ({
  children,
  color,
  style,
}) => <Text style={[styles.eyebrow, color ? { color } : null, style]}>{children}</Text>;

export const Pill: React.FC<{
  label: string;
  active?: boolean;
  color?: string;
  onPress?: () => void;
}> = ({ label, active, color, onPress }) => {
  const content = (
    <View
      style={[
        styles.pill,
        active && { backgroundColor: color ?? colors.primary, borderColor: color ?? colors.primary, ...shadow.soft },
      ]}
    >
      <Text style={[styles.pillText, active && { color: colors.bg, fontWeight: '800' }]}>{label}</Text>
    </View>
  );
  if (onPress) {
    return (
      <TouchableOpacity onPress={onPress} activeOpacity={0.7}>
        {content}
      </TouchableOpacity>
    );
  }
  return content;
};

export const Tag: React.FC<{ label: string; color?: string }> = ({ label, color }) => (
  <View style={[styles.tag, { borderColor: (color ?? colors.primary) + '66', backgroundColor: (color ?? colors.primary) + '22' }]}>
    <Text style={[styles.tagText, { color: color ?? colors.primary }]}>{label}</Text>
  </View>
);

export const Button: React.FC<{
  title: string;
  onPress: () => void;
  variant?: 'primary' | 'outline' | 'ghost' | 'success';
  disabled?: boolean;
  style?: StyleProp<ViewStyle>;
  icon?: React.ReactNode;
}> = ({ title, onPress, variant = 'primary', disabled, style, icon }) => {
  const gradient = variant === 'primary' ? gradients.gold : variant === 'success' ? gradients.green : null;
  const textColor =
    variant === 'primary' || variant === 'success'
      ? colors.bg
      : variant === 'ghost'
      ? colors.textMuted
      : colors.primary;

  const inner = (
    <>
      {icon}
      <Text style={[styles.btnText, { color: textColor }]}>{title}</Text>
    </>
  );

  if (gradient) {
    return (
      <TouchableOpacity onPress={onPress} disabled={disabled} activeOpacity={0.85} style={[disabled && { opacity: 0.4 }, style]}>
        <LinearGradient
          colors={gradient}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={[styles.btn, !disabled && (variant === 'primary' ? shadow.glow : shadow.soft)]}
        >
          {inner}
        </LinearGradient>
      </TouchableOpacity>
    );
  }

  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={disabled}
      activeOpacity={0.8}
      style={[
        styles.btn,
        { backgroundColor: 'transparent' },
        variant === 'outline' && { borderWidth: 1.5, borderColor: colors.primary },
        disabled && { opacity: 0.4 },
        style,
      ]}
    >
      {inner}
    </TouchableOpacity>
  );
};

export const Row: React.FC<{ children: React.ReactNode; style?: StyleProp<ViewStyle> }> = ({ children, style }) => (
  <View style={[{ flexDirection: 'row', alignItems: 'center' }, style]}>{children}</View>
);

export const Divider = () => <View style={styles.divider} />;

const styles = StyleSheet.create({
  flex: { flex: 1 },
  screen: { flex: 1 },
  scrollContent: { padding: spacing.lg, paddingBottom: spacing.xxl * 3 },
  card: {
    backgroundColor: colors.card,
    borderRadius: radius.lg,
    padding: spacing.lg,
    borderWidth: 1,
    borderColor: colors.border,
    marginBottom: spacing.md,
    ...shadow.soft,
  },
  gradientCard: {
    borderRadius: radius.lg,
    padding: spacing.lg,
    borderWidth: 1,
    borderColor: colors.hairline,
    marginBottom: spacing.md,
    overflow: 'hidden',
  },
  h1: { color: colors.text, fontSize: 30, fontWeight: '900', letterSpacing: -0.8 },
  h2: { color: colors.text, fontSize: 19, fontWeight: '800', letterSpacing: -0.3 },
  body: { color: colors.text, fontSize: 14, lineHeight: 21 },
  eyebrow: { color: colors.primary, fontSize: 11, fontWeight: '800', letterSpacing: 1.5, textTransform: 'uppercase' },
  pill: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: radius.pill,
    borderWidth: 1,
    borderColor: colors.borderStrong,
    backgroundColor: colors.cardAlt,
    marginRight: spacing.sm,
    marginBottom: spacing.sm,
  },
  pillText: { color: colors.textMuted, fontSize: 13, fontWeight: '600' },
  tag: {
    paddingHorizontal: spacing.sm,
    paddingVertical: 3,
    borderRadius: radius.sm,
    borderWidth: 1,
    alignSelf: 'flex-start',
  },
  tagText: { fontSize: 11, fontWeight: '800', letterSpacing: 0.5 },
  btn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 15,
    paddingHorizontal: spacing.lg,
    borderRadius: radius.md,
  },
  btnText: { fontSize: 15, fontWeight: '800', letterSpacing: 0.2 },
  divider: { height: 1, backgroundColor: colors.border, marginVertical: spacing.md },
});
