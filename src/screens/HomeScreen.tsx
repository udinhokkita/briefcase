import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { colors, radius, spacing } from '../theme/colors';
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
      <TopBar subtitle={`${t('home_greeting')}, ${user.name.split(' ')[0]} 👋`} title="Laman Utama" />

      <TouchableOpacity activeOpacity={0.85} onPress={() => nav.navigate('MainTabs')}>
        <Card style={styles.rankCard}>
          <View style={{ flex: 1 }}>
            <Text style={styles.rankLabel}>{t('home_your_rank')}</Text>
            <View style={{ flexDirection: 'row', alignItems: 'baseline', gap: 8, marginTop: 4 }}>
              <Text style={styles.rankBig}>#{user.nationalRank}</Text>
              <Text style={styles.rankSub}>· Top {100 - user.percentile + 1}% MLBB</Text>
            </View>
          </View>
          <View style={styles.rankIcon}>
            <Ionicons name="podium" size={28} color={colors.bg} />
          </View>
        </Card>
      </TouchableOpacity>

      <H2 style={{ marginTop: spacing.sm, marginBottom: spacing.md }}>{t('home_feed')}</H2>
      {FEED.map((item) => (
        <Card key={item.id}>
          <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: spacing.sm }}>
            <View style={[styles.feedIcon, { backgroundColor: TYPE_COLOR[item.type] + '22' }]}>
              <Ionicons name={TYPE_ICON[item.type]} size={16} color={TYPE_COLOR[item.type]} />
            </View>
            <View style={[styles.tagSmall, { borderColor: TYPE_COLOR[item.type] }]}>
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

      <H2 style={{ marginTop: spacing.sm, marginBottom: spacing.md }}>{t('home_trending')}</H2>
      <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: spacing.md }}>
        {PLAYERS.slice(0, 4).map((p) => (
          <TouchableOpacity
            key={p.id}
            style={styles.trendCard}
            activeOpacity={0.85}
            onPress={() => nav.navigate('PlayerDetail', { playerId: p.id })}
          >
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
  rankCard: { flexDirection: 'row', alignItems: 'center', backgroundColor: colors.cardAlt },
  rankLabel: { color: colors.textMuted, fontSize: 13 },
  rankBig: { color: colors.primary, fontSize: 32, fontWeight: '900' },
  rankSub: { color: colors.textMuted, fontSize: 13 },
  rankIcon: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  feedIcon: { width: 28, height: 28, borderRadius: 8, alignItems: 'center', justifyContent: 'center', marginRight: spacing.sm },
  tagSmall: { borderWidth: 1, borderRadius: 4, paddingHorizontal: 6, paddingVertical: 1 },
  tagSmallText: { fontSize: 10, fontWeight: '800' },
  feedTime: { color: colors.textFaint, fontSize: 12, marginLeft: 'auto' },
  feedTitle: { color: colors.text, fontWeight: '700', fontSize: 15, lineHeight: 21 },
  trendCard: {
    width: '47%',
    backgroundColor: colors.card,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.border,
    padding: spacing.md,
  },
  trendName: { color: colors.text, fontWeight: '700', fontSize: 14 },
  trendMeta: { color: colors.textMuted, fontSize: 12, marginTop: 2 },
  trendRank: { color: colors.primary, fontSize: 12, fontWeight: '700', marginTop: 6 },
});
