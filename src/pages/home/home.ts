import { Component } from '@angular/core';
import { NavController, Thumbnail } from 'ionic-angular';
import { NewsPage } from '../news/news';
import { SettingsPage } from '../settings/settings';
import { Storage } from '@ionic/storage';
import { LocationsProvider } from '../../providers/locations/locations';
import { WeatherProvider } from '../../providers/weather/weather';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

  // content variables
  mainTitle:String;
  hidden:boolean = false;
  found:Boolean = false;

  // location variables
  city:String;
  country:String;
  flag:String;
  latitude:Number;
  longitude:Number;

  // weather variables
  temperature:Number;
  unit:String;
  weatherDesc:String;
  weatherIcon:String;
  wind:String;

  // inject all needed dependencies into the constructor
  constructor(public navCtrl: NavController, public storage: Storage, private loc: LocationsProvider, private weather: WeatherProvider) {}

  // refresh function calling ionViewWillEnter() to refresh content on Home page
  doRefresh(event) {
    this.ionViewWillEnter();
    setTimeout(() => {
      event.complete();
    }, 2000);
  }
  
  // function to push Settings page onto navigation stack
  showSettings() {
    this.navCtrl.push(SettingsPage);
  }

  // function to capitalise the first letter of the wind string for aesthetic purposes
  capitaliseContent(s:String){ 
    return s.substring(0, 1).toUpperCase() + s.substring(1);
  }

  // main function to display location / weather data
  ionViewWillEnter() {
    // call getLocations() and subscribe to the data received from API
    this.loc.getLocations().subscribe(data => {

      // get the value stored for the "location" key in storage
      this.storage.get("location").then(enteredVal => {
        // if no value is found in storage, set mainTitle to given message and hide page content
        if (enteredVal == null) {
          this.mainTitle = "No city selected!";
          this.hidden = true;
        } else {
          // if a value is found in storage, cycle through cities from data and check whether entered location exists
          data.forEach((element) => {
            // if location exists, display page content and set found to "true"
            if (element.capital == enteredVal) {
              this.found = true;
              this.hidden = false;
              // set the mainTitle to given value
              this.mainTitle = "News & Weather for";
              // set location variables to data received from API 
              this.city = element.capital;
              this.country = element.name.common;
              this.flag = element.flags.png;
              this.latitude = element.latlng[0];
              this.longitude = element.latlng[1];

              // call getWeatherInfo() and subscribe to data received from API; pass in latitude and longitude to get correct location data
              this.weather.getWeatherInfo(this.latitude, this.longitude).subscribe(data => {
                // set weather variables to data retrieved from API
                this.weatherDesc = data.data[0].weather.description;
                this.weatherIcon = data.data[0].weather.icon;
                this.wind = this.capitaliseContent(data.data[0].wind_cdir_full);
                
                // get the value stored for the "temperature" key in storage
                this.storage.get("temperature").then(setUnit => {
                  // display the unit selected in Settings and calculate temperature accordingly, based on metric value received from API 
                  if (setUnit == "metric") {
                    this.temperature = data.data[0].temp;
                    this.unit = "°C";
                  } else if (setUnit == "scientific") {
                    this.temperature = data.data[0].temp + 273.15;
                    this.unit = "K";
                  } else if (setUnit == "fahrenheit") {
                    this.temperature = (data.data[0].temp * (9/5)) + 32;
                    this.unit = "°F";
                  }
                })
              })
              // if found stays set to "false", display message to user, calling location from storage 
            } else if (this.found == false) {
              this.mainTitle = "Sorry, " + enteredVal + " not found! Try another city in Settings.";
              this.hidden = true;
            }
          }) 
        }
      })
    })
  }

  // function to push News page onto navigation stack
  showNews() {
    this.navCtrl.push(NewsPage);
  }
}
