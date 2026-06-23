import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { colors, radius, spacing } from '../theme/colors';
import { Screen, Card, H2, Body, Button, Divider } from '../components/ui';
import { Avatar } from '../components/Avatar';
import { RadarChart } from '../components/RadarChart';
import { GameStatCard } from '../components/GameStatCard';
import { useStore, useT } from '../store/useStore';
import { RootStackParamList } from '../navigation/types';

export const ProfileScreen: React.FC = () => {
  const t = useT();
  const lang = useStore((s) => s.lang);
  const user = useStore((s) => s.user);
  const upgradeToPro = useStore((s) => s.upgradeToPro);
  const showToast = useStore((s) => s.showToast);
  const nav = useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  const radarLabels = [
    t('axis_mechanical'),
    t('axis_consistency'),
    t('axis_teamplay'),
    t('axis_clutch'),
    t('axis_gamesense'),
    t('axis_adapt'),
  ];

  const clipLimit = user.pro ? 10 : 5;

  return (
    <Screen>
      <View style={styles.headerRow}>
        <Text style={styles.handle}>briefcase.gg/{user.username}</Text>
        <TouchableOpacity onPress={() => nav.navigate('Settings')}>
          <Ionicons name="settings-outline" size={22} color={colors.textMuted} />
        </TouchableOpacity>
      </View>

      <Card>
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <Avatar initials={user.initials} color={user.avatarColor} verified={user.verified} size={72} />
          <View style={{ flex: 1, marginLeft: spacing.lg }}>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
              <Text style={styles.name}>{user.name}</Text>
              {user.verified && <Ionicons name="checkmark-circle" size={18} color={colors.blue} />}
            </View>
            <Text style={styles.meta}>@{user.username}</Text>
            <View style={styles.stateRow}>
              <Ionicons name="location" size={13} color={colors.primary} />
              <Text style={styles.state}>{user.state}</Text>
            </View>
          </View>
        </View>

        <Body muted style={{ marginTop: spacing.md }}>
          {user.bio[lang]}
        </Body>

        <View style={styles.socials}>
          {user.socials.tiktok && <Social icon="logo-tiktok" label={user.socials.tiktok} />}
          {user.socials.youtube && <Social icon="logo-youtube" label={user.socials.youtube} />}
          {user.socials.discord && <Social icon="logo-discord" label={user.socials.discord} />}
        </View>

        <View style={{ flexDirection: 'row', gap: spacing.sm, marginTop: spacing.lg }}>
          <Button
            title={t('share_whatsapp')}
            variant="success"
            onPress={() => showToast(t('toast_whatsapp'))}
            style={{ flex: 1 }}
            icon={<Ionicons name="logo-whatsapp" size={18} color={colors.bg} />}
          />
          <Button
            title={t('share_link')}
            variant="outline"
            onPress={() => showToast(t('toast_link_copied'))}
            icon={<Ionicons name="link" size={16} color={colors.primary} />}
          />
        </View>
      </Card>

      <View style={styles.statRow}>
        <StatBox value={`#${user.nationalRank}`} label={t('national_ranking')} />
        <StatBox value={`${user.percentile}%`} label={t('percentile')} />
        <StatBox value={`${user.endorsements}`} label={t('endorsements')} />
      </View>

      {!user.pro && (
        <TouchableOpacity activeOpacity={0.9} onPress={upgradeToPro}>
          <Card style={styles.proCard}>
            <Ionicons name="rocket" size={24} color={colors.bg} />
            <View style={{ flex: 1, marginLeft: spacing.md }}>
              <Text style={styles.proTitle}>{t('upgrade_pro')}</Text>
              <Text style={styles.proSub}>{t('pro_blurb')}</Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color={colors.bg} />
          </Card>
        </TouchableOpacity>
      )}

      <H2 style={styles.section}>{t('performance_radar')}</H2>
      <Card style={{ alignItems: 'center' }}>
        <RadarChart scores={user.radar} labels={radarLabels} color={colors.primary} />
      </Card>

      <H2 style={styles.section}>{t('game_stats')}</H2>
      {user.games.map((pg) => (
        <GameStatCard key={pg.gameId} pg={pg} />
      ))}

      <View style={styles.sectionRow}>
        <H2>{t('highlight_reel')}</H2>
        {!user.pro && <Text style={styles.limit}>{t('clips_free_limit')}</Text>}
      </View>
      {user.clips.slice(0, clipLimit).map((c) => (
        <View key={c.id} style={styles.clip}>
          <View style={styles.clipThumb}>
            <Ionicons name="play" size={18} color={colors.bg} />
          </View>
          <Text style={styles.clipTitle} numberOfLines={1}>
            {c.title}
          </Text>
          <Text style={styles.clipDur}>
            {Math.floor(c.durationSec / 60)}:{String(c.durationSec % 60).padStart(2, '0')}
          </Text>
        </View>
      ))}

      <H2 style={styles.section}>{t('tournament_history')}</H2>
      <Card>
        {user.tournamentHistory.map((th, i) => (
          <View key={th.id}>
            <View style={styles.historyRow}>
              <Ionicons name="trophy" size={16} color={colors.primary} />
              <View style={{ flex: 1, marginLeft: spacing.md }}>
                <Text style={styles.histName}>{th.name}</Text>
                <Text style={styles.histYear}>{th.year}</Text>
              </View>
              <View style={styles.placePill}>
                <Text style={styles.placeText}>{th.placement}</Text>
              </View>
            </View>
            {i < user.tournamentHistory.length - 1 && <Divider />}
          </View>
        ))}
      </Card>

      <Button
        title={t('download_report')}
        variant="outline"
        onPress={() => showToast(lang === 'ms' ? 'Menjana Laporan Prestasi PDF...' : 'Generating PDF Performance Report...')}
        icon={<Ionicons name="download-outline" size={18} color={colors.primary} />}
        style={{ marginTop: spacing.sm }}
      />
    </Screen>
  );
};

