import { Injectable } from '@angular/core';
import { Character } from '../models';

const KEY = 'rb_deck_v1';

@Injectable({ providedIn: 'root' })
export class StorageService {
  loadDeck(): Character[] {
    try {
      const raw = localStorage.getItem(KEY);
      return raw ? (JSON.parse(raw) as Character[]) : [];
    } catch {
      return [];
    }
  }
  saveDeck(deck: Character[]) {
    localStorage.setItem(KEY, JSON.stringify(deck));
  }
}
