import { Component }                           from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

@IonicPage()
@Component({
  selector: 'page-information',
  templateUrl: 'information.html',
})
export class InformationPage {

  selectedSegement: string = 'COUNTY'

  constructor(public navCtrl: NavController, public navParams: NavParams) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad InformationPage');
  }

  selectionChanged(event){
    switch(this.selectedSegement) {
      // case 'COUNTRY':   this.selected$ = this.countryIncidents$;    break;
      // case 'STATE':     this.selected$ = this.stateIncidents$;      break;
      // case 'COUNTY':    this.selected$ = this.countyIncidents$;     break;
    }
  }
}
