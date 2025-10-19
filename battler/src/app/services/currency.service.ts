import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class CurrencyService {
  private goldSubject = new BehaviorSubject<number>(0);
  gold$ = this.goldSubject.asObservable();
  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) {
    this.getGold().subscribe();
  }

  getGold(): Observable<number> {
    return this.http.get<number>(`${this.apiUrl}/api/currency/gold`).pipe(
      tap(gold => this.goldSubject.next(gold))
    );
  }

  addGold(amount: number): Observable<number> {
    return this.http.post<number>(`${this.apiUrl}/api/currency/add`, { amount }).pipe(
      tap(newGold => this.goldSubject.next(newGold))
    );
  }

  spendGold(amount: number): Observable<boolean> {
    return this.http.post<boolean>(`${this.apiUrl}/api/currency/spend`, { amount }).pipe(
      tap(success => {
        if (success) {
          this.getGold().subscribe();
        }
      })
    );
  }
}
