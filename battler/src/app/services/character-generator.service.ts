import { Injectable } from '@angular/core';
import { Character, Stats, Tier, Rarity } from '../models';

function uuid() {
  return crypto.randomUUID();
}

// einfacher Seeded RNG (LCG)
function makeRng(seed: number) {
  let s = seed >>> 0;
  return () => {
    s = (s * 1664525 + 1013904223) >>> 0;
    return s / 0x100000000;
  };
}

@Injectable({ providedIn: 'root' })
export class CharacterGeneratorService {
  // 50+ Einträge je Pool – hier exemplarisch (erweitere einfach die Arrays)
  private races = [
    'Mensch',
    'Elf',
    'Ork',
    'Zwerg',
    'Ghul',
    'Valkyrie',
    'Drakonier',
    'Fuchsling',
    'Riesenkrabbe',
    'Titan',
    'Nachtläufer',
    'Wassergeist',
    'Schattenwandler',
    'Sukkubus',
    'Kitsune',
    'Minotaurus',
    'Android',
    'Zyklop',
    'Golem',
    'Harpyie',
    'Sirene',
    'Lamien',
    'Dryade',
    'Geist',
    'Vampir',
    'Werwolf',
    'Saty r',
    'Greif',
    'Chimäre',
    'Naga',
    'Phoenixling',
    'Steinriese',
    'Sandwurm',
    'Grubenmaul',
    'Eisling',
    'Feenfolk',
    'Troll',
    'Gnoll',
    'Arkaner',
    'Zeitwanderer',
    'Nebelläufer',
    'Wüstenläufer',
    'Mondsänger',
    'Runenträger',
    'Sternenrufer',
    'Moosriese',
    'Sturmkrieger',
    'Knochenhand',
    'Seher',
    'Aasfresser',
  ];

  private weapons = [
    'Kein',
    'Schwert',
    'Axt',
    'Speer',
    'Bogen',
    'Dolch',
    'Stab',
    'Hammer',
    'Peitsche',
    'Klaue',
    'Zahnklinge',
    'Harpune',
    'Sichel',
    'Kettenklinge',
    'Flammenwerfer',
    'Blaster',
    'Energieklinge',
    'Schallkanone',
    'Krummsäbel',
    'Wurfmesser',
    'Zweihänder',
    'Hellebarde',
    'Morgenstern',
    'Naginata',
    'Gleve',
    'Armbrust',
    'Tetsubo',
    'Schirmklinge',
    'Peitschenklinge',
    'Netz',
    'Knochenkeule',
    'Runenstab',
    'Donnerhammer',
    'Frostspeer',
    'Schattendolch',
    'Lichtbogen',
    'Kristallklinge',
    'Dornenpeitsche',
    'Seelensense',
    'Magnetpeitsche',
    'Plasmastab',
    'Photonenschwert',
    'Ätherlanze',
    'Gravhammer',
    'Druidenstab',
    'Blitzbogen',
    'Schicksalsklinge',
    'Glaskanone',
    'Sternspe er',
    'Urfäuste',
  ];

  private powers = [
    'Keine',
    'Teleportation',
    'Telekinese',
    'Unsichtbarkeit',
    'Feuerhand',
    'Eisstoß',
    'Blitzschlag',
    'Heilung',
    'Gedankenkontrolle',
    'Zeitlupe',
    'Berserkerwut',
    'Steinhaut',
    'Schattenbrand',
    'Lichtschild',
    'Schwerkraftknick',
    'Windklinge',
    'Sandsturm',
    'Erdbeben',
    'Wasserform',
    'Giftnebel',
    'Schallstoß',
    'Plasmahaut',
    'Photonenpuls',
    'Ätherblick',
    'Tiergestalt',
    'Runenzauber',
    'Blutpakt',
    'Segen',
    'Fluch',
    'Raserei',
    'Magnetismus',
    'Metallhaut',
    'Dornenaura',
    'Schattenschritt',
    'Geisterruf',
    'Warp-Sprung',
    'Sturmkanal',
    'Solarbrand',
    'Mondsegen',
    'Nebelhülle',
    'Knochenwuchs',
    'Adlerblick',
    'Spiegelbild',
    'Phase Shift',
    'Pyrokinese',
    'Kryo-Spike',
    'Electro Dash',
    'Seelenraub',
    'Chaosfunke',
    'Ordnungsschild',
  ];

