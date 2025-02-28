import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable , of} from 'rxjs';
import { Country } from '../common/country';
import { State } from '../common/state';

@Injectable({
  providedIn: 'root'
})
export class FormService {

  private countryUrl:string = 'http://localhost:8080/api/countries';
  private stateUrl:string='http://localhost:8080/api/states';


  constructor(private http:HttpClient) { }

  getCreditCardMonths(startMonths:number):Observable<number[]>
  {
    let data : number[] = [];

    //* build an array for month dropdown list
    //* - start at desired startMonth and loop until 12

    for(let theMonth = startMonths ; theMonth <= 12 ; theMonth++)
    {
      data.push(theMonth);
    }

    return of(data);
  }

  getCreditCardYears():Observable<number[]>{
    let data:number[] = [];

    //* build an array for 'year' dropdown list
    //* - start at current year and loop for next 10
    const startYear :number = new Date().getFullYear();
    const endYear:number = startYear +10;

    for(let theYear = startYear; theYear <= endYear ; theYear++)
      data.push(theYear);

    return of(data);

  }

  getCountries():Observable<Country[]>
  {
    return this.http.get<GetResponseCountries>(this.countryUrl).pipe(
      map(response => response._embedded.countries)
    )

  }

  getStates(theCountryCode:string):Observable<State[]>
  {
    //search url
    const searcStatesUrl : string = `${this.stateUrl}/search/findByCountryCode?code=${theCountryCode}`;
    return this.http.get<GetResponseStates>(searcStatesUrl).pipe(
      map( response => response._embedded.states)
    )
  }

}

interface GetResponseCountries{
  _embedded:{
    countries:Country[];
  }
}

interface GetResponseStates{
  _embedded:{
    states:State[];
  }
}
