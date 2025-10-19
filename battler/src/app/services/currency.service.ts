
import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { AuthService } from './auth.service';
import { switchMap, of, BehaviorSubject, tap } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class CurrencyService {
  private http = inject(HttpClient);
  private authService = inject(AuthService);
  private apiUrl = environment.apiUrl;

  private goldSubject = new BehaviorSubject<number>(0);
  public gold$ = this.goldSubject.asObservable();

  constructor() {
    this.getGold().subscribe();
  }

  getGold() {
    return this.authService.currentUser$.pipe(
      switchMap(user => {
        if (!user) {
          this.goldSubject.next(0);
          return of(null);
        }
        return this.http.get<any>(`${this.apiUrl}/currency/gold/${user.id}`).pipe(
          tap(response => {
            this.goldSubject.next(response.gold);
          })
        );
      })
    );
  }

  addGold(amount: number) {
    const currentGold = this.goldSubject.getValue();
    this.goldSubject.next(currentGold + amount);
  }

  spendGold(amount: number): boolean {
    const currentGold = this.goldSubject.getValue();
    if (currentGold >= amount) {
      this.goldSubject.next(currentGold - amount);
      return true;
    }
    return false;
  }
}
