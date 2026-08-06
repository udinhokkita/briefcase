import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { colors, radius, spacing, gradients, shadow } from '../theme/colors';
import { Screen, Card, H2, Body } from '../components/ui';
import { TopBar } from '../components/TopBar';
import { useStore, useT } from '../store/useStore';
import { FEED, PLAYERS, FeedItem } from '../data/mockData';
import { RootStackParamList } from '../navigation/types';

const TYPE_ICON: Record<FeedItem['type'], keyof typeof Ionicons.glyphMap> = {
  result: 'trophy',
  transfer: 'swap-horizontal',
  highlight: 'flame',
  announcement: 'megaphone',
};
const TYPE_COLOR: Record<FeedItem['type'], string> = {
  result: colors.primary,
  transfer: colors.blue,
  highlight: colors.accent,
  announcement: colors.green,
};

export const HomeScreen: React.FC = () => {
  const t = useT();
  const lang = useStore((s) => s.lang);
  const user = useStore((s) => s.user);
  const nav = useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  return (
    <Screen>
      <TopBar brand subtitle={`${t('home_greeting')}, ${user.name.split(' ')[0]} 👋`} title={t('tab_home')} />

      <TouchableOpacity activeOpacity={0.9} onPress={() => nav.navigate('MainTabs')}>
        <LinearGradient
          colors={gradients.hero}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={[styles.rankCard, shadow.medium]}
        >
          <LinearGradient colors={gradients.goldSoft} style={styles.rankGlow} />
          <View style={{ flex: 1 }}>
            <Text style={styles.rankLabel}>{t('home_your_rank')}</Text>
            <View style={{ flexDirection: 'row', alignItems: 'baseline', gap: 8, marginTop: 4 }}>
              <Text style={styles.rankBig}>#{user.nationalRank}</Text>
              <Text style={styles.rankSub}>· Top {100 - user.percentile + 1}% MLBB</Text>
            </View>
            <View style={styles.rankChips}>
              <View style={styles.rankChip}>
                <Ionicons name="trending-up" size={12} color={colors.green} />
                <Text style={styles.rankChipText}>{user.percentile}% percentile</Text>
              </View>
              <View style={styles.rankChip}>
                <Ionicons name="ribbon" size={12} color={colors.primary} />
                <Text style={styles.rankChipText}>{user.endorsements} endorsements</Text>
              </View>
            </View>
          </View>
          <LinearGradient colors={gradients.gold} style={[styles.rankIcon, shadow.glow]}>
            <Ionicons name="podium" size={28} color={colors.bg} />
          </LinearGradient>
        </LinearGradient>
      </TouchableOpacity>

      <H2 style={{ marginTop: spacing.md, marginBottom: spacing.md }}>{t('home_feed')}</H2>
      {FEED.map((item) => (
        <Card key={item.id}>
          <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: spacing.sm }}>
            <View style={[styles.feedIcon, { backgroundColor: TYPE_COLOR[item.type] + '22' }]}>
              <Ionicons name={TYPE_ICON[item.type]} size={16} color={TYPE_COLOR[item.type]} />
            </View>
            <View style={[styles.tagSmall, { borderColor: TYPE_COLOR[item.type], backgroundColor: TYPE_COLOR[item.type] + '14' }]}>
              <Text style={[styles.tagSmallText, { color: TYPE_COLOR[item.type] }]}>{item.tag}</Text>
            </View>
            <Text style={styles.feedTime}>{item.time}</Text>
          </View>
          <Text style={styles.feedTitle}>{item.title[lang]}</Text>
          <Body muted style={{ marginTop: 4 }}>
            {item.body[lang]}
          </Body>
        </Card>
      ))}

      <H2 style={{ marginTop: spacing.md, marginBottom: spacing.md }}>{t('home_trending')}</H2>
      <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: spacing.md }}>
        {PLAYERS.slice(0, 4).map((p) => (
          <TouchableOpacity
            key={p.id}
            style={[styles.trendCard, shadow.soft]}
            activeOpacity={0.85}
            onPress={() => nav.navigate('PlayerDetail', { playerId: p.id })}
          >
            <View style={[styles.trendAccent, { backgroundColor: p.avatarColor }]} />
            <Text style={styles.trendName} numberOfLines={1}>
              {p.name}
            </Text>
            <Text style={styles.trendMeta}>{p.state}</Text>
            <Text style={styles.trendRank}>#{p.nationalRank} {lang === 'ms' ? 'negara' : 'nat\'l'}</Text>
          </TouchableOpacity>
        ))}
      </View>
    </Screen>
  );
};

const styles = StyleSheet.create({
  rankCard: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: radius.xl,
    padding: spacing.xl,
    borderWidth: 1,
    borderColor: colors.hairline,
    overflow: 'hidden',
    marginBottom: spacing.md,
  },
  rankGlow: { position: 'absolute', top: -50, right: -40, width: 160, height: 160, borderRadius: 80, opacity: 0.18 },
  rankLabel: { color: colors.textMuted, fontSize: 13, fontWeight: '600', letterSpacing: 0.3 },
  rankBig: { color: colors.primary, fontSize: 38, fontWeight: '900', letterSpacing: -1 },
  rankSub: { color: colors.textMuted, fontSize: 13 },
  rankChips: { flexDirection: 'row', flexWrap: 'wrap', gap: 6, marginTop: spacing.md },
  rankChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: 'rgba(255,255,255,0.06)',
    borderRadius: radius.pill,
    paddingHorizontal: 10,
    paddingVertical: 5,
  },
  rankChipText: { color: colors.text, fontSize: 11, fontWeight: '700' },
  rankIcon: {
    width: 60,
    height: 60,
    borderRadius: 30,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: spacing.md,
  },
  feedIcon: { width: 30, height: 30, borderRadius: 10, alignItems: 'center', justifyContent: 'center', marginRight: spacing.sm },
  tagSmall: { borderWidth: 1, borderRadius: 6, paddingHorizontal: 7, paddingVertical: 2 },
  tagSmallText: { fontSize: 10, fontWeight: '800', letterSpacing: 0.4 },
  feedTime: { color: colors.textFaint, fontSize: 12, marginLeft: 'auto' },
  feedTitle: { color: colors.text, fontWeight: '800', fontSize: 15, lineHeight: 21 },
  trendCard: {
    width: '47%',
    backgroundColor: colors.card,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.border,
    padding: spacing.lg,
    overflow: 'hidden',
  },
  trendAccent: { position: 'absolute', top: 0, left: 0, width: 4, height: '100%' },
  trendName: { color: colors.text, fontWeight: '800', fontSize: 14 },
  trendMeta: { color: colors.textMuted, fontSize: 12, marginTop: 2 },
  trendRank: { color: colors.primary, fontSize: 12, fontWeight: '800', marginTop: 8 },
});
