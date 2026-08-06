import { GameId } from './games';

export interface RadarScores {
  mechanical: number;
  consistency: number;
  teamplay: number;
  clutch: number;
  gamesense: number;
  adapt: number;
}

export interface PlayerGame {
  gameId: GameId;
  role: string;
  rank: string;
  stats: Record<string, string | number>;
}

export interface Player {
  id: string;
  username: string;
  name: string;
  avatarColor: string;
  initials: string;
  state: string;
  bio: { ms: string; en: string };
  verified: boolean;
  pro: boolean;
  availability: 'casual' | 'semipro' | 'fulltime';
  langs: string[];
  socials: { tiktok?: string; youtube?: string; discord?: string };
  games: PlayerGame[];
  radar: RadarScores;
  nationalRank: number;
  percentile: number;
  endorsements: number;
  clips: { id: string; title: string; durationSec: number }[];
  tournamentHistory: { id: string; name: string; placement: string; year: number }[];
}

export interface FeedItem {
  id: string;
  type: 'result' | 'transfer' | 'highlight' | 'announcement';
  title: { ms: string; en: string };
  body: { ms: string; en: string };
  tag: string;
  time: string;
}

export type MatchStatus = 'scheduled' | 'awaiting' | 'completed';

export interface Match {
  id: string;
  round: number;
  teamA: string;
  teamB: string;
  scoreA?: number;
  scoreB?: number;
  status: MatchStatus;
  time: string;
}

export interface Tournament {
  id: string;
  name: string;
  gameId: GameId;
  format: string;
  capacity: number;
  registered: number;
  entryFeeMYR: number;
  prizePoolMYR: number;
  state: string;
  status: 'upcoming' | 'active' | 'completed';
  organizer: string;
  icVerify: boolean;
  matches: Match[];
}

export interface AppNotification {
  id: string;
  category: 'matches' | 'recruitment' | 'social' | 'system';
  title: { ms: string; en: string };
  body: { ms: string; en: string };
  time: string;
  actionable?: boolean;
}

export const CURRENT_USER: Player = {
  id: 'me',
  username: 'hafizz_igl',
  name: 'Hafiz Rahman',
  avatarColor: '#FFCC00',
  initials: 'HR',
  state: 'Selangor',
  bio: {
    ms: 'IGL & Jungler dari Klang Valley. Sedang cari pasukan semi-pro untuk MPL season depan.',
    en: 'IGL & Jungler from Klang Valley. Looking for a semi-pro team for the next MPL season.',
  },
  verified: true,
  pro: false,
  availability: 'semipro',
  langs: ['Bahasa Malaysia', 'English'],
  socials: { tiktok: '@hafizz_igl', youtube: 'HafizGG', discord: 'hafizz#1881' },
  games: [
    {
      gameId: 'mlbb',
      role: 'Jungler',
      rank: 'Mythical Glory',
      stats: { winRate: 63, kda: '4.8', matches: 142, mainHero: 'Ling' },
    },
    {
      gameId: 'valorant',
      role: 'Initiator',
      rank: 'Immortal',
      stats: { acs: 248, hsPct: 27, winRate: 58, mainAgent: 'Sova' },
    },
  ],
  radar: { mechanical: 82, consistency: 75, teamplay: 88, clutch: 70, gamesense: 90, adapt: 78 },
  nationalRank: 214,
  percentile: 97,
  endorsements: 23,
  clips: [
    { id: 'c1', title: 'Ling 1v3 clutch — Mythic rank', durationSec: 48 },
    { id: 'c2', title: 'Sova lineup ace on Ascent', durationSec: 132 },
    { id: 'c3', title: 'MPL qualifier highlight', durationSec: 95 },
  ],
  tournamentHistory: [
    { id: 't-h1', name: 'UiTM Esports Cup', placement: 'Johan', year: 2025 },
    { id: 't-h2', name: 'Selangor MLBB Open', placement: 'Naib Johan', year: 2025 },
    { id: 't-h3', name: 'Klang Valley Valorant Clash', placement: 'Top 4', year: 2024 },
  ],
};

