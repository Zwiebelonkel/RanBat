export type Rarity =
  | 'common'
  | 'rare'
  | 'epic'
  | 'legendary'
  | 'exotic'
  | 'mystical';

export type Tier =
  | 'Mensch'
  | 'Tier'
  | 'Halbgott'
  | 'Android'
  | 'Dämon'
  | 'Gott';

export interface Stats {
  strength: number;
  speed: number;
  stamina: number;
  defense: number;
}

export interface Character {
  id: string;
  name: string;
  seed: number;
  rarity: Rarity;
  tier: Tier;
  race: string;
  hasWeapon?: boolean;
  weapon?: string;
  hasPower?: boolean;
  power?: string;
  stats: Stats;
  level: number;
  xp: number;
  createdAt: number;
}
