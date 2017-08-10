import { Component }                           from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

import { DataManager }     from '../../data/DataManager'

@IonicPage()
@Component({
  selector: 'page-information',
  templateUrl: 'information.html',
})
export class InformationPage {

  selectedSegement: string = 'COUNTY'
  displayIndicdents: any[] = undefined

  constructor(
    private  navCtrl:          NavController, 
    private  navParams:        NavParams,
    private  dataManager:      DataManager,
  ) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad InformationPage');
  }

  selectionChanged(event){
    let context = this.dataManager.selectedPoint.context
    
    switch(this.selectedSegement) {
      case 'COUNTRY':   this.displayIndicdents = context.countryIncidents;    break;
      case 'STATE':     this.displayIndicdents = context.stateIncidents;      break;
      case 'COUNTY':    this.displayIndicdents = context.countyIncidents;     break;
    }
  }
}
