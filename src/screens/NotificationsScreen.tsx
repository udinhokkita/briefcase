import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, radius, spacing } from '../theme/colors';
import { Screen, Body } from '../components/ui';
import { TopBar } from '../components/TopBar';
import { useStore, useT } from '../store/useStore';
import { AppNotification } from '../data/mockData';

type Cat = 'all' | AppNotification['category'];

const ICONS: Record<AppNotification['category'], keyof typeof Ionicons.glyphMap> = {
  matches: 'game-controller',
  recruitment: 'briefcase',
  social: 'heart',
  system: 'shield-checkmark',
};

const CAT_COLORS: Record<AppNotification['category'], string> = {
  matches: colors.blue,
  recruitment: colors.primary,
  social: colors.accent,
  system: colors.green,
};

export const NotificationsScreen: React.FC = () => {
  const t = useT();
  const lang = useStore((s) => s.lang);
  const notifications = useStore((s) => s.notifications);
  const showToast = useStore((s) => s.showToast);
  const [cat, setCat] = useState<Cat>('all');

  const tabs: { key: Cat; label: string }[] = [
    { key: 'all', label: t('filter_all') },
    { key: 'matches', label: t('notif_matches') },
    { key: 'recruitment', label: t('notif_recruitment') },
    { key: 'social', label: t('notif_social') },
    { key: 'system', label: t('notif_system') },
  ];

  const filtered = cat === 'all' ? notifications : notifications.filter((n) => n.category === cat);

  return (
    <Screen>
      <TopBar title={t('tab_notifications')} />

      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ paddingBottom: spacing.md }} style={{ marginBottom: spacing.sm }}>
        {tabs.map((tab) => (
          <TouchableOpacity key={tab.key} style={[styles.tab, cat === tab.key && styles.tabActive]} onPress={() => setCat(tab.key)}>
            <Text style={[styles.tabText, cat === tab.key && styles.tabTextActive]}>{tab.label}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {filtered.map((n) => (
        <View key={n.id} style={styles.card}>
          <View style={styles.topRow}>
            <View style={[styles.iconWrap, { backgroundColor: CAT_COLORS[n.category] + '22' }]}>
              <Ionicons name={ICONS[n.category]} size={18} color={CAT_COLORS[n.category]} />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.title}>{n.title[lang]}</Text>
              <Text style={styles.body}>{n.body[lang]}</Text>
            </View>
            <Text style={styles.time}>{n.time}</Text>
          </View>
          {n.actionable && (
            <View style={styles.actions}>
              <ActBtn label={t('accept')} variant="primary" onPress={() => showToast(lang === 'ms' ? 'Tawaran diterima!' : 'Offer accepted!')} />
              <ActBtn label={t('counter')} variant="outline" onPress={() => showToast(lang === 'ms' ? 'Kaunter dihantar' : 'Counter sent')} />
              <ActBtn label={t('decline')} variant="ghost" onPress={() => showToast(lang === 'ms' ? 'Tawaran ditolak' : 'Offer declined')} />
            </View>
          )}
        </View>
      ))}

      {filtered.length === 0 && (
        <View style={styles.empty}>
          <Ionicons name="notifications-off-outline" size={36} color={colors.textFaint} />
          <Body muted style={{ marginTop: spacing.sm }}>
            {t('notif_empty')}
          </Body>
        </View>
      )}
    </Screen>
  );
};

const ActBtn: React.FC<{ label: string; variant: 'primary' | 'outline' | 'ghost'; onPress: () => void }> = ({ label, variant, onPress }) => {
  const bg = variant === 'primary' ? colors.primary : 'transparent';
  const color = variant === 'primary' ? colors.bg : variant === 'ghost' ? colors.textMuted : colors.primary;
  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.8}
      style={[styles.actBtn, { backgroundColor: bg }, variant === 'outline' && { borderWidth: 1, borderColor: colors.primary }]}
    >
      <Text style={[styles.actText, { color }]}>{label}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  tab: { paddingHorizontal: spacing.md, paddingVertical: 8, borderRadius: radius.pill, borderWidth: 1, borderColor: colors.border, backgroundColor: colors.cardAlt, marginRight: spacing.sm },
  tabActive: { backgroundColor: colors.primary, borderColor: colors.primary },
  tabText: { color: colors.textMuted, fontSize: 13, fontWeight: '700' },
  tabTextActive: { color: colors.bg },
  card: { backgroundColor: colors.card, borderRadius: radius.lg, borderWidth: 1, borderColor: colors.border, padding: spacing.md, marginBottom: spacing.md },
  topRow: { flexDirection: 'row', alignItems: 'flex-start', gap: spacing.md },
  iconWrap: { width: 38, height: 38, borderRadius: 10, alignItems: 'center', justifyContent: 'center' },
  title: { color: colors.text, fontWeight: '700', fontSize: 14 },
  body: { color: colors.textMuted, fontSize: 13, marginTop: 3, lineHeight: 18 },
  time: { color: colors.textFaint, fontSize: 11 },
  actions: { flexDirection: 'row', gap: spacing.sm, marginTop: spacing.md, marginLeft: 50 },
  actBtn: { paddingHorizontal: spacing.lg, paddingVertical: 8, borderRadius: radius.sm },
  actText: { fontSize: 13, fontWeight: '700' },
  empty: { alignItems: 'center', paddingVertical: spacing.xxl },
});
