import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthService } from './auth.service';
import { Character } from '../models';

@Injectable({
  providedIn: 'root',
})
export class DatabaseService {
  private apiUrl = 'https://ranbat.onrender.com/data';

  constructor(private http: HttpClient, private authService: AuthService) {}

  saveUserCard(card: Character): Observable<any> {
    const userId = this.authService.currentUserValue?.id;
    return this.http.post(`${this.apiUrl}/card/${userId}`, { card });
  }

  getUserCards(): Observable<Character[]> {
    const userId = this.authService.currentUserValue?.id;
    return this.http.get<Character[]>(`${this.apiUrl}/cards/${userId}`);
  }

  saveDeck(deck: any[]): Observable<any> {
    const userId = this.authService.currentUserValue?.id;
    return this.http.post(`${this.apiUrl}/deck/${userId}`, { deck });
  }

  loadDeck(): Observable<any> {
    const userId = this.authService.currentUserValue?.id;
    return this.http.get(`${this.apiUrl}/deck/${userId}`);
  }
}