export const PLAYERS: Player[] = [
  {
    id: 'p1',
    username: 'aiman_duelist',
    name: 'Aiman Hakimi',
    avatarColor: '#E63946',
    initials: 'AH',
    state: 'Selangor',
    bio: { ms: 'Duelist agresif. Main untuk menang.', en: 'Aggressive duelist. Plays to win.' },
    verified: true,
    pro: true,
    availability: 'fulltime',
    langs: ['Bahasa Malaysia', 'English'],
    socials: { tiktok: '@aimanduelist' },
    games: [
      { gameId: 'valorant', role: 'Duelist', rank: 'Radiant', stats: { acs: 312, hsPct: 31, winRate: 64, mainAgent: 'Jett' } },
    ],
    radar: { mechanical: 95, consistency: 80, teamplay: 70, clutch: 92, gamesense: 84, adapt: 81 },
    nationalRank: 12,
    percentile: 99,
    endorsements: 58,
    clips: [{ id: 'c', title: 'Jett ace clutch', durationSec: 41 }],
    tournamentHistory: [{ id: 'th', name: 'VCT MY Qualifier', placement: 'Top 8', year: 2025 }],
  },
  {
    id: 'p2',
    username: 'siti_support',
    name: 'Siti Nurhaliza',
    avatarColor: '#9B59B6',
    initials: 'SN',
    state: 'Pulau Pinang',
    bio: { ms: 'Roamer/Support. Vision control terbaik di Penang.', en: 'Roamer/Support. Best vision control in Penang.' },
    verified: true,
    pro: false,
    availability: 'semipro',
    langs: ['Bahasa Malaysia', 'English', 'Mandarin'],
    socials: { youtube: 'SitiGaming' },
    games: [
      { gameId: 'mlbb', role: 'Roamer', rank: 'Mythic', stats: { winRate: 59, kda: '5.2', matches: 98, mainHero: 'Angela' } },
    ],
    radar: { mechanical: 72, consistency: 85, teamplay: 94, clutch: 66, gamesense: 88, adapt: 80 },
    nationalRank: 188,
    percentile: 96,
    endorsements: 31,
    clips: [{ id: 'c', title: 'Angela global ult save', durationSec: 28 }],
    tournamentHistory: [{ id: 'th', name: 'Penang MLBB League', placement: 'Johan', year: 2025 }],
  },
  {
    id: 'p3',
    username: 'wei_sniper',
    name: 'Tan Wei Jian',
    avatarColor: '#2ECC71',
    initials: 'TW',
    state: 'Johor',
    bio: { ms: 'Sniper PUBGM. Cold-blooded clutch.', en: 'PUBGM sniper. Cold-blooded clutch.' },
    verified: false,
    pro: false,
    availability: 'casual',
    langs: ['English', 'Mandarin'],
    socials: { tiktok: '@weisniper' },
    games: [
      { gameId: 'pubgm', role: 'Sniper', rank: 'Conqueror', stats: { kd: '5.1', winRate: 22, avgDamage: 612, avgSurvival: '21:40' } },
    ],
    radar: { mechanical: 90, consistency: 68, teamplay: 60, clutch: 88, gamesense: 76, adapt: 72 },
    nationalRank: 95,
    percentile: 98,
    endorsements: 14,
    clips: [{ id: 'c', title: '4K wipe with Kar98', durationSec: 55 }],
    tournamentHistory: [{ id: 'th', name: 'JB PUBGM Showdown', placement: 'Top 4', year: 2025 }],
  },
  {
    id: 'p4',
    username: 'farah_rush',
    name: 'Farah Aziz',
    avatarColor: '#F39C12',
    initials: 'FA',
    state: 'Sabah',
    bio: { ms: 'Free Fire rusher dari Kota Kinabalu.', en: 'Free Fire rusher from Kota Kinabalu.' },
    verified: true,
    pro: false,
    availability: 'semipro',
    langs: ['Bahasa Malaysia', 'English'],
    socials: { tiktok: '@farahrush' },
    games: [
      { gameId: 'freefire', role: 'Rusher', rank: 'Grandmaster', stats: { kd: '3.9', winRate: 34, hsPct: 41, booyah: 210 } },
    ],
    radar: { mechanical: 88, consistency: 74, teamplay: 78, clutch: 83, gamesense: 79, adapt: 85 },
    nationalRank: 142,
    percentile: 97,
    endorsements: 19,
    clips: [{ id: 'c', title: 'Booyah solo vs squad', durationSec: 37 }],
    tournamentHistory: [{ id: 'th', name: 'Sabah FF Cup', placement: 'Naib Johan', year: 2025 }],
  },
  {
    id: 'p5',
    username: 'haziq_mid',
    name: 'Haziq Iskandar',
    avatarColor: '#3A86FF',
    initials: 'HI',
    state: 'W.P. Kuala Lumpur',
    bio: { ms: 'Mid laner MLBB. Carry merchant.', en: 'MLBB mid laner. Carry merchant.' },
    verified: false,
    pro: false,
    availability: 'casual',
    langs: ['Bahasa Malaysia'],
    socials: {},
    games: [
      { gameId: 'mlbb', role: 'Mid Laner', rank: 'Mythic', stats: { winRate: 55, kda: '3.9', matches: 76, mainHero: 'Kagura' } },
    ],
    radar: { mechanical: 80, consistency: 70, teamplay: 65, clutch: 74, gamesense: 77, adapt: 73 },
    nationalRank: 401,
    percentile: 92,
    endorsements: 8,
    clips: [{ id: 'c', title: 'Kagura combo montage', durationSec: 62 }],
    tournamentHistory: [],
  },
  {
    id: 'p6',
    username: 'jia_controller',
    name: 'Lim Jia Hui',
    avatarColor: '#E0B400',
    initials: 'LJ',
    state: 'Sarawak',
    bio: { ms: 'Controller Valorant dari Kuching.', en: 'Valorant controller from Kuching.' },
    verified: true,
    pro: false,
    availability: 'semipro',
    langs: ['English', 'Mandarin', 'Bahasa Malaysia'],
    socials: { discord: 'jiahui#2020' },
    games: [
      { gameId: 'valorant', role: 'Controller', rank: 'Ascendant', stats: { acs: 198, hsPct: 22, winRate: 56, mainAgent: 'Omen' } },
    ],
    radar: { mechanical: 75, consistency: 82, teamplay: 90, clutch: 68, gamesense: 86, adapt: 79 },
    nationalRank: 256,
    percentile: 95,
    endorsements: 21,
    clips: [{ id: 'c', title: 'Omen flank watch 1v2', durationSec: 44 }],
    tournamentHistory: [{ id: 'th', name: 'Sarawak Valorant Open', placement: 'Top 4', year: 2025 }],
  },
];

