import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, Thumbnail } from 'ionic-angular';
import { LocationsProvider } from '../../providers/locations/locations';
import { Storage } from '@ionic/storage';
import { NewsProvider } from '../../providers/news/news';

@IonicPage()
@Component({
  selector: 'page-news',
  templateUrl: 'news.html',
})
export class NewsPage {
  
  // content variables
  mainTitle:String; 
  found:Boolean = false;

  // location variables
  country:String;
  code:String;

  // news variables
  newsFeed:String[];
  title:String;
  description:String;

  // inject all needed dependencies into the constructor
  constructor(public navCtrl: NavController, public navParams: NavParams, public loc: LocationsProvider, public storage: Storage, public news: NewsProvider) {
  }

  // refresh function calling ionViewDidLoad() to refresh content on News page
  doRefresh(event) {
    this.ionViewDidLoad();
    setTimeout(() => {
      event.complete();
    }, 2000);
  }

  // main function to display news data
  ionViewDidLoad() {
    // call getLocations() and subscribe to the data received from API
    this.loc.getLocations().subscribe(data => {

      // get the value stored for the "location" key in storage
      this.storage.get("location").then( enteredVal => {
        data.forEach((element) => {
          // for the city entered in storage, set the country and country code to data retrieved from API
          if (element.capital == enteredVal) {
            this.country = element.name.common;
            this.code = element.cca2;

            // call getNewsStories() and subscribe to data received from API; pass in country code
            this.news.getNewsStories(this.code).subscribe(data => {
              // if no news stories exist for a country, display given message to user
              if(data.totalResults == 0) {
                this.mainTitle = "No news from " + this.code.toUpperCase();
              // if news stories exist for a country, set the mainTitle and the news variables
              } else {
                this.mainTitle = "Latest News from " + this.country;
                this.newsFeed = data.articles;
                this.title = data.articles.title;
                this.description = data.articles.description;
              }
            })
          }
        })
      })
    })
  }
}
