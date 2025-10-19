import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Observable } from 'rxjs';
import { Character } from '../../models';
import { CardRevealComponent } from '../../components/card-reveal/card-reveal.component';
import { CurrencyService } from '../../services/currency.service';
import { CharacterGeneratorService } from '../../services/character-generator.service';
import { DatabaseService } from '../../services/database.service';

@Component({
  standalone: true,
  imports: [CommonModule, CardRevealComponent],
  templateUrl: './shop.page.html',
  styleUrls: ['./shop.page.scss'],
})
export class ShopPage {
  gold$: Observable<number>;
  showReveal = false;
  newCard?: Character;

  constructor(
    public currency: CurrencyService,
    private characterGenerator: CharacterGeneratorService,
    private databaseService: DatabaseService,
  ) {
    this.gold$ = this.currency.gold$;
  }

  buyCard() {
    if (this.currency.spendGold(10)) {
      this.newCard = this.characterGenerator.generateCharacter();
      this.showReveal = true;
    }
  }

  onCardOpened() {
    if (this.newCard) {
      this.databaseService.saveUserCard(this.newCard).subscribe();
    }
  }
}
