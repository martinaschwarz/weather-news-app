import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { Storage } from '@ionic/storage';
import { LocationsProvider } from '../../providers/locations/locations';

@IonicPage()
@Component({
  selector: 'page-settings',
  templateUrl: 'settings.html',
})
export class SettingsPage {

  // storage variables
  currentLoc:String;
  newLoc:String;
  tempUnit:String;

  // button variable
  savebtn:String = "Save";

  // inject all needed dependencies into the constructor
  constructor(public navCtrl: NavController, public navParams: NavParams, public storage: Storage, public loc: LocationsProvider) {
  }

  // main function to get values saved in storage and display when view loads
  ionViewWillEnter() {
    // get location from storage and display it in the "city" field
    this.storage.get("location").then((val) => {
      this.currentLoc = val;
      this.newLoc = val;
    })
    // display an error if location can't be retrieved
    .catch(error => {
      alert("Error accessing storage!");
    })

    // get temperature unit from storage and set it accordingly
    this.storage.get("temperature").then((val) => {
      // set the default unit to metric
      if (val == null) {
        val = "metric";
      }
      this.tempUnit = val;
    })
    // display an error if unit can't be retrieved
    .catch(error => {
      alert("Error accessing storage!");
    })
  }

  // function to capitalise the first letter of each word entered into the location input field when saved to storage
  // to allow users to ignose case but still match location data
  capitaliseInput(input:String){
    let words = input.split(" ").map(word => {
      return word[0].toUpperCase() + word.slice(1).toLowerCase();
    })
    return words.join(" ");
  }

  // function to save changes to the Settings page
  saveSettings() {
    // if no location was provided, display alert to user
    if (this.newLoc == null) {
      alert("Please enter a city name or press back to exit!");
    // if location was entered, save it and selected temperature unit to storage
    } else {
      this.currentLoc = this.capitaliseInput(this.newLoc);
      this.storage.set("location", this.currentLoc);
      this.storage.set("temperature", this.tempUnit); 

      // when clicking the Save button, change the value to "Saved!" ...
      this.savebtn = "Saved!";
      // ... then change it back to "Save" after given timeout
      setTimeout( () => {
        this.savebtn = "Save";
      }, 1500);
    }
  }
}