const Social: React.FC<{ icon: keyof typeof Ionicons.glyphMap; label: string }> = ({ icon, label }) => (
  <View style={styles.social}>
    <Ionicons name={icon} size={14} color={colors.textMuted} />
    <Text style={styles.socialText}>{label}</Text>
  </View>
);

const StatBox: React.FC<{ value: string; label: string }> = ({ value, label }) => (
  <View style={styles.statBox}>
    <Text style={styles.statValue}>{value}</Text>
    <Text style={styles.statLabel}>{label}</Text>
  </View>
);

const styles = StyleSheet.create({
  headerRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: spacing.md },
  handle: { color: colors.primary, fontWeight: '700', fontSize: 13 },
  name: { color: colors.text, fontWeight: '800', fontSize: 19 },
  meta: { color: colors.textMuted, fontSize: 13, marginTop: 2 },
  stateRow: { flexDirection: 'row', alignItems: 'center', gap: 4, marginTop: 6 },
  state: { color: colors.text, fontSize: 13, fontWeight: '600' },
  socials: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.sm, marginTop: spacing.md },
  social: { flexDirection: 'row', alignItems: 'center', gap: 4, backgroundColor: colors.cardAlt, paddingHorizontal: 10, paddingVertical: 5, borderRadius: radius.sm },
  socialText: { color: colors.textMuted, fontSize: 12 },
  statRow: { flexDirection: 'row', gap: spacing.md, marginBottom: spacing.md },
  statBox: { flex: 1, backgroundColor: colors.card, borderRadius: radius.md, borderWidth: 1, borderColor: colors.border, paddingVertical: spacing.md, alignItems: 'center' },
  statValue: { color: colors.primary, fontWeight: '900', fontSize: 20 },
  statLabel: { color: colors.textMuted, fontSize: 11, marginTop: 2, textAlign: 'center' },
  proCard: { flexDirection: 'row', alignItems: 'center', backgroundColor: colors.primary, borderColor: colors.primary },
  proTitle: { color: colors.bg, fontWeight: '800', fontSize: 15 },
  proSub: { color: colors.bg, opacity: 0.8, fontSize: 12, marginTop: 2 },
  section: { marginTop: spacing.sm, marginBottom: spacing.md },
  sectionRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: spacing.sm, marginBottom: spacing.md },
  limit: { color: colors.textFaint, fontSize: 12 },
  clip: { flexDirection: 'row', alignItems: 'center', backgroundColor: colors.card, borderRadius: radius.md, borderWidth: 1, borderColor: colors.border, padding: spacing.sm, marginBottom: spacing.sm },
  clipThumb: { width: 40, height: 40, borderRadius: 8, backgroundColor: colors.primary, alignItems: 'center', justifyContent: 'center', marginRight: spacing.md },
  clipTitle: { color: colors.text, flex: 1, fontSize: 13, fontWeight: '600' },
  clipDur: { color: colors.textMuted, fontSize: 12, marginLeft: spacing.sm },
  historyRow: { flexDirection: 'row', alignItems: 'center' },
  histName: { color: colors.text, fontWeight: '700', fontSize: 14 },
  histYear: { color: colors.textMuted, fontSize: 12, marginTop: 2 },
  placePill: { backgroundColor: colors.primary + '22', borderRadius: 6, paddingHorizontal: 10, paddingVertical: 4 },
  placeText: { color: colors.primary, fontWeight: '800', fontSize: 12 },
});
