import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Character } from '../../models';
import { CharacterCardComponent } from '../../components/character-card/character-card.component';
import { CurrencyService } from '../../services/currency.service';
import { Observable } from 'rxjs';
import { DatabaseService } from '../../services/database.service';
import { CharacterGeneratorService } from '../../services/character-generator.service';

@Component({
  standalone: true,
  imports: [CharacterCardComponent, CommonModule],
  templateUrl: './generator.page.html',
  styleUrls: ['./generator.page.scss'],
})
export class GeneratorPage implements OnInit {
  last?: Character;
  deck: Character[] = [];
  gold$: Observable<number>;

  constructor(
    private databaseService: DatabaseService,
    private currency: CurrencyService,
    private characterGenerator: CharacterGeneratorService,
  ) {
    this.gold$ = this.currency.gold$;
  }

  ngOnInit() {
    this.loadDeck();
  }

  loadDeck() {
    this.databaseService.getUserCards().subscribe(deck => this.deck = deck);
  }

  create() {
    if (this.currency.spendGold(0)) {
      this.last = this.characterGenerator.generateCharacter();
    }
  }

  save() {
    if (this.last) {
      this.databaseService.saveUserCard(this.last).subscribe(() => {
        this.deck.push(this.last!)
        this.last = undefined;
      });
    }
  }

  deleteCard(index: number) {
    this.deck.splice(index, 1);
    this.databaseService.saveDeck(this.deck).subscribe();
  }
}
