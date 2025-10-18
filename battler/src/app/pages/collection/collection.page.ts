import { Component } from '@angular/core';
import { StorageService } from '../../services/storage.service';
import { Character, Stats } from '../../models';
import { CharacterCardComponent } from '../../components/character-card/character-card.component';
import { CommonModule } from '@angular/common';
import { CharacterGeneratorService } from '../../services/character-generator.service';
import { CurrencyService } from '../../services/currency.service';

@Component({
  standalone: true,
  imports: [CharacterCardComponent, CommonModule],
  templateUrl: './collection.page.html',
  styleUrls: ['./collection.page.scss'],
})
export class CollectionPage {
  deck: Character[] = [];
  constructor(
    private store: StorageService,
    private characterGenerator: CharacterGeneratorService,
    private currency: CurrencyService
  ) {
    this.deck = this.store.loadDeck();
  }

  deleteCard(character: Character) {
    this.deck = this.deck.filter((c) => c.id !== character.id);
    this.store.saveDeck(this.deck);
  }

  rerollStat(args: { character: Character; stat: keyof Stats }) {
    if (this.currency.spendGold(10)) {
      const updatedCharacter = this.characterGenerator.rerollStat(
        args.character,
        args.stat
      );
      const index = this.deck.findIndex((c) => c.id === args.character.id);
      if (index !== -1) {
        this.deck[index] = updatedCharacter;
        this.store.saveDeck(this.deck);
      }
    }
  }
}
