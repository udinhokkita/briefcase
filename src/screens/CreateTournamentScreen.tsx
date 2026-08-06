import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors, radius, spacing } from '../theme/colors';
import { Button } from '../components/ui';
import { useStore, useT } from '../store/useStore';
import { GAMES, GameId } from '../data/games';
import { MY_STATES } from '../data/states';
import { Tournament } from '../data/mockData';
import { RootStackParamList } from '../navigation/types';
import { uid } from '../utils/uid';

const CAPACITIES = [8, 16, 32, 64, 128, 256];

export const CreateTournamentScreen: React.FC = () => {
  const t = useT();
  const lang = useStore((s) => s.lang);
  const nav = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const addTournament = useStore((s) => s.addTournament);

  const [name, setName] = useState('');
  const [game, setGame] = useState<GameId>('mlbb');
  const [format, setFormat] = useState('Single Elimination');
  const [capacity, setCapacity] = useState(16);
  const [entryFee, setEntryFee] = useState('20');
  const [prize, setPrize] = useState('3000');
  const [state, setState] = useState('Selangor');
  const [icVerify, setIcVerify] = useState(false);

  const formats = [
    { key: 'Single Elimination', label: t('format_single') },
    { key: 'Double Elimination', label: t('format_double') },
    { key: 'Round Robin', label: t('format_round') },
    { key: 'Swiss System', label: t('format_swiss') },
  ];

  const platformFee = Math.round((Number(prize) || 0) * 0.05 + 8);

  const handleCreate = () => {
    const newT: Tournament = {
      id: uid('ct'),
      name: name.trim() || (lang === 'ms' ? 'Kejohanan Baharu' : 'New Tournament'),
      gameId: game,
      format,
      capacity,
      registered: 0,
      entryFeeMYR: Number(entryFee) || 0,
      prizePoolMYR: Number(prize) || 0,
      state,
      status: 'upcoming',
      organizer: 'Hafiz Rahman',
      icVerify,
      matches: [],
    };
    addTournament(newT);
    nav.navigate('Payment', {
      title: lang === 'ms' ? 'Yuran platform kejohanan' : 'Tournament platform fee',
      amountMYR: platformFee,
      onDoneMessage: lang === 'ms' ? 'Kejohanan berjaya dicipta!' : 'Tournament created!',
    });
  };

  return (
    <SafeAreaView style={styles.screen} edges={['top']}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => nav.goBack()} style={styles.backBtn}>
          <Ionicons name="close" size={22} color={colors.text} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{t('create_tournament')}</Text>
        <View style={{ width: 38 }} />
      </View>

      <ScrollView contentContainerStyle={{ padding: spacing.lg, paddingBottom: 120 }} showsVerticalScrollIndicator={false}>
        <Label text={t('ct_name')} />
        <TextInput
          style={styles.input}
          placeholder={lang === 'ms' ? 'cth. Klang Valley MLBB Open' : 'e.g. Klang Valley MLBB Open'}
          placeholderTextColor={colors.textFaint}
          value={name}
          onChangeText={setName}
        />

        <Label text={t('ct_game')} />
        <ChipRow>
          {GAMES.map((g) => (
            <Chip key={g.id} label={g.short} color={g.color} active={game === g.id} onPress={() => setGame(g.id)} />
          ))}
        </ChipRow>

        <Label text={t('ct_format')} />
        <ChipRow>
          {formats.map((f) => (
            <Chip key={f.key} label={f.label} active={format === f.key} onPress={() => setFormat(f.key)} />
          ))}
        </ChipRow>

        <Label text={t('ct_capacity')} />
        <ChipRow>
          {CAPACITIES.map((c) => (
            <Chip key={c} label={`${c}`} active={capacity === c} onPress={() => setCapacity(c)} />
          ))}
        </ChipRow>

        <View style={{ flexDirection: 'row', gap: spacing.md }}>
          <View style={{ flex: 1 }}>
            <Label text={t('ct_entry_fee')} />
            <TextInput style={styles.input} keyboardType="numeric" value={entryFee} onChangeText={setEntryFee} placeholderTextColor={colors.textFaint} />
          </View>
          <View style={{ flex: 1 }}>
            <Label text={t('ct_prize')} />
            <TextInput style={styles.input} keyboardType="numeric" value={prize} onChangeText={setPrize} placeholderTextColor={colors.textFaint} />
          </View>
        </View>

        <Label text={t('ct_state')} />
        <ChipRow>
          {MY_STATES.map((s) => (
            <Chip key={s} label={s} active={state === s} onPress={() => setState(s)} />
          ))}
        </ChipRow>

        <TouchableOpacity style={styles.toggleRow} onPress={() => setIcVerify((v) => !v)} activeOpacity={0.7}>
          <Ionicons name="card-outline" size={18} color={colors.blue} />
          <Text style={styles.toggleLabel}>{t('ct_ic_verify')}</Text>
          <Ionicons
            name={icVerify ? 'toggle' : 'toggle-outline'}
            size={34}
            color={icVerify ? colors.primary : colors.textMuted}
            style={{ marginLeft: 'auto' }}
          />
        </TouchableOpacity>

        <View style={styles.feeNote}>
          <Text style={styles.feeNoteText}>
            {lang === 'ms' ? 'Yuran platform' : 'Platform fee'}: 5% + MYR 8 = <Text style={{ color: colors.primary, fontWeight: '800' }}>MYR {platformFee}</Text>
          </Text>
        </View>

        <Button title={t('ct_create_btn')} onPress={handleCreate} style={{ marginTop: spacing.lg }} />
      </ScrollView>
    </SafeAreaView>
  );
};

