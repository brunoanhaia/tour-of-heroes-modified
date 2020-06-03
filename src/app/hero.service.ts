import { Injectable } from '@angular/core';
import { Hero } from "./hero";
import {Observable, of, pipe} from "rxjs";
import { MessageService } from "./message.service";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import {catchError, map, subscribeOn, tap, timestamp} from 'rxjs/operators';
import {StartupService} from "./startup.service";

@Injectable({
  providedIn: 'root'
})
export class HeroService {
  localHeroes: any;
  currentId: number = 0;

  constructor(private messageService: MessageService, private  startupService: StartupService, private http: HttpClient) {
    this.localHeroes = this.startupService.startupData;
    console.log(typeof (this.localHeroes));
  }

  getHeroes(): Observable<Hero[]> {
    return of(this.localHeroes);
  }

  getHero(id: number): Observable<Hero> {
    return of(this.localHeroes.find(hero => hero.id == id));
  }

  updateHero(hero: Hero): Observable<any> {
    return of(this.localHeroes.indexOf(hero)).pipe(
      tap(_ => this.log(`updated hero id=${hero.id}`)),
      catchError(this.handleError<any>('updateHero'))
    );
  }

  addHero(hero: Hero): Observable<Hero> {
    return of(<Hero> {id: this.getNextId(), name: hero.name});
  }

  // addHero(hero: Hero): Observable<Hero> {
    //
    //   return of(this.createHero(hero.name));
    // }
    //
    // private createHero(name: string): Hero {
    //   return this.localHeroes.push((<Hero> {id: this.getNextId(), name: name}));
    // }

  deleteHero(hero: Hero): Observable<Hero> {
    const id = typeof hero === 'number' ? hero : hero.id;

    return of(this.localHeroes = this.localHeroes.filter(h => h != hero )).pipe(
      tap(_ => this.log(`deleted hero id=${id}`)),
      catchError(this.handleError<Hero>('deleteHero'))
    );
  }

  searchHeroes(term: string): Observable<Hero[]> {
    if (!term.trim()) {
      // if not search term, return empty hero array.
      return of([]);
    }
    return of(this.localHeroes.filter(h => h.name == term)).pipe(
      tap(x => x.length ?
        this.log(`found heroes matching "${term}"`) :
        this.log(`no heroes matching "${term}"`)),
      catchError(this.handleError<Hero[]>('searchHeroes', []))
    );
  }

  private log(message: string) : void {
    this.messageService.add(`HeroService: ${message}`)
  }

  getNextId(): number {
    while (this.localHeroes.find(hero => hero.id == this.currentId)){
      this.currentId++;
    }
    return this.currentId;
  }

  private handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {
      // TODO: send the error to remote logging infrastructure
      console.error(error); // log to console instead

      // TODO: better job of transforming error for user consumption
      this.log(`${operation} failed: ${error.message}`);

      // Let the app keep running by returning an empty result.
      return of(result as T);
    };
  }
}
