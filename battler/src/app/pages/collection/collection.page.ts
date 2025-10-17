import { Component } from '@angular/core';
import { StorageService } from '../../services/storage.service';
import { Character } from '../../models';
import { CharacterCardComponent } from '../../components/character-card/character-card.component';
import { CommonModule } from '@angular/common';

@Component({
  standalone: true,
  imports: [CharacterCardComponent, CommonModule],
  templateUrl: './collection.page.html',
  styleUrls: ['./collection.page.scss'],
})
export class CollectionPage {
  deck: Character[] = [];
  constructor(private store: StorageService) {
    this.deck = this.store.loadDeck();
  }
}
