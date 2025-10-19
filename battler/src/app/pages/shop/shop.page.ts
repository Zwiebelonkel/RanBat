import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Observable } from 'rxjs';
import { Character } from '../../models';
import { CardRevealComponent } from '../../components/card-reveal/card-reveal.component';
import { CurrencyService } from '../../services/currency.service';
import { DatabaseService } from '../../services/database.service';

@Component({
  standalone: true,
  imports: [CommonModule, CardRevealComponent],
  templateUrl: './shop.page.html',
  styleUrls: ['./shop.page.scss'],
})
export class ShopPage {
  public currency = inject(CurrencyService);
  private databaseService = inject(DatabaseService);

  gold$: Observable<number>;
  showReveal = false;
  newCard?: Character;

  constructor() {
    this.gold$ = this.currency.gold$;
  }

  buyCard() {
    if (this.currency.spendGold(10)) {
        this.databaseService.addUserCard().subscribe(card => {
            if (card) {
                this.newCard = card;
                this.showReveal = true;
            }
        });
    }
  }

  onCardOpened() {
    // Nothing to do here anymore
  }
}
