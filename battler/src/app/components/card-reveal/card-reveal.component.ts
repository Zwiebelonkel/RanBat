import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Character } from '../../models';
import { CharacterCardComponent } from '../character-card/character-card.component';
import { trigger, state, style, transition, animate } from '@angular/animations';

@Component({
  selector: 'app-card-reveal',
  standalone: true,
  imports: [CommonModule, CharacterCardComponent],
  templateUrl: './card-reveal.component.html',
  styleUrls: ['./card-reveal.component.scss'],
  animations: [
    trigger('slideOpen', [
      state('closed', style({ transform: 'translateY(0)' })),
      state('open', style({ transform: 'translateY(-100%)' })),
      transition('closed => open', animate('500ms ease-in-out')),
    ]),
  ],
})
export class CardRevealComponent {
  @Input() c!: Character;
  @Output() opened = new EventEmitter<void>();

  isRevealed = false;

  reveal() {
    if (this.isRevealed) return;
    this.isRevealed = true;
    setTimeout(() => {
        this.opened.emit();
    }, 500); // sync with animation
  }
}
