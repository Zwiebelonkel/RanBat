import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Character } from '../../models';

@Component({
  selector: 'app-character-card',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './character-card.component.html',
  styleUrls: ['./character-card.component.scss'],
})
export class CharacterCardComponent {
  @Input() c!: Character;
  get total() {
    const s = this.c.stats;
    return s.strength + s.speed + s.stamina + s.defense;
  }
}