const Label: React.FC<{ text: string }> = ({ text }) => <Text style={styles.label}>{text}</Text>;
const ChipRow: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ paddingVertical: 4 }}>
    {children}
  </ScrollView>
);
const Chip: React.FC<{ label: string; active?: boolean; color?: string; onPress: () => void }> = ({ label, active, color, onPress }) => (
  <TouchableOpacity
    onPress={onPress}
    activeOpacity={0.7}
    style={[styles.chip, active && { backgroundColor: color ?? colors.primary, borderColor: color ?? colors.primary }]}
  >
    <Text style={[styles.chipText, active && { color: colors.bg, fontWeight: '800' }]}>{label}</Text>
  </TouchableOpacity>
);

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.bg },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: spacing.lg, paddingVertical: spacing.md, borderBottomWidth: 1, borderBottomColor: colors.border },
  backBtn: { width: 38, height: 38, borderRadius: 19, backgroundColor: colors.card, alignItems: 'center', justifyContent: 'center' },
  headerTitle: { color: colors.text, fontWeight: '800', fontSize: 17 },
  label: { color: colors.textMuted, fontSize: 13, fontWeight: '700', marginTop: spacing.lg, marginBottom: spacing.sm },
  input: { backgroundColor: colors.card, borderRadius: radius.md, borderWidth: 1, borderColor: colors.border, paddingHorizontal: spacing.md, paddingVertical: 12, color: colors.text, fontSize: 15 },
  chip: { paddingHorizontal: spacing.md, paddingVertical: 8, borderRadius: radius.pill, borderWidth: 1, borderColor: colors.border, backgroundColor: colors.cardAlt, marginRight: spacing.sm },
  chipText: { color: colors.textMuted, fontSize: 13, fontWeight: '600' },
  toggleRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm, backgroundColor: colors.card, borderRadius: radius.md, borderWidth: 1, borderColor: colors.border, padding: spacing.md, marginTop: spacing.lg },
  toggleLabel: { color: colors.text, fontSize: 14, fontWeight: '600', flex: 1 },
  feeNote: { backgroundColor: colors.cardAlt, borderRadius: radius.md, padding: spacing.md, marginTop: spacing.lg },
  feeNoteText: { color: colors.textMuted, fontSize: 13 },
});
