import { Component } from '@angular/core';
import { RouterModule, RouterOutlet } from '@angular/router';
import { CurrencyService } from './services/currency.service';
import { Observable } from 'rxjs';
import { CommonModule } from '@angular/common';
import { ThemeService } from './services/theme.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, RouterModule, CommonModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'battler';
  gold$: Observable<number>;

  constructor(private currency: CurrencyService, private theme: ThemeService) {
    this.gold$ = this.currency.gold$;
  }
}
