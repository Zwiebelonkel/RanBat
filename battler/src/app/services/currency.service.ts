import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { StorageService } from './storage.service';

@Injectable({ providedIn: 'root' })
export class CurrencyService {
  private gold = new BehaviorSubject<number>(0);
  gold$ = this.gold.asObservable();

  constructor(private storage: StorageService) {
    this.gold.next(this.storage.loadGold());
  }

  addGold(amount: number) {
    const currentGold = this.gold.getValue();
    const newGold = currentGold + amount;
    this.gold.next(newGold);
    this.storage.saveGold(newGold);
  }

  spendGold(amount: number): boolean {
    const currentGold = this.gold.getValue();
    if (currentGold >= amount) {
      const newGold = currentGold - amount;
      this.gold.next(newGold);
      this.storage.saveGold(newGold);
      return true;
    }
    return false;
  }
}
