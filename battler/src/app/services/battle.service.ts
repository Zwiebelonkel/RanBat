import { Injectable } from '@angular/core';
import { BattleResult, Character } from '../models';

@Injectable({ providedIn: 'root' })
export class BattleService {
  private tierMod: Record<string, number> = {
    Mensch: 1.0,
    Tier: 1.05,
    Halbgott: 1.12,
    Android: 1.15,
    Dämon: 1.18,
    Gott: 1.25,
  };

  private rarityMod: Record<string, number> = {
    common: 1.0,
    rare: 1.06,
    epic: 1.12,
    legendary: 1.2,
    exotic: 1.25,
    mystical: 1.35,
  };

  private weaponMod(weapon?: string): number {
    if (!weapon) return 1.0;
    // paar Beispiele – passe nach Belieben an
    if (['Zweihänder', 'Donnerhammer', 'Gravhammer'].includes(weapon))
      return 1.12;
    if (['Dolch', 'Schattendolch', 'Wurfmesser'].includes(weapon)) return 1.06;
    if (['Stab', 'Runenstab', 'Druidenstab', 'Plasmastab'].includes(weapon))
      return 1.08;
    return 1.04;
  }

  private powerMod(power?: string): number {
    if (!power) return 1.0;
    if (['Zeitlupe', 'Warp-Sprung', 'Schwerkraftknick'].includes(power))
      return 1.12;
    if (['Steinhaut', 'Lichtschild', 'Metallhaut'].includes(power)) return 1.1;
    if (['Berserkerwut', 'Raserei', 'Chaosfunke'].includes(power)) return 1.08;
    return 1.06;
  }

  computeRating(c: Character): number {
    const s = c.stats;
    const base =
      s.strength * 1.1 + s.speed * 1.0 + s.stamina * 1.05 + s.defense * 1.05;
    const tier = this.tierMod[c.tier] ?? 1;
    const rarity = this.rarityMod[c.rarity] ?? 1;
    const w = this.weaponMod(c.weapon);
    const p = this.powerMod(c.power);
    const levelBonus = 1 + (c.level - 1) * 0.03; // +3% je Level
    return base * tier * rarity * w * p * levelBonus;
  }

  fight(a: Character, b: Character): BattleResult {
    let ratingA = this.computeRating(a);
    let ratingB = this.computeRating(b);

    const log: string[] = [];
    const rounds = 3;
    let winsA = 0,
      winsB = 0;

    for (let r = 1; r <= rounds; r++) {
      const jitterA = ratingA * (Math.random() * 0.1 - 0.05); // ±5%
      const jitterB = ratingB * (Math.random() * 0.1 - 0.05);
      const scoreA = ratingA + jitterA;
      const scoreB = ratingB + jitterB;

      const roundWinner = scoreA >= scoreB ? a.name : b.name;
      if (roundWinner === a.name) winsA++;
      else winsB++;

      log.push(
        `Runde ${r}: ${a.name} (${scoreA.toFixed(1)}) vs ${
          b.name
        } (${scoreB.toFixed(1)}) → ${roundWinner}`
      );

      if (winsA === 2 || winsB === 2) break; // Best-of-3
    }

    const winner = winsA > winsB ? a : b;
    const loser = winsA > winsB ? b : a;

    return { winner, loser, log };
  }

  applyWinUpgrade(winner: Character): Character {
    // simpel: random Stat +1 (bis 60 cap) oder neue Power/Waffe falls fehlend
    const cap = 60;
    const canBoost: Array<keyof typeof winner.stats> = [
      'strength',
      'speed',
      'stamina',
      'defense',
    ];
    const choice = canBoost[Math.floor(Math.random() * canBoost.length)];
    winner.stats[choice] = Math.min(cap, winner.stats[choice] + 1);
    winner.level += winner.level % 5 === 0 ? 0 : 0; // optional Level-Gate
    winner.xp += 10;
    return { ...winner };
  }
}
