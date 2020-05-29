import { Component, OnInit } from '@angular/core';
import {Hero} from "../hero";
import { Heroes } from "../mock-data";
import { HeroService } from "../hero.service";
import { MessageService } from "../message.service";

@Component({
  selector: 'app-heroes',
  templateUrl: './heroes.component.html',
  styleUrls: ['./heroes.component.css']
})
export class HeroesComponent implements OnInit {

  heroes: Hero[];

  constructor(private heroService: HeroService, private messageService: MessageService) { }

  getHeroes(): void {
    this.heroService.getHeroes()
      .subscribe(heroes => this.heroes = heroes);
  }

  selectedHero: Hero;
  onSelect(hero: Hero): void {
    this.messageService.add(`The hero ${hero.name} was selected`);
    this.selectedHero = hero;
  }
  ngOnInit(): void {
    this.getHeroes();
  }

}
