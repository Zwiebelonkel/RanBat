import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StorageService } from '../../services/storage.service';
import { BattleService } from '../../services/battle.service';
import { Character } from '../../models';
import { CharacterGeneratorService } from '../../services/character-generator.service';
import { CharacterCardComponent } from '../../components/character-card/character-card.component';

@Component({
  standalone: true,
  selector: 'app-arena-page',
  imports: [CommonModule, CharacterCardComponent],
  templateUrl: './arena.page.html', // ✅ Pfad zur HTML-Datei
  styleUrls: ['./arena.page.scss'], // ✅ Pfad zur SCSS-Datei
})
export class ArenaPage {
  deck: Character[] = [];
  me?: Character;
  enemy?: Character;
  resultLog: string[] = [];
  result?: { winner: string; loser: string };

  constructor(
    private store: StorageService,
    private battle: BattleService,
    private gen: CharacterGeneratorService
  ) {
    this.deck = this.store.loadDeck();
  }

  pickMine(c: Character) {
    this.me = c;
    this.result = undefined;
    this.resultLog = [];
  }

  findEnemy() {
    this.enemy = this.gen.generate();
    this.result = undefined;
    this.resultLog = [];
  }

  fight() {
    if (!this.me || !this.enemy) return;
    const r = this.battle.fight(this.me, this.enemy);
    this.resultLog = r.log;
    if (r.winnerId === this.me.id) {
      this.me = this.battle.applyWinUpgrade(this.me);
      this.deck = this.deck.map((d) => (d.id === this.me!.id ? this.me! : d));
      this.store.saveDeck(this.deck);
      this.result = { winner: this.me.name, loser: this.enemy.name };
    } else {
      this.result = { winner: this.enemy.name, loser: this.me.name };
    }
  }
}
