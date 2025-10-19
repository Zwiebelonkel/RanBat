import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { Observable } from 'rxjs';
import { User } from './models';
import { AuthService } from './services/auth.service';
import { CurrencyService } from './services/currency.service';

@Component({
  standalone: true,
  imports: [RouterModule, CommonModule],
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  title = 'ranbat';
  currentUser$: Observable<User | null>;
  gold$: Observable<number>;

  constructor(private authService: AuthService, private currencyService: CurrencyService) {
    this.currentUser$ = this.authService.currentUser$;
    this.gold$ = this.currencyService.gold$;
  }

  logout() {
    this.authService.logout();
  }
}
