import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CharacterGeneratorService } from '../../services/character-generator.service';
import { StorageService } from '../../services/storage.service';
import { Character } from '../../models';
import { CharacterCardComponent } from '../../components/character-card/character-card.component';

@Component({
  standalone: true,
  imports: [CharacterCardComponent, CommonModule],
  templateUrl: './generator.page.html',
  styleUrls: ['./generator.page.scss'],
})
export class GeneratorPage {
  last?: Character;
  deck: Character[] = [];

  constructor(
    private gen: CharacterGeneratorService,
    private store: StorageService
  ) {
    this.deck = this.store.loadDeck();
  }

  create() {
    const c = this.gen.generate();
    this.last = c;
  }

  save() {
    if (!this.last) return;
    this.deck.unshift(this.last);
    this.store.saveDeck(this.deck);
  }
}
