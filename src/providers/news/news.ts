import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable()
export class NewsProvider {

  // url component variables
  cc:String;
  newsURL:string;

  constructor(public http: HttpClient) {}

  // function to access data from newsapi API
  getNewsStories(code):Observable<any> {
    // set cc to the country code variable passed into the function
    this.cc = code;

    // construct the URL with the appropriate country code
    this.newsURL = "https://newsapi.org/v2/top-headlines?country=" + this.cc + "&apiKey=de208fe3d3bc4bc8801b2de34fceed19";
    return this.http.get(this.newsURL);
  }

}
