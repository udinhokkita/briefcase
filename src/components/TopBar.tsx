import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { colors, radius, spacing, gradients, shadow } from '../theme/colors';
import { useStore } from '../store/useStore';

export const LangToggle: React.FC = () => {
  const lang = useStore((s) => s.lang);
  const toggleLang = useStore((s) => s.toggleLang);
  return (
    <TouchableOpacity style={styles.langBtn} onPress={toggleLang} activeOpacity={0.7}>
      <Ionicons name="language" size={14} color={colors.primary} />
      <Text style={styles.langBtnText}>{lang === 'ms' ? 'BM' : 'EN'}</Text>
    </TouchableOpacity>
  );
};

export const BrandMark: React.FC<{ size?: number }> = ({ size = 40 }) => (
  <LinearGradient
    colors={gradients.gold}
    start={{ x: 0, y: 0 }}
    end={{ x: 1, y: 1 }}
    style={[styles.brand, { width: size, height: size, borderRadius: size * 0.32 }, shadow.glow]}
  >
    <Ionicons name="briefcase" size={size * 0.5} color={colors.bg} />
  </LinearGradient>
);

export const TopBar: React.FC<{ title: string; subtitle?: string; right?: React.ReactNode; brand?: boolean }> = ({
  title,
  subtitle,
  right,
  brand,
}) => (
  <View style={styles.bar}>
    {brand ? <BrandMark size={42} /> : null}
    <View style={{ flex: 1, marginLeft: brand ? spacing.md : 0 }}>
      {subtitle ? <Text style={styles.subtitle}>{subtitle}</Text> : null}
      <Text style={styles.title}>{title}</Text>
    </View>
    {right ?? <LangToggle />}
  </View>
);

const styles = StyleSheet.create({
  bar: { flexDirection: 'row', alignItems: 'center', marginBottom: spacing.lg },
  brand: { alignItems: 'center', justifyContent: 'center' },
  title: { color: colors.text, fontSize: 25, fontWeight: '900', letterSpacing: -0.6 },
  subtitle: { color: colors.textMuted, fontSize: 13, marginBottom: 2, fontWeight: '600' },
  langBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: colors.primary + '1A',
    borderColor: colors.primary + '55',
    borderWidth: 1,
    paddingHorizontal: spacing.md,
    paddingVertical: 7,
    borderRadius: radius.pill,
  },
  langBtnText: { color: colors.primary, fontWeight: '800', fontSize: 12 },
});
