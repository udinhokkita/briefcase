import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, radius, spacing, shadow } from '../theme/colors';
import { Avatar } from './Avatar';
import { Player } from '../data/mockData';
import { gameById } from '../data/games';
import { useStore } from '../store/useStore';

export const PlayerCard: React.FC<{ player: Player; onPress: () => void }> = ({ player, onPress }) => {
  const lang = useStore((s) => s.lang);
  const main = player.games[0];
  const game = gameById(main.gameId);
  return (
    <TouchableOpacity style={styles.card} onPress={onPress} activeOpacity={0.85}>
      <Avatar initials={player.initials} color={player.avatarColor} verified={player.verified} size={52} />
      <View style={{ flex: 1, marginLeft: spacing.md }}>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
          <Text style={styles.name}>{player.name}</Text>
          {player.pro && (
            <View style={styles.proTag}>
              <Text style={styles.proText}>PRO</Text>
            </View>
          )}
        </View>
        <Text style={styles.meta}>
          @{player.username} · {player.state}
        </Text>
        <View style={styles.gameRow}>
          <View style={[styles.dot, { backgroundColor: game.color }]} />
          <Text style={[styles.gameMeta, { color: game.color }]}>
            {game.short} · {main.role} · {main.rank}
          </Text>
        </View>
      </View>
      <View style={styles.rankBox}>
        <Text style={styles.rankNum}>#{player.nationalRank}</Text>
        <Text style={styles.rankLbl}>{lang === 'ms' ? 'Negara' : 'Nat\'l'}</Text>
      </View>
      <Ionicons name="chevron-forward" size={18} color={colors.textFaint} style={{ marginLeft: 4 }} />
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.card,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.border,
    padding: spacing.lg,
    marginBottom: spacing.md,
    ...shadow.soft,
  },
  name: { color: colors.text, fontWeight: '700', fontSize: 15 },
  meta: { color: colors.textMuted, fontSize: 12, marginTop: 2 },
  gameRow: { flexDirection: 'row', alignItems: 'center', gap: 6, marginTop: 6 },
  dot: { width: 8, height: 8, borderRadius: 4 },
  gameMeta: { fontSize: 12, fontWeight: '600' },
  rankBox: { alignItems: 'center', paddingHorizontal: spacing.sm },
  rankNum: { color: colors.primary, fontWeight: '800', fontSize: 15 },
  rankLbl: { color: colors.textFaint, fontSize: 10 },
  proTag: { backgroundColor: colors.primary, borderRadius: 4, paddingHorizontal: 5, paddingVertical: 1 },
  proText: { color: colors.bg, fontWeight: '800', fontSize: 9 },
});
