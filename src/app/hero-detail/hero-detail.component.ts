import { Component, OnInit } from '@angular/core';
import { Hero } from '../hero';
import {Input} from '@angular/core';
import { HeroService } from '../hero.service';
import { ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';

@Component({
  selector: 'app-hero-detail',
  templateUrl: './hero-detail.component.html',
  styleUrls: ['./hero-detail.component.css']
})
export class HeroDetailComponent implements OnInit {
  @Input() hero?: Hero;
  constructor(private heroService: HeroService, private route : ActivatedRoute, private location : Location) { }

  ngOnInit(): void {
    this.getHero();
  }

  getHero() {
    const paramMap = this.route.snapshot.paramMap;
    const id = Number(paramMap.get('id'));
    this.heroService.getHero(id).subscribe(h => this.hero = h);
  }

  save() {
    this.heroService.save(this.hero).subscribe(() => this.goBack());
  }
  
  goBack() {
    this.location.back();
  }
}
