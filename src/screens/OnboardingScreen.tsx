import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { colors, radius, spacing } from '../theme/colors';
import { Button, H1, H2, Body } from '../components/ui';
import { useStore, useT } from '../store/useStore';
import { GAMES, GameId } from '../data/games';

export const OnboardingScreen: React.FC = () => {
  const t = useT();
  const lang = useStore((s) => s.lang);
  const setLang = useStore((s) => s.setLang);
  const setConsent = useStore((s) => s.setConsent);
  const completeOnboarding = useStore((s) => s.completeOnboarding);

  const [step, setStep] = useState(0);
  const [consent, setConsentLocal] = useState(false);
  const [picked, setPicked] = useState<GameId[]>(['mlbb', 'valorant']);

  const togglePick = (id: GameId) =>
    setPicked((p) => (p.includes(id) ? p.filter((x) => x !== id) : [...p, id]));

  return (
    <SafeAreaView style={styles.screen}>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.logoRow}>
          <Ionicons name="briefcase" size={30} color={colors.primary} />
          <Text style={styles.logoText}>
            Briefcase <Text style={{ color: colors.primary }}>Esports</Text>
          </Text>
        </View>
        <View style={styles.flagBar}>
          <View style={{ flex: 1, backgroundColor: colors.accent }} />
          <View style={{ flex: 1, backgroundColor: colors.white }} />
          <View style={{ flex: 1, backgroundColor: colors.blue }} />
          <View style={{ flex: 1, backgroundColor: colors.primary }} />
        </View>

        {step === 0 && (
          <View>
            <H1 style={{ marginTop: spacing.xl }}>{t('welcome_title')}</H1>
            <Body muted style={{ marginTop: spacing.sm, fontSize: 15 }}>
              {t('welcome_sub')}
            </Body>

            <H2 style={{ marginTop: spacing.xxl, marginBottom: spacing.md }}>{t('choose_language')}</H2>
            <View style={{ flexDirection: 'row', gap: spacing.md }}>
              <LangCard
                active={lang === 'ms'}
                flag="🇲🇾"
                title="Bahasa Malaysia"
                sub="Lalai / Default"
                onPress={() => setLang('ms')}
              />
              <LangCard
                active={lang === 'en'}
                flag="🌐"
                title="English"
                sub="Toggle"
                onPress={() => setLang('en')}
              />
            </View>

            <Button title={t('continue')} onPress={() => setStep(1)} style={{ marginTop: spacing.xxl }} />
          </View>
        )}

        {step === 1 && (
          <View>
            <View style={styles.pdpaHeader}>
              <Ionicons name="shield-checkmark" size={22} color={colors.green} />
              <H2 style={{ marginLeft: spacing.sm }}>{t('pdpa_title')}</H2>
            </View>
            <Body muted style={{ marginTop: spacing.md }}>
              {t('pdpa_intro')}
            </Body>

            <View style={styles.pdpaList}>
              {[t('pdpa_item_profile'), t('pdpa_item_stats'), t('pdpa_item_contact')].map((item) => (
                <View key={item} style={styles.pdpaItem}>
                  <Ionicons name="ellipse" size={6} color={colors.primary} />
                  <Body style={{ marginLeft: spacing.md, flex: 1 }}>{item}</Body>
                </View>
              ))}
            </View>

            <TouchableOpacity style={styles.consentRow} onPress={() => setConsentLocal((c) => !c)} activeOpacity={0.7}>
              <Ionicons
                name={consent ? 'checkbox' : 'square-outline'}
                size={24}
                color={consent ? colors.primary : colors.textMuted}
              />
              <Body style={{ marginLeft: spacing.md, flex: 1 }}>{t('pdpa_consent_check')}</Body>
            </TouchableOpacity>

            <TouchableOpacity>
              <Text style={styles.link}>{t('pdpa_privacy_policy')}</Text>
            </TouchableOpacity>

            <Button
              title={t('continue')}
              onPress={() => {
                setConsent(true);
                setStep(2);
              }}
              disabled={!consent}
              style={{ marginTop: spacing.xxl }}
            />
          </View>
        )}

        {step === 2 && (
          <View>
            <H2 style={{ marginTop: spacing.lg }}>{t('onboarding_games_title')}</H2>
            <Body muted style={{ marginTop: spacing.sm }}>
              {t('onboarding_games_sub')}
            </Body>

            <View style={{ marginTop: spacing.lg }}>
              {GAMES.map((g) => {
                const active = picked.includes(g.id);
                return (
                  <TouchableOpacity
                    key={g.id}
                    activeOpacity={0.8}
                    onPress={() => togglePick(g.id)}
                    style={[styles.gameRow, active && { borderColor: g.color, backgroundColor: g.color + '1A' }]}
                  >
                    <View style={[styles.gameDot, { backgroundColor: g.color }]} />
                    <View style={{ flex: 1 }}>
                      <Text style={styles.gameName}>{g.name}</Text>
                      <Text style={styles.gameShort}>{g.short}</Text>
                    </View>
                    <Ionicons
                      name={active ? 'checkmark-circle' : 'add-circle-outline'}
                      size={24}
                      color={active ? g.color : colors.textMuted}
                    />
                  </TouchableOpacity>
                );
              })}
            </View>

            <Button
              title={t('get_started')}
              onPress={completeOnboarding}
              disabled={picked.length === 0}
              style={{ marginTop: spacing.xl }}
            />
          </View>
        )}

        <View style={styles.dots}>
          {[0, 1, 2].map((i) => (
            <View key={i} style={[styles.dot, step === i && { backgroundColor: colors.primary, width: 22 }]} />
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const LangCard: React.FC<{ active: boolean; flag: string; title: string; sub: string; onPress: () => void }> = ({
  active,
  flag,
  title,
  sub,
  onPress,
}) => (
  <TouchableOpacity
    activeOpacity={0.8}
    onPress={onPress}
    style={[styles.langCard, active && { borderColor: colors.primary, backgroundColor: colors.primary + '1A' }]}
  >
    <Text style={{ fontSize: 30 }}>{flag}</Text>
    <Text style={styles.langTitle}>{title}</Text>
    <Text style={styles.langSub}>{sub}</Text>
  </TouchableOpacity>
);

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.bg },
  content: { padding: spacing.xl, paddingBottom: spacing.xxl * 2 },
  logoRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm, marginTop: spacing.lg },
  logoText: { color: colors.text, fontSize: 22, fontWeight: '800' },
  flagBar: { flexDirection: 'row', height: 5, borderRadius: 3, overflow: 'hidden', marginTop: spacing.md },
  langCard: {
    flex: 1,
    backgroundColor: colors.card,
    borderRadius: radius.lg,
    borderWidth: 1.5,
    borderColor: colors.border,
    padding: spacing.lg,
    alignItems: 'center',
    gap: 4,
  },
  langTitle: { color: colors.text, fontWeight: '700', fontSize: 14, marginTop: spacing.sm, textAlign: 'center' },
  langSub: { color: colors.textMuted, fontSize: 12 },
  pdpaHeader: { flexDirection: 'row', alignItems: 'center', marginTop: spacing.xl },
  pdpaList: { marginTop: spacing.lg, gap: spacing.md },
  pdpaItem: { flexDirection: 'row', alignItems: 'center' },
  consentRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: spacing.xl,
    backgroundColor: colors.card,
    padding: spacing.lg,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.border,
  },
  link: { color: colors.primary, marginTop: spacing.md, fontWeight: '600', fontSize: 13 },
  gameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    padding: spacing.lg,
    borderRadius: radius.md,
    borderWidth: 1.5,
    borderColor: colors.border,
    backgroundColor: colors.card,
    marginBottom: spacing.md,
  },
  gameDot: { width: 12, height: 12, borderRadius: 6 },
  gameName: { color: colors.text, fontWeight: '700', fontSize: 14 },
  gameShort: { color: colors.textMuted, fontSize: 12, marginTop: 2 },
  dots: { flexDirection: 'row', justifyContent: 'center', gap: 6, marginTop: spacing.xxl },
  dot: { width: 8, height: 8, borderRadius: 4, backgroundColor: colors.border },
});
