import { Injectable } from '@angular/core';
import { Character } from '../models';

const DECK_KEY = 'rb_deck_v1';
const GOLD_KEY = 'rb_gold_v1';

@Injectable({ providedIn: 'root' })
export class StorageService {
  loadDeck(): Character[] {
    try {
      const raw = localStorage.getItem(DECK_KEY);
      return raw ? (JSON.parse(raw) as Character[]) : [];
    } catch {
      return [];
    }
  }

  saveDeck(deck: Character[]) {
    localStorage.setItem(DECK_KEY, JSON.stringify(deck));
  }

  loadGold(): number {
    try {
      const raw = localStorage.getItem(GOLD_KEY);
      return raw ? parseInt(raw, 10) : 200;
    } catch {
      return 200;
    }
  }

  saveGold(gold: number) {
    localStorage.setItem(GOLD_KEY, gold.toString());
  }
}
