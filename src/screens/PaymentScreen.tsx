import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors, radius, spacing } from '../theme/colors';
import { Button } from '../components/ui';
import { useStore, useT } from '../store/useStore';
import { RootStackParamList } from '../navigation/types';

const METHODS: { id: string; name: string; icon: keyof typeof Ionicons.glyphMap; color: string }[] = [
  { id: 'tng', name: "Touch 'n Go eWallet", icon: 'wallet', color: '#0064FF' },
  { id: 'maybank', name: 'Maybank QRPay', icon: 'qr-code', color: '#FFC72C' },
  { id: 'fpx', name: 'FPX Online Banking', icon: 'business', color: '#00A859' },
  { id: 'grabpay', name: 'GrabPay', icon: 'card', color: '#00B14F' },
  { id: 'boost', name: 'Boost', icon: 'flash', color: '#EE2737' },
];

export const PaymentScreen: React.FC = () => {
  const t = useT();
  const lang = useStore((s) => s.lang);
  const nav = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const route = useRoute<RouteProp<RootStackParamList, 'Payment'>>();
  const { title, amountMYR, onDoneMessage, tournamentId } = route.params;
  const registerForTournament = useStore((s) => s.registerForTournament);
  const showToast = useStore((s) => s.showToast);
  const [selected, setSelected] = useState('tng');
  const [processing, setProcessing] = useState(false);

  const handlePay = () => {
    setProcessing(true);
    setTimeout(() => {
      if (tournamentId) registerForTournament(tournamentId);
      showToast(onDoneMessage ?? t('payment_success'));
      setProcessing(false);
      nav.goBack();
    }, 1400);
  };

  return (
    <SafeAreaView style={styles.screen} edges={['top']}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => nav.goBack()} style={styles.backBtn}>
          <Ionicons name="close" size={22} color={colors.text} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{t('payment_title')}</Text>
        <View style={{ width: 38 }} />
      </View>

      <View style={{ padding: spacing.lg, flex: 1 }}>
        <View style={styles.amountCard}>
          <Text style={styles.amountLabel}>{title}</Text>
          <Text style={styles.amount}>MYR {amountMYR.toFixed(2)}</Text>
          <View style={styles.secureRow}>
            <Ionicons name="lock-closed" size={12} color={colors.green} />
            <Text style={styles.secureText}>{t('secure_payment')}</Text>
          </View>
        </View>

        <Text style={styles.sectionLabel}>{t('select_method')}</Text>
        {METHODS.map((m) => (
          <TouchableOpacity key={m.id} style={[styles.method, selected === m.id && styles.methodActive]} onPress={() => setSelected(m.id)} activeOpacity={0.8}>
            <View style={[styles.methodIcon, { backgroundColor: m.color + '22' }]}>
              <Ionicons name={m.icon} size={18} color={m.color} />
            </View>
            <Text style={styles.methodName}>{m.name}</Text>
            <Ionicons
              name={selected === m.id ? 'radio-button-on' : 'radio-button-off'}
              size={20}
              color={selected === m.id ? colors.primary : colors.textMuted}
            />
          </TouchableOpacity>
        ))}

        <View style={{ flex: 1 }} />
        <View style={styles.pdpaNote}>
          <Ionicons name="shield-checkmark-outline" size={14} color={colors.textMuted} />
          <Text style={styles.pdpaText}>{t('payment_pdpa')}</Text>
        </View>
        {processing ? (
          <View style={styles.processing}>
            <ActivityIndicator color={colors.primary} />
            <Text style={styles.processingText}>{lang === 'ms' ? 'Memproses pembayaran...' : 'Processing payment...'}</Text>
          </View>
        ) : (
          <Button title={`${t('pay_now')} · MYR ${amountMYR.toFixed(2)}`} onPress={handlePay} />
        )}
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.bg },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: spacing.lg, paddingVertical: spacing.md, borderBottomWidth: 1, borderBottomColor: colors.border },
  backBtn: { width: 38, height: 38, borderRadius: 19, backgroundColor: colors.card, alignItems: 'center', justifyContent: 'center' },
  headerTitle: { color: colors.text, fontWeight: '800', fontSize: 17 },
  amountCard: { backgroundColor: colors.card, borderRadius: radius.lg, borderWidth: 1, borderColor: colors.border, padding: spacing.xl, alignItems: 'center', marginBottom: spacing.xl },
  amountLabel: { color: colors.textMuted, fontSize: 13, textAlign: 'center' },
  amount: { color: colors.primary, fontWeight: '900', fontSize: 34, marginTop: spacing.sm },
  secureRow: { flexDirection: 'row', alignItems: 'center', gap: 4, marginTop: spacing.sm },
  secureText: { color: colors.green, fontSize: 11, fontWeight: '600' },
  sectionLabel: { color: colors.textMuted, fontSize: 13, fontWeight: '700', marginBottom: spacing.md },
  method: { flexDirection: 'row', alignItems: 'center', gap: spacing.md, backgroundColor: colors.card, borderRadius: radius.md, borderWidth: 1, borderColor: colors.border, padding: spacing.md, marginBottom: spacing.sm },
  methodActive: { borderColor: colors.primary },
  methodIcon: { width: 38, height: 38, borderRadius: 10, alignItems: 'center', justifyContent: 'center' },
  methodName: { color: colors.text, fontSize: 14, fontWeight: '600', flex: 1 },
  pdpaNote: { flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: spacing.md, paddingHorizontal: spacing.sm },
  pdpaText: { color: colors.textMuted, fontSize: 11, flex: 1 },
  processing: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: spacing.sm, paddingVertical: spacing.lg },
  processingText: { color: colors.textMuted, fontSize: 14 },
});
