import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { colors, radius, spacing } from '../theme/colors';
import { Screen, Card, Button } from '../components/ui';
import { LangToggle } from '../components/TopBar';
import { useStore, useT } from '../store/useStore';
import { gameById } from '../data/games';
import { Match } from '../data/mockData';
import { RootStackParamList } from '../navigation/types';

export const TournamentDetailScreen: React.FC = () => {
  const t = useT();
  const lang = useStore((s) => s.lang);
  const nav = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const route = useRoute<RouteProp<RootStackParamList, 'TournamentDetail'>>();
  const tournaments = useStore((s) => s.tournaments);
  const registerForTournament = useStore((s) => s.registerForTournament);
  const showToast = useStore((s) => s.showToast);
  const tr = tournaments.find((x) => x.id === route.params.tournamentId)!;
  const game = gameById(tr.gameId);
  const [tab, setTab] = useState<'bracket' | 'schedule'>('bracket');

  const rounds = Array.from(new Set(tr.matches.map((m) => m.round))).sort();

  const handleRegister = () => {
    if (tr.entryFeeMYR > 0) {
      nav.navigate('Payment', {
        title: tr.name,
        amountMYR: tr.entryFeeMYR,
        onDoneMessage: t('registered_toast'),
        tournamentId: tr.id,
      });
    } else {
      registerForTournament(tr.id);
      showToast(t('registered_toast'));
    }
  };

  return (
    <Screen>
      <View style={styles.topRow}>
        <TouchableOpacity onPress={() => nav.goBack()} style={styles.backBtn}>
          <Ionicons name="chevron-back" size={22} color={colors.text} />
        </TouchableOpacity>
        <LangToggle />
      </View>

      <View style={{ flexDirection: 'row', alignItems: 'center', gap: spacing.sm }}>
        <View style={[styles.gameTag, { backgroundColor: game.color + '22', borderColor: game.color }]}>
          <Text style={[styles.gameTagText, { color: game.color }]}>{game.short}</Text>
        </View>
        <Text style={styles.format}>{tr.format}</Text>
        {tr.icVerify && (
          <View style={styles.icTag}>
            <Ionicons name="card" size={11} color={colors.blue} />
            <Text style={styles.icText}>MyKad</Text>
          </View>
        )}
      </View>
      <Text style={styles.title}>{tr.name}</Text>
      <View style={styles.metaRow}>
        <Ionicons name="location-outline" size={14} color={colors.textMuted} />
        <Text style={styles.metaText}>{tr.state}</Text>
        <Ionicons name="people-outline" size={14} color={colors.textMuted} style={{ marginLeft: 10 }} />
        <Text style={styles.metaText}>
          {tr.registered}/{tr.capacity} {t('teams')}
        </Text>
      </View>

      <View style={styles.infoRow}>
        <InfoBox label={t('prize_pool')} value={`MYR ${tr.prizePoolMYR.toLocaleString()}`} highlight />
        <InfoBox label={t('entry_fee')} value={tr.entryFeeMYR === 0 ? t('free') : `MYR ${tr.entryFeeMYR}`} />
      </View>

      {tr.status !== 'completed' && (
        <Button
          title={`${t('register')} →`}
          onPress={handleRegister}
          style={{ marginBottom: spacing.lg }}
          icon={<Ionicons name="add-circle" size={18} color={colors.bg} />}
        />
      )}

      {tr.matches.length > 0 && (
        <>
          <View style={styles.tabs}>
            <TouchableOpacity style={[styles.tab, tab === 'bracket' && styles.tabActive]} onPress={() => setTab('bracket')}>
              <Text style={[styles.tabText, tab === 'bracket' && styles.tabTextActive]}>{t('bracket')}</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.tab, tab === 'schedule' && styles.tabActive]} onPress={() => setTab('schedule')}>
              <Text style={[styles.tabText, tab === 'schedule' && styles.tabTextActive]}>{t('schedule')}</Text>
            </TouchableOpacity>
          </View>

          {tab === 'bracket' &&
            rounds.map((r) => (
              <View key={r} style={{ marginBottom: spacing.md }}>
                <Text style={styles.roundLabel}>
                  {lang === 'ms' ? 'Pusingan' : 'Round'} {r}
                </Text>
                {tr.matches
                  .filter((m) => m.round === r)
                  .map((m) => (
                    <MatchCard key={m.id} m={m} onReport={() => nav.navigate('ReportScore', { tournamentId: tr.id, matchId: m.id })} />
                  ))}
              </View>
            ))}

          {tab === 'schedule' &&
            tr.matches.map((m) => (
              <Card key={m.id} style={styles.scheduleRow}>
                <Ionicons name="time-outline" size={16} color={colors.primary} />
                <View style={{ flex: 1, marginLeft: spacing.md }}>
                  <Text style={styles.scheduleTeams}>
                    {m.teamA} vs {m.teamB}
                  </Text>
                  <Text style={styles.scheduleTime}>{m.time}</Text>
                </View>
                <StatusPill status={m.status} />
              </Card>
            ))}
        </>
      )}
    </Screen>
  );
};

