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
  private humanNames = [
    'Adam', 'Aaron', 'Abraham', 'Albert', 'Alex', 'Alfred', 'Andrew', 'Angel', 'Anthony', 'Arthur', 
    'Barry', 'Ben', 'Benjamin', 'Bill', 'Billy', 'Bob', 'Bobby', 'Brad', 'Brandon', 'Brian', 
    'Carl', 'Carlos', 'Charles', 'Chris', 'Christian', 'Christopher', 'Cole', 'Colin', 'Craig', 
    'Dan', 'Daniel', 'David', 'Dennis', 'Derek', 'Don', 'Donald', 'Douglas', 
    'Earl', 'Eddie', 'Edward', 'Eric', 'Ethan', 
    'Frank', 'Fred', 
    'Gary', 'George', 'Gerald', 'Gordon', 'Greg', 'Harry', 'Henry', 
    'Jack', 'Jacob', 'James', 'Jason', 'Jeff', 'Jeremy', 'Jerry', 'Jesse', 'Jim', 'Jimmy', 'Joe', 'John', 'Jonathan', 'Jordan', 'Jose', 'Joseph', 'Juan', 'Justin', 
    'Keith', 'Ken', 'Kevin', 'Kyle', 
    'Larry', 'Leon', 'Lewis', 'Logan', 'Louis', 
    'Mark', 'Martin', 'Matthew', 'Michael', 'Mike', 'Nathan', 'Neil', 'Nicholas', 'Noah', 
    'Patrick', 'Paul', 'Peter', 'Philip', 
    'Randy', 'Ray', 'Raymond', 'Richard', 'Robert', 'Roger', 'Ronald', 'Roy', 'Ryan', 
    'Sam', 'Samuel', 'Scott', 'Sean', 'Shane', 'Shawn', 'Stephen', 'Steve', 'Steven', 
    'Terry', 'Thomas', 'Tim', 'Timothy', 'Todd', 'Tom', 'Tony', 'Tyler', 
    'Vincent', 
    'Walter', 'Wayne', 'Will', 'William', 'Willie', 
    'Zachary'
  ];

  private humanSurnames = [
    'Smith', 'Johnson', 'Williams', 'Brown', 'Jones', 'Garcia', 'Miller', 'Davis', 'Rodriguez', 'Martinez', 
    'Hernandez', 'Lopez', 'Gonzalez', 'Wilson', 'Anderson', 'Thomas', 'Taylor', 'Moore', 'Jackson', 'Martin', 
    'Lee', 'Perez', 'Thompson', 'White', 'Harris', 'Sanchez', 'Clark', 'Ramirez', 'Lewis', 'Robinson', 
    'Walker', 'Young', 'Allen', 'King', 'Wright', 'Scott', 'Torres', 'Nguyen', 'Hill', 'Flores', 
    'Green', 'Adams', 'Nelson', 'Baker', 'Hall', 'Rivera', 'Campbell', 'Mitchell', 'Carter', 'Roberts', 
    'Gomez', 'Phillips', 'Evans', 'Turner', 'Diaz', 'Parker', 'Cruz', 'Edwards', 'Collins', 'Reyes', 
    'Stewart', 'Morris', 'Morales', 'Murphy', 'Cook', 'Rogers', 'Gutierrez', 'Ortiz', 'Morgan', 'Cooper', 
    'Peterson', 'Bailey', 'Reed', 'Kelly', 'Howard', 'Ramos', 'Kim', 'Cox', 'Ward', 'Richardson', 
    'Watson', 'Brooks', 'Chavez', 'Wood', 'James', 'Bennet', 'Gray', 'Mendoza', 'Ruiz', 'Hughes', 
    'Price', 'Alvarez', 'Castillo', 'Sanders', 'Patel', 'Myers', 'Long', 'Ross', 'Foster', 'Jimenez'
  ];

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
    { rarity: 'exotic', weight: 4, spread: 20 },
    { rarity: 'mystical', weight: 1, spread: 25 },
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

  private rollStat(rng: () => number, rarity: Rarity, bonus: number): number {
    // Definiere Min- und Max-Werte je Seltenheit
    const ranges: Record<Rarity, { min: number; max: number }> = {
      common: { min: 0, max: 10 },
      rare: { min: 5, max: 20 },
      epic: { min: 15, max: 35 },
      legendary: { min: 30, max: 50 },
      exotic: { min: 40, max: 75 },
      mystical: { min: 50, max: 100 },
    };
  
    const { min, max } = ranges[rarity];
    const value = Math.floor(min + rng() * (max - min + 1));
    return Math.min(max, Math.max(min, value + bonus));
  }
  
  rerollStat(character: Character, stat: keyof Stats): Character {
    const rng = makeRng(Date.now());
    const newStatValue = this.rollStat(rng, character.rarity, 0);
    
    return {
      ...character,
      stats: {
        ...character.stats,
        [stat]: newStatValue,
      },
    };
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
        strength: this.rollStat(rng, rarity, statBonus),
        speed: this.rollStat(rng, rarity, statBonus),
        stamina: this.rollStat(rng, rarity, statBonus),
        defense: this.rollStat(rng, rarity, statBonus),
      };
      

    return {
      id: uuid(),
      name: this.makeName(rng),
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

  private makeName(rng: () => number): string {
    const firstName = this.pick(rng, this.humanNames);
    const lastName = this.pick(rng, this.humanSurnames);
    return `${firstName} ${lastName}`;
  }
}
