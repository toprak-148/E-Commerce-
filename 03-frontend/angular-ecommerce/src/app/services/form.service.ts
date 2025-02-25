import { Injectable } from '@angular/core';
import { Observable , of} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class FormService {

  constructor() { }

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

}
