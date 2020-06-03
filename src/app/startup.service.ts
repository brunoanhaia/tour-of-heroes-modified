import { Injectable} from '@angular/core';
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { tap, map } from "rxjs/operators";
import { config } from "./config";
import { Hero } from "./hero";
import {MessageService} from "./message.service";

@Injectable({
  providedIn: 'root'
})
export class StartupService {

  private _localHeroes: any;
  constructor(private http: HttpClient, private messageService: MessageService) { }

  load(): Promise<any> {
    this._localHeroes = null;

    return this.http.get(config.endpoints.character, config.api).pipe(
      map((result:any) => result.data.results),
      map( (heroes: any) => heroes.map(hero => <Hero> {id: hero.id,name: hero.name, thumbnail: {path: hero.thumbnail.path, extension: hero.thumbnail.extension}})),
      tap( (heroes: any) => this.messageService.add(""))
    )
      .toPromise()
      .then((data: any) => this._localHeroes = data)
      .catch((err: any) => Promise.resolve());
  }

  get startupData(): any {
    return this._localHeroes;
  }
}
