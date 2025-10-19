import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Character } from '../../models';
import { CharacterCardComponent } from '../../components/character-card/character-card.component';
import { CurrencyService } from '../../services/currency.service';
import { Observable } from 'rxjs';
import { DatabaseService } from '../../services/database.service';

@Component({
  standalone: true,
  imports: [CharacterCardComponent, CommonModule],
  templateUrl: './generator.page.html',
  styleUrls: ['./generator.page.scss'],
})
export class GeneratorPage implements OnInit {
  private databaseService = inject(DatabaseService);
  private currency = inject(CurrencyService);

  deck: Character[] = [];
  gold$: Observable<number>;

  constructor() {
    this.gold$ = this.currency.gold$;
  }

  ngOnInit() {
    this.loadDeck();
  }

  loadDeck() {
    this.databaseService.getUserCards().subscribe(deck => this.deck = deck);
  }

  create() {
    this.databaseService.addUserCard().subscribe(card => {
      if (card) {
        this.deck.push(card);
      }
    });
  }
}
