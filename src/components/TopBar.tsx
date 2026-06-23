import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, radius, spacing } from '../theme/colors';
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

export const TopBar: React.FC<{ title: string; subtitle?: string; right?: React.ReactNode }> = ({
  title,
  subtitle,
  right,
}) => (
  <View style={styles.bar}>
    <View style={{ flex: 1 }}>
      {subtitle ? <Text style={styles.subtitle}>{subtitle}</Text> : null}
      <Text style={styles.title}>{title}</Text>
    </View>
    {right ?? <LangToggle />}
  </View>
);

const styles = StyleSheet.create({
  bar: { flexDirection: 'row', alignItems: 'center', marginBottom: spacing.lg },
  title: { color: colors.text, fontSize: 24, fontWeight: '800', letterSpacing: -0.5 },
  subtitle: { color: colors.textMuted, fontSize: 13, marginBottom: 2 },
  langBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: colors.primary + '1A',
    borderColor: colors.primary + '55',
    borderWidth: 1,
    paddingHorizontal: spacing.md,
    paddingVertical: 6,
    borderRadius: radius.pill,
  },
  langBtnText: { color: colors.primary, fontWeight: '800', fontSize: 12 },
});
