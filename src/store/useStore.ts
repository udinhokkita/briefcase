import { create } from 'zustand';
import { Lang, strings } from '../i18n/strings';
import {
  AppNotification,
  CURRENT_USER,
  NOTIFICATIONS,
  Player,
  TOURNAMENTS,
  Tournament,
  Match,
} from '../data/mockData';
import { GameId } from '../data/games';

export interface TrialOffer {
  id: string;
  playerId: string;
  playerName: string;
  durationDays: number;
  stipendMYR: number;
  gameId: GameId;
  role: string;
  location: string;
}

interface AppState {
  lang: Lang;
  onboarded: boolean;
  consentGiven: boolean;
  user: Player;
  tournaments: Tournament[];
  notifications: AppNotification[];
  trialOffers: TrialOffer[];
  toast: string | null;

  showToast: (msg: string) => void;
  hideToast: () => void;
  setLang: (l: Lang) => void;
  toggleLang: () => void;
  setConsent: (v: boolean) => void;
  completeOnboarding: () => void;
  upgradeToPro: () => void;

  addTournament: (t: Tournament) => void;
  registerForTournament: (id: string) => void;
  reportScore: (tournamentId: string, matchId: string, scoreA: number, scoreB: number) => void;

  sendTrialOffer: (o: TrialOffer) => void;
}

export const useStore = create<AppState>((set) => ({
  lang: 'ms',
  onboarded: false,
  consentGiven: false,
  user: CURRENT_USER,
  tournaments: TOURNAMENTS,
  notifications: NOTIFICATIONS,
  trialOffers: [],
  toast: null,

  showToast: (msg) => set({ toast: msg }),
  hideToast: () => set({ toast: null }),
  setLang: (l) => set({ lang: l }),
  toggleLang: () => set((s) => ({ lang: s.lang === 'ms' ? 'en' : 'ms' })),
  setConsent: (v) => set({ consentGiven: v }),
  completeOnboarding: () => set({ onboarded: true }),
  upgradeToPro: () => set((s) => ({ user: { ...s.user, pro: true } })),

  addTournament: (t) => set((s) => ({ tournaments: [t, ...s.tournaments] })),
  registerForTournament: (id) =>
    set((s) => ({
      tournaments: s.tournaments.map((t) =>
        t.id === id ? { ...t, registered: Math.min(t.registered + 1, t.capacity) } : t,
      ),
    })),
  reportScore: (tournamentId, matchId, scoreA, scoreB) =>
    set((s) => ({
      tournaments: s.tournaments.map((t) => {
        if (t.id !== tournamentId) return t;
        const matches: Match[] = t.matches.map((m) =>
          m.id === matchId ? { ...m, scoreA, scoreB, status: 'completed' as const } : m,
        );
        return { ...t, matches };
      }),
    })),

  sendTrialOffer: (o) =>
    set((s) => ({
      trialOffers: [o, ...s.trialOffers],
      notifications: [
        {
          id: 'trial-' + o.id,
          category: 'recruitment',
          title: {
            ms: `Tawaran trial dihantar kepada ${o.playerName}`,
            en: `Trial offer sent to ${o.playerName}`,
          },
          body: {
            ms: `${o.durationDays} hari • MYR ${o.stipendMYR}/bulan • ${o.role}`,
            en: `${o.durationDays} days • MYR ${o.stipendMYR}/mo • ${o.role}`,
          },
          time: 'now',
        },
        ...s.notifications,
      ],
    })),
}));

/** Hook for translations bound to current language. */
export const useT = () => {
  const lang = useStore((s) => s.lang);
  return (key: keyof typeof strings) => strings[key]?.[lang] ?? String(key);
};

export const useLang = () => useStore((s) => s.lang);
