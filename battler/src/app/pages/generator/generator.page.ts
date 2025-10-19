import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CharacterGeneratorService } from '../../services/character-generator.service';
import { StorageService } from '../../services/storage.service';
import { Character } from '../../models';
import { CharacterCardComponent } from '../../components/character-card/character-card.component';
import { CurrencyService } from '../../services/currency.service';
import { Observable } from 'rxjs';
import { CardRevealComponent } from '../../components/card-reveal/card-reveal.component';

@Component({
  standalone: true,
  imports: [CharacterCardComponent, CommonModule, CardRevealComponent],
  templateUrl: './generator.page.html',
  styleUrls: ['./generator.page.scss'],
})
export class GeneratorPage {
  deck: Character[] = [];
  gold$: Observable<number>;
  showReveal = false;
  newCard?: Character;

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
      this.newCard = c;
      this.showReveal = true;
    }
  }

  onCardOpened() {
    if (!this.newCard) return;
    this.deck.unshift(this.newCard);
    this.store.saveDeck(this.deck);
    this.newCard = undefined;
    this.showReveal = false;
  }

  deleteCard(index: number) {
    this.deck.splice(index, 1);
    this.store.saveDeck(this.deck);
  }
}
