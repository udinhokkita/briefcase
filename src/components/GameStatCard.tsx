import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { colors, radius, spacing, shadow } from '../theme/colors';
import { gameById } from '../data/games';
import { PlayerGame } from '../data/mockData';
import { useStore } from '../store/useStore';

export const GameStatCard: React.FC<{ pg: PlayerGame }> = ({ pg }) => {
  const lang = useStore((s) => s.lang);
  const game = gameById(pg.gameId);
  return (
    <View style={[styles.card, { borderColor: game.color + '55' }]}>
      <View style={styles.header}>
        <View style={[styles.dot, { backgroundColor: game.color }]} />
        <Text style={styles.gameName}>{game.short}</Text>
        <View style={[styles.rankPill, { backgroundColor: game.color + '22' }]}>
          <Text style={[styles.rankText, { color: game.color }]}>{pg.rank}</Text>
        </View>
        <Text style={styles.role}>{pg.role}</Text>
        <View style={styles.apiBadge}>
          <View style={styles.apiDot} />
          <Text style={styles.apiText}>{lang === 'ms' ? 'Auto-pull' : 'Auto-pull'}</Text>
        </View>
      </View>
      <View style={styles.statGrid}>
        {game.statLabels.map((s) => (
          <View key={s.key} style={styles.statBox}>
            <Text style={styles.statValue}>
              {String(pg.stats[s.key] ?? '—')}
              {s.suffix ?? ''}
            </Text>
            <Text style={styles.statLabel}>{lang === 'ms' ? s.ms : s.en}</Text>
          </View>
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.card,
    borderRadius: radius.lg,
    borderWidth: 1,
    padding: spacing.lg,
    marginBottom: spacing.md,
    ...shadow.soft,
  },
  header: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm, marginBottom: spacing.md, flexWrap: 'wrap' },
  dot: { width: 10, height: 10, borderRadius: 5 },
  gameName: { color: colors.text, fontWeight: '800', fontSize: 15 },
  rankPill: { paddingHorizontal: 8, paddingVertical: 2, borderRadius: 6 },
  rankText: { fontSize: 11, fontWeight: '800' },
  role: { color: colors.textMuted, fontSize: 12 },
  apiBadge: { flexDirection: 'row', alignItems: 'center', gap: 4, marginLeft: 'auto' },
  apiDot: { width: 6, height: 6, borderRadius: 3, backgroundColor: colors.green },
  apiText: { color: colors.green, fontSize: 10, fontWeight: '700' },
  statGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.sm },
  statBox: {
    width: '47%',
    backgroundColor: colors.cardAlt,
    borderRadius: radius.sm,
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
  },
  statValue: { color: colors.text, fontWeight: '800', fontSize: 18 },
  statLabel: { color: colors.textMuted, fontSize: 11, marginTop: 2 },
});
