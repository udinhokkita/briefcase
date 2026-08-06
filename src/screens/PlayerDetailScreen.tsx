import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { colors, radius, spacing } from '../theme/colors';
import { Screen, Card, H2, Body, Button } from '../components/ui';
import { Avatar } from '../components/Avatar';
import { RadarChart } from '../components/RadarChart';
import { GameStatCard } from '../components/GameStatCard';
import { LangToggle } from '../components/TopBar';
import { useStore, useT } from '../store/useStore';
import { PLAYERS } from '../data/mockData';
import { RootStackParamList } from '../navigation/types';

export const PlayerDetailScreen: React.FC = () => {
  const t = useT();
  const lang = useStore((s) => s.lang);
  const showToast = useStore((s) => s.showToast);
  const nav = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const route = useRoute<RouteProp<RootStackParamList, 'PlayerDetail'>>();
  const player = PLAYERS.find((p) => p.id === route.params.playerId) ?? PLAYERS[0];

  const radarLabels = [
    t('axis_mechanical'),
    t('axis_consistency'),
    t('axis_teamplay'),
    t('axis_clutch'),
    t('axis_gamesense'),
    t('axis_adapt'),
  ];

  return (
    <Screen>
      <View style={styles.topRow}>
        <TouchableOpacity onPress={() => nav.goBack()} style={styles.backBtn}>
          <Ionicons name="chevron-back" size={22} color={colors.text} />
        </TouchableOpacity>
        <LangToggle />
      </View>

      <Card>
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <Avatar initials={player.initials} color={player.avatarColor} verified={player.verified} size={72} />
          <View style={{ flex: 1, marginLeft: spacing.lg }}>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6, flexWrap: 'wrap' }}>
              <Text style={styles.name}>{player.name}</Text>
              {player.pro && (
                <View style={styles.proTag}>
                  <Text style={styles.proText}>PRO</Text>
                </View>
              )}
            </View>
            <Text style={styles.meta}>@{player.username}</Text>
            <View style={styles.stateRow}>
              <Ionicons name="location" size={13} color={colors.primary} />
              <Text style={styles.state}>{player.state}</Text>
              {player.verified && (
                <View style={styles.verifiedChip}>
                  <Ionicons name="shield-checkmark" size={11} color={colors.blue} />
                  <Text style={styles.verifiedText}>{t('verified')}</Text>
                </View>
              )}
            </View>
          </View>
        </View>
        <Body muted style={{ marginTop: spacing.md }}>
          {player.bio[lang]}
        </Body>
        <View style={styles.langRow}>
          {player.langs.map((l) => (
            <View key={l} style={styles.langChip}>
              <Text style={styles.langChipText}>{l}</Text>
            </View>
          ))}
        </View>
      </Card>

      <View style={styles.statRow}>
        <StatBox value={`#${player.nationalRank}`} label={t('national_ranking')} />
        <StatBox value={`${player.percentile}%`} label={t('percentile')} />
        <StatBox value={`${player.endorsements}`} label={t('endorsements')} />
      </View>

      <H2 style={styles.section}>{t('performance_radar')}</H2>
      <Card style={{ alignItems: 'center' }}>
        <RadarChart scores={player.radar} labels={radarLabels} color={player.avatarColor} />
      </Card>

      <H2 style={styles.section}>{t('game_stats')}</H2>
      {player.games.map((pg) => (
        <GameStatCard key={pg.gameId} pg={pg} />
      ))}

      <View style={{ flexDirection: 'row', gap: spacing.sm, marginTop: spacing.sm }}>
        <Button
          title={t('compare')}
          variant="outline"
          onPress={() => showToast(lang === 'ms' ? 'Ditambah ke perbandingan' : 'Added to compare')}
          icon={<Ionicons name="git-compare" size={16} color={colors.primary} />}
          style={{ flex: 1 }}
        />
        <Button
          title={t('send_trial')}
          onPress={() => nav.navigate('TrialRequest', { playerId: player.id })}
          icon={<Ionicons name="briefcase" size={16} color={colors.bg} />}
          style={{ flex: 1.4 }}
        />
      </View>
    </Screen>
  );
};

const StatBox: React.FC<{ value: string; label: string }> = ({ value, label }) => (
  <View style={styles.statBox}>
    <Text style={styles.statValue}>{value}</Text>
    <Text style={styles.statLabel}>{label}</Text>
  </View>
);

const styles = StyleSheet.create({
  topRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: spacing.md },
  backBtn: { width: 38, height: 38, borderRadius: 19, backgroundColor: colors.card, borderWidth: 1, borderColor: colors.border, alignItems: 'center', justifyContent: 'center' },
  name: { color: colors.text, fontWeight: '800', fontSize: 19 },
  meta: { color: colors.textMuted, fontSize: 13, marginTop: 2 },
  stateRow: { flexDirection: 'row', alignItems: 'center', gap: 4, marginTop: 6, flexWrap: 'wrap' },
  state: { color: colors.text, fontSize: 13, fontWeight: '600' },
  verifiedChip: { flexDirection: 'row', alignItems: 'center', gap: 3, backgroundColor: colors.blue + '22', paddingHorizontal: 8, paddingVertical: 2, borderRadius: 6, marginLeft: 4 },
  verifiedText: { color: colors.blue, fontSize: 10, fontWeight: '700' },
  proTag: { backgroundColor: colors.primary, borderRadius: 4, paddingHorizontal: 6, paddingVertical: 1 },
  proText: { color: colors.bg, fontWeight: '800', fontSize: 10 },
  langRow: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.sm, marginTop: spacing.md },
  langChip: { backgroundColor: colors.cardAlt, paddingHorizontal: 10, paddingVertical: 4, borderRadius: radius.sm },
  langChipText: { color: colors.textMuted, fontSize: 11, fontWeight: '600' },
  statRow: { flexDirection: 'row', gap: spacing.md, marginTop: spacing.md, marginBottom: spacing.md },
  statBox: { flex: 1, backgroundColor: colors.card, borderRadius: radius.md, borderWidth: 1, borderColor: colors.border, paddingVertical: spacing.md, alignItems: 'center' },
  statValue: { color: colors.primary, fontWeight: '900', fontSize: 20 },
  statLabel: { color: colors.textMuted, fontSize: 11, marginTop: 2, textAlign: 'center' },
  section: { marginTop: spacing.sm, marginBottom: spacing.md },
});
