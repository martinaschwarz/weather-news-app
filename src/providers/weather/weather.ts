import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable()
export class WeatherProvider { 

  // url component variables
  lat:Number;
  long:Number;
  weatherURL:string;

  constructor(public http: HttpClient) {}  

  // function to access data from weatherbit API
  getWeatherInfo(latitude, longitude):Observable<any> {
    // set lat and long to the latitude and longitude variables passed into the function
    this.lat = latitude;
    this.long = longitude;

    // construct the URL with the appropriate location data
    this.weatherURL = "https://api.weatherbit.io/v2.0/current?lat=" + this.lat + "&lon=" + this.long + "&key=46a41d94c4b0496283a500a84790939c";
    return this.http.get(this.weatherURL);
  }
}