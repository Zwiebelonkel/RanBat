export type Rarity = 'common' | 'rare' | 'epic' | 'legendary';

export interface Stats {
  strength: number; // 1–50
  speed: number; // 1–50
  stamina: number; // 1–50
  defense: number; // 1–50
}

export type Tier =
  | 'Mensch'
  | 'Tier'
  | 'Halbgott'
  | 'Gott'
  | 'Dämon'
  | 'Android';

export interface Character {
  id: string; // uuid
  name: string;
  seed: number;
  rarity: Rarity;
  tier: Tier;
  race: string; // z.B. „Ork“, „Fuchs“, „Titan …“
  hasWeapon: boolean;
  weapon?: string;
  hasPower: boolean;
  power?: string;
  stats: Stats;
  level: number; // steigt bei Siegen
  xp: number; // optional
  createdAt: number;
}

export interface BattleResult {
  winnerId: string;
  loserId: string;
  rounds: number;
  log: string[];
  ratingA: number;
  ratingB: number;
}
