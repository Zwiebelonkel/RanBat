import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StorageService } from '../../services/storage.service';
import { BattleService } from '../../services/battle.service';
import { Character } from '../../models';
import { CharacterGeneratorService } from '../../services/character-generator.service';
import { CharacterCardComponent } from '../../components/character-card/character-card.component';
import { CurrencyService } from '../../services/currency.service';
import { trigger, state, style, transition, animate } from '@angular/animations';

@Component({
  standalone: true,
  selector: 'app-arena-page',
  imports: [CommonModule, CharacterCardComponent],
  templateUrl: './arena.page.html',
  styleUrls: ['./arena.page.scss'],
  animations: [
    trigger('slideIn', [
      state('void', style({ transform: 'translateY(-100%)', opacity: 0 })),
      transition(':enter', [animate('300ms ease-out', style({ transform: 'translateY(0)', opacity: 1 }))]),
    ]),
  ],
})
export class ArenaPage {
  deck: Character[] = [];
  char1?: Character;
  char2?: Character;
  resultLog: string[] = [];
  result?: { winner: string; loser: string };

  constructor(
    private storage: StorageService,
    private battleService: BattleService,
    private characterGenerator: CharacterGeneratorService,
    private currency: CurrencyService
  ) {
    this.deck = this.storage.loadDeck();
    if (this.deck.length > 0) {
      this.char1 = this.deck[0];
    }
    this.char2 = this.characterGenerator.generate();
  }

  selectCharacter(index: string) {
    this.char1 = this.deck[parseInt(index, 10)];
  }

  fight() {
    if (!this.char1 || !this.char2) return;
    const { winner, loser, log } = this.battleService.fight(this.char1, this.char2);
    this.result = { winner: winner.name, loser: loser.name };
    this.resultLog = log;

    if (winner.id === this.char1.id) {
      this.currency.addGold(10);
    } else {
      this.currency.spendGold(5);
    }
  }

  newOpponent() {
    this.result = undefined;
    this.resultLog = [];
    this.char2 = this.characterGenerator.generate();
  }
}
