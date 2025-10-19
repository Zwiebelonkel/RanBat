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
  @Input() showDelete = false;
  @Input() showReroll = false;
  @Input() isLoser = false;
  @Output() delete = new EventEmitter<void>();
  @Output() reroll = new EventEmitter<{ character: Character, stat: string }>();

  displayStats: string[] = [];
  xpForNextLevel = 0;

  ngOnInit() {
    if (this.animated) {
      this.revealStats();
    } else {
      this.displayStats = ['attack', 'health', 'speed', 'defense'];
    }
    this.xpForNextLevel = this.getExperienceForNextLevel(this.c.level);
  }

  get xpProgress() {
    if (this.xpForNextLevel === 0) return 0;
    return (this.c.xp / this.xpForNextLevel) * 100;
  }

  private getExperienceForNextLevel(level: number): number {
    return Math.floor(100 * Math.pow(level, 1.5));
  }

  revealStats() {
    const stats = ['attack', 'health', 'speed', 'defense'];
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
    return this.c.attack + this.c.speed + this.c.health + this.c.defense;
  }

  onDelete() {
    this.delete.emit();
  }

  onReroll(stat: string) {
    this.reroll.emit({ character: this.c, stat });
  }
}