export const FEED: FeedItem[] = [
  {
    id: 'f1',
    type: 'result',
    title: { ms: 'Team SMG menang MPL MY Season 14', en: 'Team SMG wins MPL MY Season 14' },
    body: { ms: 'Kemenangan 4-2 dalam final menentang Selangor Red Giants di Axiata Arena.', en: '4-2 grand final win over Selangor Red Giants at Axiata Arena.' },
    tag: 'MLBB',
    time: '2j',
  },
  {
    id: 'f2',
    type: 'announcement',
    title: { ms: 'MDEC umum geran ekosistem MYR 10 juta', en: 'MDEC announces MYR 10M ecosystem grant' },
    body: { ms: 'Platform homegrown layak memohon geran Ekonomi Digital sehingga MYR 500,000.', en: 'Homegrown platforms can apply for Digital Economy grants up to MYR 500,000.' },
    tag: 'MDEC',
    time: '5j',
  },
  {
    id: 'f3',
    type: 'transfer',
    title: { ms: 'Aiman Hakimi sertai roster Valorant Geek Fam', en: 'Aiman Hakimi joins Geek Fam Valorant roster' },
    body: { ms: 'Duelist Radiant dari Selangor menandatangani kontrak 2 tahun.', en: 'Selangor Radiant duelist signs a 2-year contract.' },
    tag: 'Valorant',
    time: '1h',
  },
  {
    id: 'f4',
    type: 'highlight',
    title: { ms: 'Klip viral: Booyah solo-vs-squad Farah', en: "Viral clip: Farah's solo-vs-squad Booyah" },
    body: { ms: '210K tontonan di TikTok dalam masa 24 jam.', en: '210K views on TikTok within 24 hours.' },
    tag: 'Free Fire',
    time: '1h',
  },
];

