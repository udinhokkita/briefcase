import { GameId } from '../data/games';

export type RootStackParamList = {
  Onboarding: undefined;
  MainTabs: undefined;
  PlayerDetail: { playerId: string };
  TournamentDetail: { tournamentId: string };
  CreateTournament: undefined;
  Payment: {
    title: string;
    amountMYR: number;
    onDoneMessage?: string;
    tournamentId?: string;
  };
  TrialRequest: { playerId: string };
  ReportScore: { tournamentId: string; matchId: string };
  Settings: undefined;
};

export type TabParamList = {
  Home: undefined;
  Discover: { game?: GameId } | undefined;
  Tournaments: undefined;
  Profile: undefined;
  Notifications: undefined;
};