const MatchCard: React.FC<{ m: Match; onReport: () => void }> = ({ m, onReport }) => {
  const t = useT();
  const aWon = m.status === 'completed' && (m.scoreA ?? 0) > (m.scoreB ?? 0);
  const bWon = m.status === 'completed' && (m.scoreB ?? 0) > (m.scoreA ?? 0);
  return (
    <View style={styles.match}>
      <TeamRow name={m.teamA} score={m.scoreA} won={aWon} />
      <View style={styles.matchDivider} />
      <TeamRow name={m.teamB} score={m.scoreB} won={bWon} />
      <View style={styles.matchFooter}>
        <Text style={styles.matchTime}>{m.time}</Text>
        {m.status === 'completed' ? (
          <View style={styles.doneChip}>
            <Ionicons name="checkmark" size={12} color={colors.green} />
            <Text style={styles.doneText}>{t('completed')}</Text>
          </View>
        ) : m.status === 'awaiting' ? (
          <Text style={styles.awaitText}>{t('awaiting_confirm')}</Text>
        ) : (
          <TouchableOpacity onPress={onReport} style={styles.reportBtn}>
            <Ionicons name="create-outline" size={13} color={colors.primary} />
            <Text style={styles.reportText}>{t('report_score')}</Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};

const TeamRow: React.FC<{ name: string; score?: number; won?: boolean }> = ({ name, score, won }) => (
  <View style={styles.teamRow}>
    <Text style={[styles.teamName, won && { color: colors.primary, fontWeight: '800' }]}>{name}</Text>
    <Text style={[styles.teamScore, won && { color: colors.primary }]}>{score ?? '-'}</Text>
  </View>
);

const StatusPill: React.FC<{ status: Match['status'] }> = ({ status }) => {
  const map = {
    completed: { c: colors.green, t: 'completed' as const },
    awaiting: { c: colors.orange, t: 'awaiting_confirm' as const },
    scheduled: { c: colors.textMuted, t: 'upcoming' as const },
  };
  const t = useT();
  const cfg = map[status];
  return (
    <View style={[styles.statusPill, { backgroundColor: cfg.c + '22' }]}>
      <Text style={[styles.statusText, { color: cfg.c }]}>{t(cfg.t)}</Text>
    </View>
  );
};

const InfoBox: React.FC<{ label: string; value: string; highlight?: boolean }> = ({ label, value, highlight }) => (
  <View style={styles.infoBox}>
    <Text style={styles.infoLabel}>{label}</Text>
    <Text style={[styles.infoValue, highlight && { color: colors.primary }]}>{value}</Text>
  </View>
);

const styles = StyleSheet.create({
  topRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: spacing.md },
  backBtn: { width: 38, height: 38, borderRadius: 19, backgroundColor: colors.card, borderWidth: 1, borderColor: colors.border, alignItems: 'center', justifyContent: 'center' },
  gameTag: { borderWidth: 1, borderRadius: 6, paddingHorizontal: 8, paddingVertical: 2 },
  gameTagText: { fontSize: 11, fontWeight: '800' },
  format: { color: colors.textMuted, fontSize: 12 },
  icTag: { flexDirection: 'row', alignItems: 'center', gap: 3, backgroundColor: colors.blue + '22', paddingHorizontal: 8, paddingVertical: 2, borderRadius: 6 },
  icText: { color: colors.blue, fontSize: 10, fontWeight: '700' },
  title: { color: colors.text, fontWeight: '900', fontSize: 22, marginTop: spacing.sm },
  metaRow: { flexDirection: 'row', alignItems: 'center', gap: 4, marginTop: 6 },
  metaText: { color: colors.textMuted, fontSize: 13 },
  infoRow: { flexDirection: 'row', gap: spacing.md, marginVertical: spacing.lg },
  infoBox: { flex: 1, backgroundColor: colors.card, borderRadius: radius.md, borderWidth: 1, borderColor: colors.border, padding: spacing.md },
  infoLabel: { color: colors.textMuted, fontSize: 12 },
  infoValue: { color: colors.text, fontWeight: '800', fontSize: 17, marginTop: 4 },
  tabs: { flexDirection: 'row', backgroundColor: colors.card, borderRadius: radius.md, padding: 4, marginBottom: spacing.lg, borderWidth: 1, borderColor: colors.border },
  tab: { flex: 1, paddingVertical: 8, borderRadius: radius.sm, alignItems: 'center' },
  tabActive: { backgroundColor: colors.primary },
  tabText: { color: colors.textMuted, fontWeight: '700', fontSize: 13 },
  tabTextActive: { color: colors.bg },
  roundLabel: { color: colors.textMuted, fontSize: 12, fontWeight: '800', textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: spacing.sm },
  match: { backgroundColor: colors.card, borderRadius: radius.md, borderWidth: 1, borderColor: colors.border, padding: spacing.md, marginBottom: spacing.sm },
  teamRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 4 },
  teamName: { color: colors.text, fontSize: 14, fontWeight: '600' },
  teamScore: { color: colors.textMuted, fontSize: 16, fontWeight: '800', minWidth: 24, textAlign: 'right' },
  matchDivider: { height: 1, backgroundColor: colors.border, marginVertical: 2 },
  matchFooter: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: spacing.sm },
  matchTime: { color: colors.textFaint, fontSize: 12 },
  doneChip: { flexDirection: 'row', alignItems: 'center', gap: 3 },
  doneText: { color: colors.green, fontSize: 11, fontWeight: '700' },
  awaitText: { color: colors.orange, fontSize: 11, fontWeight: '700' },
  reportBtn: { flexDirection: 'row', alignItems: 'center', gap: 4, backgroundColor: colors.primary + '1A', paddingHorizontal: 10, paddingVertical: 5, borderRadius: radius.sm },
  reportText: { color: colors.primary, fontSize: 11, fontWeight: '800' },
  scheduleRow: { flexDirection: 'row', alignItems: 'center' },
  scheduleTeams: { color: colors.text, fontWeight: '700', fontSize: 14 },
  scheduleTime: { color: colors.textMuted, fontSize: 12, marginTop: 2 },
  statusPill: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 6 },
  statusText: { fontSize: 10, fontWeight: '800' },
});
