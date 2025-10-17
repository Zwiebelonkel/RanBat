import { Component } from '@angular/core';
import { StorageService } from '../../services/storage.service';
import { Character } from '../../models';
import { CharacterCardComponent } from '../../components/character-card/character-card.component';

@Component({
  standalone: true,
  imports: [CharacterCardComponent],
  template: `
    <h2>Sammlung</h2>
    <div style="display:flex; flex-wrap:wrap; gap:12px;">
      <app-character-card *ngFor="let c of deck" [c]="c"></app-character-card>
    </div>
  `,
})
export class CollectionPage {
  deck: Character[] = [];
  constructor(private store: StorageService) {
    this.deck = this.store.loadDeck();
  }
}
