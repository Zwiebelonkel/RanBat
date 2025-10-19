import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BattleService } from '../../services/battle.service';
import { Character } from '../../models';
import { CharacterGeneratorService } from '../../services/character-generator.service';
import { CharacterCardComponent } from '../../components/character-card/character-card.component';
import { CurrencyService } from '../../services/currency.service';
import { ExperienceService } from '../../services/experience.service';
import { trigger, state, style, transition, animate } from '@angular/animations';
import { DatabaseService } from '../../services/database.service';

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
export class ArenaPage implements OnInit {
  private databaseService = inject(DatabaseService);
  private battleService = inject(BattleService);
  private characterGenerator = inject(CharacterGeneratorService);
  private currency = inject(CurrencyService);
  private experienceService = inject(ExperienceService);

  deck: Character[] = [];
  char1?: Character;
  char2?: Character;
  resultLog: string[] = [];
  result?: { winner: string; loser: string };

  ngOnInit() {
    this.loadDeck();
    this.newOpponent();
  }

  loadDeck() {
    this.databaseService.getUserCards().subscribe((deck: Character[]) => {
      this.deck = deck;
      if (this.deck.length > 0) {
        this.char1 = this.deck[0];
      }
    });
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
      this.experienceService.addExperience(winner, 25);
      this.char1 = winner;
    } else {
      this.currency.spendGold(5);
    }
    this.loadDeck();
  }

  newOpponent() {
    this.result = undefined;
    this.resultLog = [];
    this.char2 = this.characterGenerator.generateCharacter();
  }
}
