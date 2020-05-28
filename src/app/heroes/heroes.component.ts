import { Component, OnInit } from '@angular/core';
import {Hero} from "../hero";
import { Heroes } from "../mock-data";

@Component({
  selector: 'app-heroes',
  templateUrl: './heroes.component.html',
  styleUrls: ['./heroes.component.css']
})
export class HeroesComponent implements OnInit {

  heroes = Heroes;

  hero: Hero = {
    id: 1,
    name: "Batman",
    realName: "Bruce Wayne"
  };

  constructor() { }

  selectedHero: Hero;
  onSelect(hero: Hero): void {
    this.selectedHero = hero;
  }
  ngOnInit(): void {
  }

}
