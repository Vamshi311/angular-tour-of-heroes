import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import {Observable, of } from 'rxjs';
import {catchError, map, tap } from 'rxjs/operators'

import {Hero} from './hero';
import {HEROES} from './mock-heroes';
import {MessageService} from './message.service';

@Injectable({
  providedIn: 'root'
})
export class HeroService {
  
  private heroesUrl = 'api/heroes';  // URL to web api

  httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' })
  };

  constructor(private httpClient: HttpClient, private messageService: MessageService) { }

  getHeroes() : Observable<Hero[]> {
    const heroes =  this.httpClient.get<Hero[]>(this.heroesUrl)
    .pipe(
      tap(_ => this.log("fetched heroes")),
      catchError(this.handleError<Hero[]>('getHeroes', []))
    );
    return heroes;
  }

  getHero(id: number): Observable<Hero> {
    const url = `${this.heroesUrl}/${id}`;
    const hero = this.httpClient.get<Hero>(url)
    .pipe(
      tap(_ => this.log(`fetched hero id=${id}`)),
      catchError(this.handleError<Hero>(`getHero id = ${id}`))
    );
    return hero;
  }

  save(hero: Hero): Observable<any> {
    return this.httpClient.put(this.heroesUrl, hero, this.httpOptions)
    .pipe(
      tap(_ => this.log(`updated hero id = ${hero.id}`)),
      catchError(this.handleError<Hero>(`updated hero id = ${hero.id}`))
    );
  }

  addHero(hero:Hero) :Observable<Hero> {
    return this.httpClient.post<Hero>(this.heroesUrl, hero, this.httpOptions)
    .pipe(
      tap((newHero:Hero) => this.log(`added hero id = ${newHero.id}`)),
      catchError(this.handleError<Hero>(`addHero name = ${hero.name}`))
    );
  }

  deleteHero(id:number) :Observable<any> {
    return this.httpClient.delete<Hero>(`${this.heroesUrl}/${id}`, this.httpOptions)
    .pipe(
      tap(_ => this.log(`deleted hero id = ${id}`)),
      catchError(this.handleError<Hero>(`deleteHero id = ${id}`))
    );
  }

  searchHeroes(token :string) : Observable<Hero[]> {
    token = token.trim();
    if (!token) {
      return of([]);
    }
    return this.httpClient.get<Hero[]>(`${this.heroesUrl}/?name=${token}`)
    .pipe(
      tap(x => x.length ?
        this.log(`found heroes matching "${token}"`) :
        this.log(`no heroes matching "${token}"`)),
     catchError(this.handleError<Hero[]>('searchHeroes', []))
    );
  }

  private log(message: string): void {
    this.messageService.add(`HeroService: ${message}`);
  }

  /**
 * Handle Http operation that failed.
 * Let the app continue.
 * @param operation - name of the operation that failed
 * @param result - optional value to return as the observable result
 */
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
