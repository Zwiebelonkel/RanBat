import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { AuthService } from './auth.service';
import { switchMap, of } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class CurrencyService {
  private http = inject(HttpClient);
  private authService = inject(AuthService);
  private apiUrl = environment.apiUrl;

  constructor() { }

  getGold() {
    return this.authService.currentUser.pipe(
      switchMap(user => {
        if (!user) {
          return of(null);
        }
        return this.http.get<any>(`${this.apiUrl}/currency/gold/${user.id}`);
      })
    );
  }
}
