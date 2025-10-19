import { Component, Input, Output, EventEmitter, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Character } from '../../models';
import { CharacterCardComponent } from '../character-card/character-card.component';
import { trigger, state, style, transition, animate } from '@angular/animations';
import * as confetti from 'canvas-confetti';

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
export class CardRevealComponent implements AfterViewInit {
  @Input() c!: Character;
  @Output() opened = new EventEmitter<void>();
  @ViewChild('confettiCanvas') confettiCanvas!: ElementRef<HTMLCanvasElement>;

  isRevealed = false;
  private myConfetti: confetti.CreateTypes | undefined;

  ngAfterViewInit() {
    if (this.confettiCanvas) {
      this.myConfetti = confetti.create(this.confettiCanvas.nativeElement, {
        resize: true,
        useWorker: true
      });
    }
  }

  reveal() {
    if (this.isRevealed) return;
    this.isRevealed = true;

    if (this.c.rarity === 'mystical' && this.myConfetti) {
      this.triggerConfetti();
    }

    setTimeout(() => {
        this.opened.emit();
    }, 500); // sync with animation
  }

  triggerConfetti() {
    if (!this.myConfetti) {
      return;
    }

    const duration = 5 * 1000;
    const animationEnd = Date.now() + duration;
    const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 0 };

    function randomInRange(min: number, max: number) {
      return Math.random() * (max - min) + min;
    }

    const interval: any = setInterval(() => {
      const timeLeft = animationEnd - Date.now();

      if (timeLeft <= 0) {
        return clearInterval(interval);
      }

      const particleCount = 50 * (timeLeft / duration);
      // since particles fall down, start a bit higher than random
      this.myConfetti!({ ...defaults, particleCount, origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 } });
      this.myConfetti!({ ...defaults, particleCount, origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 } });
    }, 250);
  }
}
