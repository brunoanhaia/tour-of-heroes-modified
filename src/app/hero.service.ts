import { Injectable } from '@angular/core';
import { Hero } from "./hero";
import { Heroes } from "./mock-data";
import { Observable, of} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class HeroService {

  constructor() { }

  getHeroes(): Observable<Hero[]> {
    return of (Heroes);
  }
}
