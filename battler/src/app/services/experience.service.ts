import { Injectable } from '@angular/core';
import { Character } from '../models';
import { StorageService } from './storage.service';

@Injectable({ providedIn: 'root' })
export class ExperienceService {
  constructor(private storage: StorageService) {}

  addExperience(character: Character, amount: number) {
    character.xp += amount;
    let xpForNextLevel = this.getExperienceForNextLevel(character.level);
    while (character.xp >= xpForNextLevel) {
      character.xp -= xpForNextLevel;
      this.levelUp(character);
      xpForNextLevel = this.getExperienceForNextLevel(character.level);
    }
    const deck = this.storage.loadDeck();
    const charIndex = deck.findIndex(c => c.id === character.id);
    if (charIndex > -1) {
      deck[charIndex] = character;
      this.storage.saveDeck(deck);
    }
  }

  private levelUp(character: Character) {
    character.level++;
    // Improve stats
    character.stats.strength += this.getStatIncrease();
    character.stats.stamina += this.getStatIncrease();
    character.stats.speed += this.getStatIncrease();
    character.stats.defense += this.getStatIncrease();
  }

  private getStatIncrease(): number {
    return Math.floor(Math.random() * 2) + 1; // Increase by 1 or 2
  }

  private getExperienceForNextLevel(level: number): number {
    return Math.floor(100 * Math.pow(level, 1.5));
  }
}
