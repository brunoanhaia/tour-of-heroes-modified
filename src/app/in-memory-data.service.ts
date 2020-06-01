import { Injectable } from '@angular/core';
import { InMemoryDbService } from "angular-in-memory-web-api";
import { Hero } from './hero';
import { Heroes as heroes } from "./mock-data";

@Injectable({
  providedIn: 'root'
})
export class InMemoryDataService implements  InMemoryDbService {
  createDb() {
    return {heroes};
  }

  genId(heroes: Hero[]): number {
    return heroes.length > 0 ? Math.max(...heroes.map(hero => hero.id)) + 1: 11;
  }
}
