export type GameId = 'mlbb' | 'pubgm' | 'valorant' | 'freefire';

export interface GameDef {
  id: GameId;
  name: string;
  short: string;
  color: string;
  roles: string[];
  ranks: string[];
  /** stat keys -> bilingual labels */
  statLabels: { key: string; ms: string; en: string; suffix?: string }[];
}

export const GAMES: GameDef[] = [
  {
    id: 'mlbb',
    name: 'Mobile Legends: Bang Bang',
    short: 'MLBB',
    color: '#3A86FF',
    roles: ['Jungler', 'Mid Laner', 'Gold Laner', 'EXP Laner', 'Roamer'],
    ranks: ['Epic', 'Legend', 'Mythic', 'Mythical Honor', 'Mythical Glory'],
    statLabels: [
      { key: 'winRate', ms: 'Kadar Menang', en: 'Win Rate', suffix: '%' },
      { key: 'kda', ms: 'KDA', en: 'KDA' },
      { key: 'matches', ms: 'Perlawanan (30h)', en: 'Matches (30d)' },
      { key: 'mainHero', ms: 'Hero Utama', en: 'Main Hero' },
    ],
  },
  {
    id: 'pubgm',
    name: 'PUBG Mobile',
    short: 'PUBGM',
    color: '#F39C12',
    roles: ['IGL', 'Fragger', 'Support', 'Scout', 'Sniper'],
    ranks: ['Diamond', 'Crown', 'Ace', 'Ace Master', 'Conqueror'],
    statLabels: [
      { key: 'kd', ms: 'Nisbah K/D', en: 'K/D Ratio' },
      { key: 'winRate', ms: 'Kadar Menang', en: 'Win Rate', suffix: '%' },
      { key: 'avgDamage', ms: 'Damage/Game', en: 'Damage/Game' },
      { key: 'avgSurvival', ms: 'Survival Purata', en: 'Avg Survival' },
    ],
  },
  {
    id: 'valorant',
    name: 'Valorant',
    short: 'VAL',
    color: '#E63946',
    roles: ['Duelist', 'Controller', 'Initiator', 'Sentinel', 'IGL'],
    ranks: ['Platinum', 'Diamond', 'Ascendant', 'Immortal', 'Radiant'],
    statLabels: [
      { key: 'acs', ms: 'ACS', en: 'ACS' },
      { key: 'hsPct', ms: 'Headshot %', en: 'HS %', suffix: '%' },
      { key: 'winRate', ms: 'Kadar Menang', en: 'Win Rate', suffix: '%' },
      { key: 'mainAgent', ms: 'Agen Utama', en: 'Main Agent' },
    ],
  },
  {
    id: 'freefire',
    name: 'Free Fire',
    short: 'FF',
    color: '#2ECC71',
    roles: ['Rusher', 'Support', 'Sniper', 'IGL'],
    ranks: ['Diamond', 'Heroic', 'Master', 'Grandmaster'],
    statLabels: [
      { key: 'kd', ms: 'Nisbah K/D', en: 'K/D Ratio' },
      { key: 'winRate', ms: 'Kadar Menang', en: 'Win Rate', suffix: '%' },
      { key: 'hsPct', ms: 'Headshot %', en: 'Headshot %', suffix: '%' },
      { key: 'booyah', ms: 'Booyah', en: 'Booyah Count' },
    ],
  },
];

export const gameById = (id: GameId) => GAMES.find((g) => g.id === id)!;
