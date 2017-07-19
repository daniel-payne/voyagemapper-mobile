import { Component  }                                 from '@angular/core';
import { IonicPage, NavController, NavParams }        from 'ionic-angular';

import { InformationPage }       from '../information/information'

import { StoreManager } from '../../data/StoreManager'

@IonicPage()
@Component({
  selector: 'page-itinerary',
  templateUrl: 'itinerary.html',
})
export class ItineraryPage {

  constructor(
    public  navCtrl:          NavController, 
    public  navParams:        NavParams,
    public  storeManager:     StoreManager,
  ) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ItineraryPage');
  }

  showInformation(target){
    this.storeManager.chooseInformation(target)
    this.navCtrl.push(InformationPage)
  }

}
