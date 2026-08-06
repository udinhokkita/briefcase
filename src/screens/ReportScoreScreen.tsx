import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors, radius, spacing } from '../theme/colors';
import { Button } from '../components/ui';
import { useStore, useT } from '../store/useStore';
import { RootStackParamList } from '../navigation/types';

export const ReportScoreScreen: React.FC = () => {
  const t = useT();
  const lang = useStore((s) => s.lang);
  const nav = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const route = useRoute<RouteProp<RootStackParamList, 'ReportScore'>>();
  const tournaments = useStore((s) => s.tournaments);
  const reportScore = useStore((s) => s.reportScore);
  const showToast = useStore((s) => s.showToast);
  const tr = tournaments.find((x) => x.id === route.params.tournamentId)!;
  const match = tr.matches.find((m) => m.id === route.params.matchId)!;

  const [scoreA, setScoreA] = useState(0);
  const [scoreB, setScoreB] = useState(0);
  const [screenshot, setScreenshot] = useState(false);

  const canSubmit = screenshot && scoreA !== scoreB;
  const winner = scoreA > scoreB ? match.teamA : scoreB > scoreA ? match.teamB : '—';

  const handleSubmit = () => {
    reportScore(tr.id, match.id, scoreA, scoreB);
    showToast(t('awaiting_confirm'));
    nav.goBack();
  };

  return (
    <SafeAreaView style={styles.screen} edges={['top']}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => nav.goBack()} style={styles.backBtn}>
          <Ionicons name="close" size={22} color={colors.text} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{t('report_score')}</Text>
        <View style={{ width: 38 }} />
      </View>

      <ScrollView contentContainerStyle={{ padding: spacing.lg }} showsVerticalScrollIndicator={false}>
        <Text style={styles.tName}>{tr.name}</Text>
        <Text style={styles.tTime}>{match.time}</Text>

        <TeamScore name={match.teamA} score={scoreA} onChange={setScoreA} />
        <Text style={styles.vs}>VS</Text>
        <TeamScore name={match.teamB} score={scoreB} onChange={setScoreB} />

        <View style={styles.winnerBox}>
          <Text style={styles.winnerLabel}>{t('match_winner')}</Text>
          <Text style={styles.winnerName}>{winner}</Text>
        </View>

        <TouchableOpacity style={[styles.upload, screenshot && styles.uploadDone]} onPress={() => setScreenshot(true)} activeOpacity={0.8}>
          <Ionicons name={screenshot ? 'checkmark-circle' : 'cloud-upload-outline'} size={22} color={screenshot ? colors.green : colors.primary} />
          <Text style={[styles.uploadText, screenshot && { color: colors.green }]}>
            {screenshot ? t('screenshot_added') : t('upload_screenshot')}
          </Text>
        </TouchableOpacity>

        <View style={styles.note}>
          <Ionicons name="information-circle-outline" size={16} color={colors.textMuted} />
          <Text style={styles.noteText}>{t('dual_confirm_note')}</Text>
        </View>

        <Button title={t('submit_score')} onPress={handleSubmit} disabled={!canSubmit} style={{ marginTop: spacing.lg }} />
        {!canSubmit && (
          <Text style={styles.hint}>
            {lang === 'ms' ? 'Muat naik tangkap layar & pastikan skor tidak seri.' : 'Upload a screenshot & ensure the score is not a tie.'}
          </Text>
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

const TeamScore: React.FC<{ name: string; score: number; onChange: (n: number) => void }> = ({ name, score, onChange }) => (
  <View style={styles.teamCard}>
    <Text style={styles.teamName}>{name}</Text>
    <View style={styles.stepper}>
      <TouchableOpacity style={styles.stepBtn} onPress={() => onChange(Math.max(0, score - 1))}>
        <Ionicons name="remove" size={22} color={colors.text} />
      </TouchableOpacity>
      <Text style={styles.score}>{score}</Text>
      <TouchableOpacity style={styles.stepBtn} onPress={() => onChange(score + 1)}>
        <Ionicons name="add" size={22} color={colors.text} />
      </TouchableOpacity>
    </View>
  </View>
);

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.bg },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: spacing.lg, paddingVertical: spacing.md, borderBottomWidth: 1, borderBottomColor: colors.border },
  backBtn: { width: 38, height: 38, borderRadius: 19, backgroundColor: colors.card, alignItems: 'center', justifyContent: 'center' },
  headerTitle: { color: colors.text, fontWeight: '800', fontSize: 17 },
  tName: { color: colors.text, fontWeight: '800', fontSize: 18 },
  tTime: { color: colors.textMuted, fontSize: 13, marginTop: 2, marginBottom: spacing.lg },
  teamCard: { backgroundColor: colors.card, borderRadius: radius.lg, borderWidth: 1, borderColor: colors.border, padding: spacing.lg, alignItems: 'center' },
  teamName: { color: colors.text, fontWeight: '700', fontSize: 16, marginBottom: spacing.md },
  stepper: { flexDirection: 'row', alignItems: 'center', gap: spacing.xl },
  stepBtn: { width: 44, height: 44, borderRadius: 22, backgroundColor: colors.cardAlt, alignItems: 'center', justifyContent: 'center' },
  score: { color: colors.primary, fontWeight: '900', fontSize: 36, minWidth: 50, textAlign: 'center' },
  vs: { color: colors.textMuted, fontWeight: '800', textAlign: 'center', marginVertical: spacing.md },
  winnerBox: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', backgroundColor: colors.primary + '1A', borderRadius: radius.md, padding: spacing.md, marginTop: spacing.lg },
  winnerLabel: { color: colors.textMuted, fontSize: 13, fontWeight: '600' },
  winnerName: { color: colors.primary, fontWeight: '800', fontSize: 16 },
  upload: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: spacing.sm, backgroundColor: colors.card, borderRadius: radius.md, borderWidth: 1, borderColor: colors.border, borderStyle: 'dashed', padding: spacing.lg, marginTop: spacing.lg },
  uploadDone: { borderColor: colors.green, borderStyle: 'solid' },
  uploadText: { color: colors.primary, fontWeight: '700', fontSize: 14 },
  note: { flexDirection: 'row', alignItems: 'center', gap: 6, marginTop: spacing.md },
  noteText: { color: colors.textMuted, fontSize: 12, flex: 1 },
  hint: { color: colors.textFaint, fontSize: 12, textAlign: 'center', marginTop: spacing.sm },
});
