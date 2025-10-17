import { Injectable } from '@angular/core';
import { Character } from '../models';
import { StorageService } from './storage.service';

@Injectable({ providedIn: 'root' })
export class ExperienceService {
  constructor(private storage: StorageService) {}

  addExperience(character: Character, amount: number) {
    character.experience += amount;
    if (character.experience >= this.getExperienceForNextLevel(character.level)) {
      this.levelUp(character);
    }
    this.storage.updateCharacter(character);
  }

  private levelUp(character: Character) {
    character.level++;
    character.experience = 0;
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
