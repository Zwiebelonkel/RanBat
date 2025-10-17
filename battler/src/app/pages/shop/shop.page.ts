import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Character } from '../../models';
import { CharacterGeneratorService } from '../../services/character-generator.service';
import { StorageService } from '../../services/storage.service';
import { CurrencyService } from '../../services/currency.service';
import { CardRevealComponent } from '../../components/card-reveal/card-reveal.component';

@Component({
  standalone: true,
  selector: 'app-shop-page',
  imports: [CommonModule, CardRevealComponent],
  templateUrl: './shop.page.html',
  styleUrls: ['./shop.page.scss'],
})
export class ShopPage {
  newCard?: Character;
  showReveal = false;

  constructor(
    private characterGenerator: CharacterGeneratorService,
    private storage: StorageService,
    public currency: CurrencyService
  ) {}

  buyCard() {
    if (this.currency.spendGold(10)) {
      this.newCard = this.characterGenerator.generate();
      this.showReveal = true;
    }
  }

  onCardOpened() {
    if (this.newCard) {
      const deck = this.storage.loadDeck();
      deck.push(this.newCard);
      this.storage.saveDeck(deck);
      this.showReveal = false;
      this.newCard = undefined;
    }
  }
}
