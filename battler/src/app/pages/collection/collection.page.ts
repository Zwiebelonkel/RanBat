import { Component, OnInit } from '@angular/core';
import { Character } from '../../models';
import { CharacterCardComponent } from '../../components/character-card/character-card.component';
import { CommonModule } from '@angular/common';
import { DatabaseService } from '../../services/database.service';

@Component({
  standalone: true,
  imports: [CharacterCardComponent, CommonModule],
  templateUrl: './collection.page.html',
  styleUrls: ['./collection.page.scss'],
})
export class CollectionPage implements OnInit {
  deck: Character[] = [];
  constructor(
    private databaseService: DatabaseService,
  ) {}

  ngOnInit(): void {
    this.databaseService.getUserCards().subscribe(cards => {
      this.deck = cards;
    });
  }

  deleteCard(character: Character) {
    // This functionality should be moved to the backend
    console.log('Deleting card', character);
  }

  rerollStat(args: { character: Character; stat: string }) {
    // This functionality should be moved to the backend
    console.log('Rerolling stat', args);
  }
}