export const NOTIFICATIONS: AppNotification[] = [
  {
    id: 'n1',
    category: 'recruitment',
    title: { ms: 'Trial Request dari Geek Fam Academy', en: 'Trial Request from Geek Fam Academy' },
    body: { ms: 'Tempoh 14 hari • Elaun MYR 800/bulan • Jungler • Bootcamp KV', en: '14 days • MYR 800/mo stipend • Jungler • KV bootcamp' },
    time: '10m',
    actionable: true,
  },
  {
    id: 'n2',
    category: 'matches',
    title: { ms: 'Peringatan perlawanan dalam 1 jam', en: 'Match reminder in 1 hour' },
    body: { ms: 'vs Penang Phantoms • Room ID dihantar via WhatsApp', en: 'vs Penang Phantoms • Room ID sent via WhatsApp' },
    time: '45m',
  },
  {
    id: 'n3',
    category: 'social',
    title: { ms: 'Siti Nurhaliza menyokong kemahiran anda', en: 'Siti Nurhaliza endorsed your skills' },
    body: { ms: '"Game sense terbaik untuk seorang IGL!"', en: '"Best game sense for an IGL!"' },
    time: '2j',
  },
  {
    id: 'n4',
    category: 'system',
    title: { ms: 'Profil anda telah disahkan (MyKad)', en: 'Your profile is now verified (MyKad)' },
    body: { ms: 'Badge Disahkan kini dipaparkan pada Briefcase anda.', en: 'Verified badge now shows on your Briefcase.' },
    time: '1h',
  },
];

export const TOURNAMENTS: Tournament[] = [
  {
    id: 't1',
    name: 'Klang Valley MLBB Open 2026',
    gameId: 'mlbb',
    format: 'Single Elimination',
    capacity: 16,
    registered: 14,
    entryFeeMYR: 20,
    prizePoolMYR: 3000,
    state: 'Selangor',
    status: 'active',
    organizer: 'KV Esports',
    icVerify: true,
    matches: [
      { id: 'm1', round: 1, teamA: 'Selangor Red', teamB: 'KL Titans', scoreA: 2, scoreB: 1, status: 'completed', time: 'Sel 8:00 PM' },
      { id: 'm2', round: 1, teamA: 'Shah Alam GG', teamB: 'Cheras Kings', scoreA: 0, scoreB: 2, status: 'completed', time: 'Sel 9:00 PM' },
      { id: 'm3', round: 1, teamA: 'Subang Wolves', teamB: 'PJ Hornets', status: 'awaiting', time: 'Rab 8:00 PM' },
      { id: 'm4', round: 1, teamA: 'Klang Sharks', teamB: 'Ampang Aces', status: 'scheduled', time: 'Rab 9:00 PM' },
      { id: 'm5', round: 2, teamA: 'Selangor Red', teamB: 'Cheras Kings', status: 'scheduled', time: 'Kha 8:00 PM' },
    ],
  },
  {
    id: 't2',
    name: 'IIUM Valorant Campus Clash',
    gameId: 'valorant',
    format: 'Double Elimination',
    capacity: 32,
    registered: 28,
    entryFeeMYR: 0,
    prizePoolMYR: 1500,
    state: 'Selangor',
    status: 'upcoming',
    organizer: 'IIUM Esports Club',
    icVerify: true,
    matches: [],
  },
  {
    id: 't3',
    name: 'Penang PUBGM Showdown',
    gameId: 'pubgm',
    format: 'Round Robin',
    capacity: 16,
    registered: 16,
    entryFeeMYR: 15,
    prizePoolMYR: 2000,
    state: 'Pulau Pinang',
    status: 'active',
    organizer: 'Penang Gaming Hub',
    icVerify: false,
    matches: [
      { id: 'm1', round: 1, teamA: 'Georgetown Snipers', teamB: 'Butterworth Bravo', scoreA: 1, scoreB: 0, status: 'completed', time: 'Isn 8:00 PM' },
      { id: 'm2', round: 1, teamA: 'Bayan Lepas Squad', teamB: 'Air Itam Aces', status: 'scheduled', time: 'Sel 8:00 PM' },
    ],
  },
  {
    id: 't4',
    name: 'Sabah Free Fire Booyah Cup',
    gameId: 'freefire',
    format: 'Single Elimination',
    capacity: 64,
    registered: 51,
    entryFeeMYR: 10,
    prizePoolMYR: 5000,
    state: 'Sabah',
    status: 'completed',
    organizer: 'KK Gamers',
    icVerify: false,
    matches: [
      { id: 'm1', round: 3, teamA: 'KK Thunder', teamB: 'Sandakan Storm', scoreA: 3, scoreB: 2, status: 'completed', time: 'Final' },
    ],
  },
];
