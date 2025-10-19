import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Character } from '../models';

@Injectable({
  providedIn: 'root'
})
export class ExperienceService {

  constructor(private http: HttpClient) { }

  addExperience(character: Character, experience: number): Observable<Character> {
    character.xp += experience;
    while (character.xp >= 100) {
        character.level++;
        character.xp -= 100;
        character.attack += 1;
        character.defense += 1;
        character.speed += 1;
        character.health += 5;
    }

    return this.http.put<Character>(`/api/characters/${character.id}`, character);
  }
}
