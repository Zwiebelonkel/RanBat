import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CharacterGeneratorService } from '../../services/character-generator.service';
import { StorageService } from '../../services/storage.service';
import { Character } from '../../models';
import { CharacterCardComponent } from '../../components/character-card/character-card.component';
import { CurrencyService } from '../../services/currency.service';
import { Observable } from 'rxjs';

@Component({
  standalone: true,
  imports: [CharacterCardComponent, CommonModule],
  templateUrl: './generator.page.html',
  styleUrls: ['./generator.page.scss'],
})
export class GeneratorPage {
  last?: Character;
  deck: Character[] = [];
  gold$: Observable<number>;

  constructor(
    private gen: CharacterGeneratorService,
    private store: StorageService,
    private currency: CurrencyService
  ) {
    this.deck = this.store.loadDeck();
    this.gold$ = this.currency.gold$;
  }

  create() {
    if (this.currency.spendGold(0)) {
      const c = this.gen.generate();
      this.last = c;
    }
  }

  save() {
    if (!this.last) return;
    this.deck.unshift(this.last);
    this.store.saveDeck(this.deck);
    this.last = undefined;
  }

  deleteCard(index: number) {
    this.deck.splice(index, 1);
    this.store.saveDeck(this.deck);
  }
}
