import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { colors, radius, spacing } from '../theme/colors';
import { Screen, Body } from '../components/ui';
import { TopBar } from '../components/TopBar';
import { useStore, useT } from '../store/useStore';
import { gameById } from '../data/games';
import { Tournament } from '../data/mockData';
import { RootStackParamList } from '../navigation/types';

type StatusFilter = 'active' | 'upcoming' | 'completed';

export const TournamentsScreen: React.FC = () => {
  const t = useT();
  const lang = useStore((s) => s.lang);
  const tournaments = useStore((s) => s.tournaments);
  const nav = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const [filter, setFilter] = useState<StatusFilter>('active');

  const filtered = tournaments.filter((x) => x.status === filter);

  return (
    <Screen>
      <TopBar
        title={t('tournaments_title')}
        right={
          <TouchableOpacity style={styles.createBtn} onPress={() => nav.navigate('CreateTournament')} activeOpacity={0.85}>
            <Ionicons name="add" size={18} color={colors.bg} />
            <Text style={styles.createText}>{t('create_tournament')}</Text>
          </TouchableOpacity>
        }
      />

      <View style={styles.tabs}>
        {(['active', 'upcoming', 'completed'] as StatusFilter[]).map((s) => (
          <TouchableOpacity key={s} style={[styles.tab, filter === s && styles.tabActive]} onPress={() => setFilter(s)}>
            <Text style={[styles.tabText, filter === s && styles.tabTextActive]}>{t(s)}</Text>
          </TouchableOpacity>
        ))}
      </View>

      {filtered.map((tr) => (
        <TournamentRow key={tr.id} tr={tr} onPress={() => nav.navigate('TournamentDetail', { tournamentId: tr.id })} />
      ))}
      {filtered.length === 0 && (
        <View style={styles.empty}>
          <Ionicons name="trophy-outline" size={36} color={colors.textFaint} />
          <Body muted style={{ marginTop: spacing.sm }}>
            {lang === 'ms' ? 'Tiada kejohanan.' : 'No tournaments.'}
          </Body>
        </View>
      )}
    </Screen>
  );
};

const TournamentRow: React.FC<{ tr: Tournament; onPress: () => void }> = ({ tr, onPress }) => {
  const t = useT();
  const game = gameById(tr.gameId);
  const fillPct = Math.round((tr.registered / tr.capacity) * 100);
  return (
    <TouchableOpacity style={styles.card} onPress={onPress} activeOpacity={0.85}>
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: spacing.sm }}>
        <View style={[styles.gameTag, { backgroundColor: game.color + '22', borderColor: game.color }]}>
          <Text style={[styles.gameTagText, { color: game.color }]}>{game.short}</Text>
        </View>
        <Text style={styles.format}>{tr.format}</Text>
        <View style={styles.feeTag}>
          <Text style={styles.feeText}>{tr.entryFeeMYR === 0 ? t('free') : `MYR ${tr.entryFeeMYR}`}</Text>
        </View>
      </View>

      <Text style={styles.name}>{tr.name}</Text>
      <View style={styles.metaRow}>
        <Ionicons name="location-outline" size={13} color={colors.textMuted} />
        <Text style={styles.metaText}>{tr.state}</Text>
        <Ionicons name="person-outline" size={13} color={colors.textMuted} style={{ marginLeft: 8 }} />
        <Text style={styles.metaText}>{tr.organizer}</Text>
      </View>

      <View style={styles.bottomRow}>
        <View>
          <Text style={styles.prizeLabel}>{t('prize_pool')}</Text>
          <Text style={styles.prize}>MYR {tr.prizePoolMYR.toLocaleString()}</Text>
        </View>
        <View style={{ flex: 1, marginLeft: spacing.lg }}>
          <Text style={styles.fillText}>
            {tr.registered}/{tr.capacity} {t('teams')}
          </Text>
          <View style={styles.barBg}>
            <View style={[styles.barFill, { width: `${fillPct}%`, backgroundColor: game.color }]} />
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  createBtn: { flexDirection: 'row', alignItems: 'center', gap: 4, backgroundColor: colors.primary, paddingHorizontal: spacing.md, paddingVertical: 8, borderRadius: radius.pill },
  createText: { color: colors.bg, fontWeight: '800', fontSize: 12 },
  tabs: { flexDirection: 'row', backgroundColor: colors.card, borderRadius: radius.md, padding: 4, marginBottom: spacing.lg, borderWidth: 1, borderColor: colors.border },
  tab: { flex: 1, paddingVertical: 8, borderRadius: radius.sm, alignItems: 'center' },
  tabActive: { backgroundColor: colors.primary },
  tabText: { color: colors.textMuted, fontWeight: '700', fontSize: 13 },
  tabTextActive: { color: colors.bg },
  card: { backgroundColor: colors.card, borderRadius: radius.lg, borderWidth: 1, borderColor: colors.border, padding: spacing.lg, marginBottom: spacing.md },
  gameTag: { borderWidth: 1, borderRadius: 6, paddingHorizontal: 8, paddingVertical: 2 },
  gameTagText: { fontSize: 11, fontWeight: '800' },
  format: { color: colors.textMuted, fontSize: 12 },
  feeTag: { marginLeft: 'auto', backgroundColor: colors.cardAlt, borderRadius: 6, paddingHorizontal: 8, paddingVertical: 2 },
  feeText: { color: colors.text, fontSize: 12, fontWeight: '700' },
  name: { color: colors.text, fontWeight: '800', fontSize: 16, marginTop: spacing.sm },
  metaRow: { flexDirection: 'row', alignItems: 'center', gap: 4, marginTop: 6 },
  metaText: { color: colors.textMuted, fontSize: 12 },
  bottomRow: { flexDirection: 'row', alignItems: 'center', marginTop: spacing.md },
  prizeLabel: { color: colors.textMuted, fontSize: 11 },
  prize: { color: colors.primary, fontWeight: '900', fontSize: 16 },
  fillText: { color: colors.textMuted, fontSize: 12, marginBottom: 4 },
  barBg: { height: 6, borderRadius: 3, backgroundColor: colors.cardAlt, overflow: 'hidden' },
  barFill: { height: 6, borderRadius: 3 },
  empty: { alignItems: 'center', paddingVertical: spacing.xxl },
});
