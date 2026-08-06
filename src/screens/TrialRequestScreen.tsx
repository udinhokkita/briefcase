import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors, radius, spacing } from '../theme/colors';
import { Button } from '../components/ui';
import { Avatar } from '../components/Avatar';
import { useStore, useT } from '../store/useStore';
import { PLAYERS } from '../data/mockData';
import { gameById } from '../data/games';
import { TRIAL_DURATIONS } from '../data/states';
import { RootStackParamList } from '../navigation/types';
import { uid } from '../utils/uid';

export const TrialRequestScreen: React.FC = () => {
  const t = useT();
  const lang = useStore((s) => s.lang);
  const nav = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const route = useRoute<RouteProp<RootStackParamList, 'TrialRequest'>>();
  const sendTrialOffer = useStore((s) => s.sendTrialOffer);
  const showToast = useStore((s) => s.showToast);
  const player = PLAYERS.find((p) => p.id === route.params.playerId) ?? PLAYERS[0];
  const main = player.games[0];
  const game = gameById(main.gameId);

  const [duration, setDuration] = useState(14);
  const [stipend, setStipend] = useState('800');
  const [role, setRole] = useState(main.role);
  const [location, setLocation] = useState<'online' | 'bootcamp' | 'state'>('bootcamp');

  const locLabels: Record<typeof location, string> = {
    online: t('loc_online'),
    bootcamp: t('loc_bootcamp'),
    state: t('loc_state'),
  };

  const handleSend = () => {
    sendTrialOffer({
      id: uid('trial'),
      playerId: player.id,
      playerName: player.name,
      durationDays: duration,
      stipendMYR: Number(stipend) || 0,
      gameId: main.gameId,
      role,
      location: locLabels[location],
    });
    showToast(t('offer_sent'));
    nav.goBack();
  };

  return (
    <SafeAreaView style={styles.screen} edges={['top']}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => nav.goBack()} style={styles.backBtn}>
          <Ionicons name="close" size={22} color={colors.text} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{t('trial_request')}</Text>
        <View style={{ width: 38 }} />
      </View>

      <ScrollView contentContainerStyle={{ padding: spacing.lg, paddingBottom: 120 }} showsVerticalScrollIndicator={false}>
        <View style={styles.playerCard}>
          <Avatar initials={player.initials} color={player.avatarColor} verified={player.verified} size={52} />
          <View style={{ flex: 1, marginLeft: spacing.md }}>
            <Text style={styles.name}>{player.name}</Text>
            <Text style={styles.meta}>
              {game.short} · {main.role} · {player.state}
            </Text>
          </View>
        </View>

        <Label text={t('trial_duration')} />
        <View style={styles.row}>
          {TRIAL_DURATIONS.map((d) => (
            <Chip key={d} label={`${d} ${t('days')}`} active={duration === d} onPress={() => setDuration(d)} flex />
          ))}
        </View>

        <Label text={t('trial_stipend')} />
        <TextInput style={styles.input} keyboardType="numeric" value={stipend} onChangeText={setStipend} placeholderTextColor={colors.textFaint} />

        <Label text={t('trial_role')} />
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ paddingVertical: 4 }}>
          {game.roles.map((r) => (
            <Chip key={r} label={r} active={role === r} onPress={() => setRole(r)} />
          ))}
        </ScrollView>

        <Label text={t('trial_location')} />
        <View style={{ gap: spacing.sm }}>
          {(['bootcamp', 'online', 'state'] as const).map((l) => (
            <TouchableOpacity key={l} style={[styles.locRow, location === l && styles.locActive]} onPress={() => setLocation(l)} activeOpacity={0.8}>
              <Ionicons
                name={location === l ? 'radio-button-on' : 'radio-button-off'}
                size={20}
                color={location === l ? colors.primary : colors.textMuted}
              />
              <Text style={styles.locText}>{locLabels[l]}</Text>
            </TouchableOpacity>
          ))}
        </View>

        <View style={styles.summary}>
          <Ionicons name="briefcase" size={16} color={colors.primary} />
          <Text style={styles.summaryText}>
            {lang === 'ms'
              ? `Trial ${duration} hari • MYR ${stipend}/bulan • ${role}`
              : `${duration}-day trial • MYR ${stipend}/mo • ${role}`}
          </Text>
        </View>

        <Button title={t('send_offer')} onPress={handleSend} style={{ marginTop: spacing.lg }} icon={<Ionicons name="send" size={16} color={colors.bg} />} />
      </ScrollView>
    </SafeAreaView>
  );
};

const Label: React.FC<{ text: string }> = ({ text }) => <Text style={styles.label}>{text}</Text>;
const Chip: React.FC<{ label: string; active?: boolean; onPress: () => void; flex?: boolean }> = ({ label, active, onPress, flex }) => (
  <TouchableOpacity
    onPress={onPress}
    activeOpacity={0.7}
    style={[styles.chip, flex && { flex: 1 }, active && { backgroundColor: colors.primary, borderColor: colors.primary }]}
  >
    <Text style={[styles.chipText, active && { color: colors.bg, fontWeight: '800' }]}>{label}</Text>
  </TouchableOpacity>
);

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.bg },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: spacing.lg, paddingVertical: spacing.md, borderBottomWidth: 1, borderBottomColor: colors.border },
  backBtn: { width: 38, height: 38, borderRadius: 19, backgroundColor: colors.card, alignItems: 'center', justifyContent: 'center' },
  headerTitle: { color: colors.text, fontWeight: '800', fontSize: 17 },
  playerCard: { flexDirection: 'row', alignItems: 'center', backgroundColor: colors.card, borderRadius: radius.lg, borderWidth: 1, borderColor: colors.border, padding: spacing.md },
  name: { color: colors.text, fontWeight: '800', fontSize: 16 },
  meta: { color: colors.textMuted, fontSize: 12, marginTop: 2 },
  label: { color: colors.textMuted, fontSize: 13, fontWeight: '700', marginTop: spacing.lg, marginBottom: spacing.sm },
  row: { flexDirection: 'row', gap: spacing.sm },
  input: { backgroundColor: colors.card, borderRadius: radius.md, borderWidth: 1, borderColor: colors.border, paddingHorizontal: spacing.md, paddingVertical: 12, color: colors.text, fontSize: 15 },
  chip: { paddingHorizontal: spacing.md, paddingVertical: 10, borderRadius: radius.md, borderWidth: 1, borderColor: colors.border, backgroundColor: colors.cardAlt, marginRight: spacing.sm, alignItems: 'center' },
  chipText: { color: colors.textMuted, fontSize: 13, fontWeight: '600' },
  locRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.md, backgroundColor: colors.card, borderRadius: radius.md, borderWidth: 1, borderColor: colors.border, padding: spacing.md },
  locActive: { borderColor: colors.primary },
  locText: { color: colors.text, fontSize: 14, fontWeight: '600' },
  summary: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm, backgroundColor: colors.primary + '1A', borderRadius: radius.md, padding: spacing.md, marginTop: spacing.lg },
  summaryText: { color: colors.text, fontSize: 13, fontWeight: '600', flex: 1 },
});
