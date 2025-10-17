import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Character } from '../../models';

@Component({
  selector: 'app-character-card',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './character-card.component.html',
  styleUrls: ['./character-card.component.scss'],
})
export class CharacterCardComponent implements OnInit {
  @Input() c!: Character;
  @Input() animated = false;
  @Output() delete = new EventEmitter<void>();

  displayStats: string[] = [];

  ngOnInit() {
    if (this.animated) {
      this.revealStats();
    } else {
      this.displayStats = ['strength', 'stamina', 'speed', 'defense'];
    }
  }

  revealStats() {
    const stats = ['strength', 'stamina', 'speed', 'defense'];
    let i = 0;
    const interval = setInterval(() => {
      this.displayStats.push(stats[i]);
      i++;
      if (i >= stats.length) {
        clearInterval(interval);
      }
    }, 500);
  }

  get total() {
    const s = this.c.stats;
    return s.strength + s.speed + s.stamina + s.defense;
  }

  onDelete() {
    this.delete.emit();
  }
}
