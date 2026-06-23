import React, { useMemo, useState } from 'react';
import { View, Text, StyleSheet, TextInput, ScrollView, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { colors, radius, spacing } from '../theme/colors';
import { Screen, Body } from '../components/ui';
import { TopBar } from '../components/TopBar';
import { PlayerCard } from '../components/PlayerCard';
import { useT } from '../store/useStore';
import { PLAYERS } from '../data/mockData';
import { GAMES, GameId } from '../data/games';
import { MY_STATES } from '../data/states';
import { RootStackParamList } from '../navigation/types';

export const DiscoverScreen: React.FC = () => {
  const t = useT();
  const nav = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const [query, setQuery] = useState('');
  const [game, setGame] = useState<GameId | null>(null);
  const [role, setRole] = useState<string | null>(null);
  const [state, setState] = useState<string | null>(null);

  const roleOptions = useMemo(() => (game ? GAMES.find((g) => g.id === game)!.roles : []), [game]);

  const results = useMemo(
    () =>
      PLAYERS.filter((p) => {
        if (query && !(`${p.name} ${p.username}`.toLowerCase().includes(query.toLowerCase()))) return false;
        if (game && !p.games.some((g) => g.gameId === game)) return false;
        if (role && !p.games.some((g) => g.role === role)) return false;
        if (state && p.state !== state) return false;
        return true;
      }),
    [query, game, role, state],
  );

  const hasFilters = game || role || state || query;

  return (
    <Screen scroll={false}>
      <View style={{ paddingHorizontal: spacing.lg, paddingTop: spacing.lg }}>
        <TopBar title={t('discover_title')} />
        <View style={styles.searchBox}>
          <Ionicons name="search" size={18} color={colors.textMuted} />
          <TextInput
            style={styles.searchInput}
            placeholder={t('search_placeholder')}
            placeholderTextColor={colors.textFaint}
            value={query}
            onChangeText={setQuery}
          />
        </View>
      </View>

      <ScrollView contentContainerStyle={{ paddingHorizontal: spacing.lg, paddingBottom: 140 }} showsVerticalScrollIndicator={false}>
        <FilterRow label={t('filter_game')}>
          <Chip label={t('filter_all')} active={!game} onPress={() => { setGame(null); setRole(null); }} />
          {GAMES.map((g) => (
            <Chip key={g.id} label={g.short} color={g.color} active={game === g.id} onPress={() => { setGame(g.id); setRole(null); }} />
          ))}
        </FilterRow>

        {roleOptions.length > 0 && (
          <FilterRow label={t('filter_role')}>
            <Chip label={t('filter_all')} active={!role} onPress={() => setRole(null)} />
            {roleOptions.map((r) => (
              <Chip key={r} label={r} active={role === r} onPress={() => setRole(r)} />
            ))}
          </FilterRow>
        )}

        <FilterRow label={t('filter_state')}>
          <Chip label={t('filter_all')} active={!state} onPress={() => setState(null)} />
          {MY_STATES.map((s) => (
            <Chip key={s} label={s} active={state === s} onPress={() => setState(s)} />
          ))}
        </FilterRow>

        <View style={styles.resultHeader}>
          <Body muted>
            {results.length} {t('results_count')}
          </Body>
          {hasFilters ? (
            <TouchableOpacity onPress={() => { setGame(null); setRole(null); setState(null); setQuery(''); }}>
              <Text style={styles.clear}>{t('clear_filters')}</Text>
            </TouchableOpacity>
          ) : null}
        </View>

        {results.map((p) => (
          <PlayerCard key={p.id} player={p} onPress={() => nav.navigate('PlayerDetail', { playerId: p.id })} />
        ))}
        {results.length === 0 && (
          <View style={styles.empty}>
            <Ionicons name="sad-outline" size={36} color={colors.textFaint} />
            <Body muted style={{ marginTop: spacing.sm }}>—</Body>
          </View>
        )}
      </ScrollView>
    </Screen>
  );
};

const FilterRow: React.FC<{ label: string; children: React.ReactNode }> = ({ label, children }) => (
  <View style={{ marginTop: spacing.md }}>
    <Text style={styles.filterLabel}>{label}</Text>
    <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ paddingVertical: 6 }}>
      {children}
    </ScrollView>
  </View>
);

const Chip: React.FC<{ label: string; active?: boolean; color?: string; onPress: () => void }> = ({
  label,
  active,
  color,
  onPress,
}) => (
  <TouchableOpacity
    onPress={onPress}
    activeOpacity={0.7}
    style={[styles.chip, active && { backgroundColor: color ?? colors.primary, borderColor: color ?? colors.primary }]}
  >
    <Text style={[styles.chipText, active && { color: colors.bg, fontWeight: '800' }]}>{label}</Text>
  </TouchableOpacity>
);

const styles = StyleSheet.create({
  searchBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    backgroundColor: colors.card,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.border,
    paddingHorizontal: spacing.md,
    paddingVertical: 10,
  },
  searchInput: { flex: 1, color: colors.text, fontSize: 14, paddingVertical: 2 },
  filterLabel: { color: colors.textMuted, fontSize: 12, fontWeight: '700', textTransform: 'uppercase', letterSpacing: 0.5 },
  chip: {
    paddingHorizontal: spacing.md,
    paddingVertical: 7,
    borderRadius: radius.pill,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.cardAlt,
    marginRight: spacing.sm,
  },
  chipText: { color: colors.textMuted, fontSize: 13, fontWeight: '600' },
  resultHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: spacing.lg, marginBottom: spacing.md },
  clear: { color: colors.primary, fontWeight: '700', fontSize: 13 },
  empty: { alignItems: 'center', paddingVertical: spacing.xxl },
});
