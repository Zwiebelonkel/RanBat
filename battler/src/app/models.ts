export type Rarity = 'common' | 'rare' | 'epic' | 'legendary' | 'exotic' | 'mystical';

export type Tier = 'Mensch' | 'Tier' | 'Halbgott' | 'Android' | 'Dämon' | 'Gott';

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
  attack: number;
  defense: number;
  speed: number;
  health: number;
  level: number;
  xp: number;
  createdAt: number;
}

export interface BattleResult {
  winner: Character;
  loser: Character;
  log: string[];
}

export interface User {
  id: string;
  username: string;
  token?: string;
}