  private tierWeights: Array<{
    tier: Tier;
    weight: number;
    statBonus: number;
  }> = [
    { tier: 'Mensch', weight: 40, statBonus: 0 },
    { tier: 'Tier', weight: 20, statBonus: 2 },
    { tier: 'Halbgott', weight: 15, statBonus: 5 },
    { tier: 'Android', weight: 10, statBonus: 6 },
    { tier: 'Dämon', weight: 8, statBonus: 7 },
    { tier: 'Gott', weight: 7, statBonus: 9 },
  ];

  private rarityWeights: Array<{
    rarity: Rarity;
    weight: number;
    spread: number;
  }> = [
    { rarity: 'common', weight: 55, spread: 5 },
    { rarity: 'rare', weight: 25, spread: 9 },
    { rarity: 'epic', weight: 13, spread: 12 },
    { rarity: 'legendary', weight: 7, spread: 16 },
  ];

  private pickWeighted<T>(
    rng: () => number,
    items: Array<{ weight: number } & T>
  ): T {
    const sum = items.reduce((a, b) => a + b.weight, 0);
    let r = rng() * sum;
    for (const it of items) {
      if ((r -= it.weight) <= 0) return it;
    }
    return items[items.length - 1];
  }

  private pick<T>(rng: () => number, arr: T[]): T {
    return arr[Math.floor(rng() * arr.length)];
  }

  private rollStat(
    rng: () => number,
    baseSpread: number,
    bonus: number
  ): number {
    // 1–50, beeinflusst durch Rarity-Spread & Tier-Bonus
    const v = Math.floor(1 + rng() * 50);
    // „spread“ zieht nach oben: wir addieren 0..spread
    const uplift = Math.floor(rng() * baseSpread);
    return Math.max(1, Math.min(50, v + uplift + bonus));
  }

  generate(seed?: number): Character {
    const realSeed = seed ?? Math.floor(Math.random() * 1e9);
    const rng = makeRng(realSeed);

    const { rarity, spread } = this.pickWeighted(
      rng,
      this.rarityWeights
    ) as any;
    const { tier, statBonus } = this.pickWeighted(rng, this.tierWeights) as any;

    const race = this.pick(rng, this.races);
    const hasWeapon = rng() < 0.75; // 75% tragen was
    const weapon = hasWeapon
      ? this.pick(
          rng,
          this.weapons.filter((w) => w !== 'Kein')
        )
      : undefined;

    const hasPower = rng() < 0.6; // 60% haben Power
    const power = hasPower
      ? this.pick(
          rng,
          this.powers.filter((p) => p !== 'Keine')
        )
      : undefined;

    const stats: Stats = {
      strength: this.rollStat(rng, spread, statBonus),
      speed: this.rollStat(rng, spread, statBonus),
      stamina: this.rollStat(rng, spread, statBonus),
      defense: this.rollStat(rng, spread, statBonus),
    };

    return {
      id: uuid(),
      name: this.makeName(rng, race, tier),
      seed: realSeed,
      rarity,
      tier,
      race,
      hasWeapon,
      weapon,
      hasPower,
      power,
      stats,
      level: 1,
      xp: 0,
      createdAt: Date.now(),
    };
  }

  private makeName(rng: () => number, race: string, tier: Tier): string {
    const prefixes = [
      'Ara',
      'Vor',
      'Zek',
      'Tal',
      'Mor',
      'Lys',
      'Ken',
      'Rha',
      'Ith',
      'Sul',
    ];
    const suffixes = [
      '-ion',
      '-ar',
      '-en',
      '-os',
      '-eth',
      '-ael',
      '-yr',
      '-oth',
      '-in',
      '-eus',
    ];
    const n = `${this.pick(rng, prefixes)}${this.pick(rng, suffixes)}`;
    return n;
  }
}
