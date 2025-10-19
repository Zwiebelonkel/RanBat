import { Injectable } from '@angular/core';
import { Character } from '../models';

@Injectable({
  providedIn: 'root'
})
export class CharacterGeneratorService {

  constructor() { }

  generateCharacter(): Character {
    return {
      id: new Date().toISOString(),
      name: 'test',
      seed: Math.random(),
      rarity: 'common',
      tier: 'Mensch',
      race: 'Human',
      attack: 1,
      defense: 1,
      speed: 1,
      health: 1,
      level: 1,
      xp: 0,
      createdAt: Date.now(),
    };
  }
}
