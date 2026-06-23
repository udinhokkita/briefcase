import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Switch } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors, radius, spacing } from '../theme/colors';
import { useStore, useT } from '../store/useStore';
import { RootStackParamList } from '../navigation/types';

export const SettingsScreen: React.FC = () => {
  const t = useT();
  const lang = useStore((s) => s.lang);
  const setLang = useStore((s) => s.setLang);
  const consentGiven = useStore((s) => s.consentGiven);
  const setConsent = useStore((s) => s.setConsent);
  const showToast = useStore((s) => s.showToast);
  const nav = useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  return (
    <SafeAreaView style={styles.screen} edges={['top']}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => nav.goBack()} style={styles.backBtn}>
          <Ionicons name="chevron-back" size={22} color={colors.text} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{t('settings')}</Text>
        <View style={{ width: 38 }} />
      </View>

      <View style={{ padding: spacing.lg }}>
        <Section title={t('language')}>
          <View style={styles.langRow}>
            {(['ms', 'en'] as const).map((l) => (
              <TouchableOpacity
                key={l}
                style={[styles.langOpt, lang === l && styles.langOptActive]}
                onPress={() => setLang(l)}
                activeOpacity={0.8}
              >
                <Text style={styles.langFlag}>{l === 'ms' ? '🇲🇾' : '🇬🇧'}</Text>
                <Text style={[styles.langText, lang === l && { color: colors.bg }]}>
                  {l === 'ms' ? 'Bahasa Malaysia' : 'English'}
                </Text>
                {lang === l && <Ionicons name="checkmark-circle" size={18} color={colors.bg} />}
              </TouchableOpacity>
            ))}
          </View>
        </Section>

        <Section title={t('set_privacy')}>
          <Row
            icon="document-text-outline"
            label={t('set_data_consent')}
            right={<Switch value={consentGiven} onValueChange={setConsent} trackColor={{ true: colors.primary, false: colors.cardAlt }} thumbColor={colors.white} />}
          />
          <Row icon="download-outline" label={t('set_export_data')} onPress={() => showToast(t('toast_export'))} />
          <Row icon="trash-outline" label={t('set_delete_data')} danger onPress={() => showToast(lang === 'ms' ? 'Sahkan melalui e-mel untuk memadam akaun.' : 'Confirm via email to delete account.')} />
          <Text style={styles.note}>{t('set_pdpa_note')}</Text>
        </Section>

        <Section title={t('set_about')}>
          <Row icon="information-circle-outline" label={t('set_version')} right={<Text style={styles.version}>1.0.0 (MVP)</Text>} />
        </Section>
      </View>
    </SafeAreaView>
  );
};

const Section: React.FC<{ title: string; children: React.ReactNode }> = ({ title, children }) => (
  <View style={{ marginBottom: spacing.xl }}>
    <Text style={styles.sectionTitle}>{title}</Text>
    <View style={styles.card}>{children}</View>
  </View>
);

const Row: React.FC<{
  icon: keyof typeof Ionicons.glyphMap;
  label: string;
  right?: React.ReactNode;
  onPress?: () => void;
  danger?: boolean;
}> = ({ icon, label, right, onPress, danger }) => (
  <TouchableOpacity style={styles.row} onPress={onPress} disabled={!onPress} activeOpacity={0.7}>
    <Ionicons name={icon} size={18} color={danger ? colors.danger : colors.textMuted} />
    <Text style={[styles.rowLabel, danger && { color: colors.danger }]}>{label}</Text>
    {right ?? (onPress ? <Ionicons name="chevron-forward" size={18} color={colors.textFaint} /> : null)}
  </TouchableOpacity>
);

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.bg },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: spacing.lg, paddingVertical: spacing.md, borderBottomWidth: 1, borderBottomColor: colors.border },
  backBtn: { width: 38, height: 38, borderRadius: 19, backgroundColor: colors.card, alignItems: 'center', justifyContent: 'center' },
  headerTitle: { color: colors.text, fontWeight: '800', fontSize: 17 },
  sectionTitle: { color: colors.textMuted, fontSize: 12, fontWeight: '800', textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: spacing.sm },
  card: { backgroundColor: colors.card, borderRadius: radius.lg, borderWidth: 1, borderColor: colors.border, paddingHorizontal: spacing.md },
  row: { flexDirection: 'row', alignItems: 'center', gap: spacing.md, paddingVertical: spacing.md, borderBottomWidth: StyleSheet.hairlineWidth, borderBottomColor: colors.border },
  rowLabel: { color: colors.text, fontSize: 14, flex: 1 },
  note: { color: colors.textFaint, fontSize: 12, paddingVertical: spacing.md, lineHeight: 17 },
  langRow: { gap: spacing.sm, paddingVertical: spacing.sm },
  langOpt: { flexDirection: 'row', alignItems: 'center', gap: spacing.md, paddingVertical: spacing.md, paddingHorizontal: spacing.md, borderRadius: radius.md, backgroundColor: colors.cardAlt },
  langOptActive: { backgroundColor: colors.primary },
  langFlag: { fontSize: 20 },
  langText: { color: colors.text, fontSize: 14, fontWeight: '700', flex: 1 },
  version: { color: colors.textMuted, fontSize: 13 },
});
