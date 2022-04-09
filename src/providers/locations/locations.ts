import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable()
export class LocationsProvider {

  constructor(public http: HttpClient) {}

  // function to access data from restcountries API
  getLocations():Observable<any> {
    return this.http.get("https://restcountries.com/v3.1/all");
  }
}
