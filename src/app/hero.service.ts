import { Injectable } from '@angular/core';
import { Hero } from "./hero";
import { Heroes } from "./mock-data";
import { Observable, of} from "rxjs";
import { MessageService } from "./message.service";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import {catchError, map, subscribeOn, tap, timestamp} from 'rxjs/operators';
import { config } from 'src/app/config'
import {extendConfigurationFile} from "tslint/lib/configuration";

@Injectable({
  providedIn: 'root'
})
export class HeroService {
  localHeroes : Hero[] = [];

  apiConfig = {
    params: {
      events: '310',
      limit: '100',
      ts: config.api['ts'],
      apikey: config.api['apikey'],
      hash: config.api['hash']
    }
  };
  // apiConfig.params.append(config.api);


  httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' })
  };
  private heroesUrl = `https://gateway.marvel.com/v1/public/characters`
  constructor(private messageService: MessageService, private http: HttpClient) {  }

  getHeroesFromAPI(): Observable<Hero[]> {
    return this.http.get<any>(this.heroesUrl, this.apiConfig)
      .pipe(
        tap(_ => this.log('fetched heroes')),
        map( (results: any) => results.data.results),
        map( (heroes: any) => heroes.map(hero => <Hero> {id: hero.id,name: hero.name, thumbnail: {path: hero.thumbnail.path, extension: hero.thumbnail.extension}})),
        tap( (heroes: any) => heroes.map( hero => this.localHeroes.push(hero))),
        tap( _ => console.log(this.localHeroes)),
        catchError(this.handleError<Hero[]>('getHeroes', [])),
      );
   }

  getHeroes(): Observable<Hero[]> {
    return of(this.localHeroes);
  }

  getHeroServer(id: number): Observable<Hero> {
    const url = `${this.heroesUrl}${id}`;
    return this.http.get<Hero>(url).pipe(
      tap(_ => this.log(`fetched hero id=${id}`)),
      catchError(this.handleError<Hero>(`getHero id=${id}`))
    );
  }

  getHero(id: number): Observable<Hero> {
    const url = `${this.heroesUrl}${id}`;
    return of(this.localHeroes.find(hero => hero.id == id));
  }

  updateHero(hero: Hero): Observable<any> {
    return this.http.put(this.heroesUrl, hero, this.httpOptions).pipe(
      tap(_ => this.log(`updated hero id=${hero.id}`)),
      catchError(this.handleError<any>('updateHero'))
    );
  }

  addHero(hero: Hero): Observable<Hero> {
    return this.http.post<Hero>(this.heroesUrl, hero, this.httpOptions).pipe(
      tap((newHero: Hero) => this.log(`added hero w/ id=${newHero.id}`)),
      catchError(this.handleError<Hero>('addHero'))
    );
  }

  deleteHero(hero: Hero | number): Observable<Hero> {
    const id = typeof hero === 'number' ? hero : hero.id;
    const url = `${this.heroesUrl}/${id}`;

    return this.http.delete<Hero>(url, this.httpOptions).pipe(
      tap(_ => this.log(`deleted hero id=${id}`)),
      catchError(this.handleError<Hero>('deleteHero'))
    );
  }

  searchHeroes(term: string): Observable<Hero[]> {
    if (!term.trim()) {
      // if not search term, return empty hero array.
      return of([]);
    }
    return this.http.get<Hero[]>(`${this.heroesUrl}/?name=${term}`).pipe(
      tap(x => x.length ?
        this.log(`found heroes matching "${term}"`) :
        this.log(`no heroes matching "${term}"`)),
      catchError(this.handleError<Hero[]>('searchHeroes', []))
    );
  }

  private log(message: string) : void {
    this.messageService.add(`HeroService: ${message}`)
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
