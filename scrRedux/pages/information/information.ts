import { Component }                           from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { select     }                          from 'ng2-redux';

@IonicPage()
@Component({
  selector: 'page-information',
  templateUrl: 'information.html',
})
export class InformationPage {

  @select(['risk', 'selectedLocation'                           ]) selectedLocation$   

  @select(['risk', 'selectedLocation', 'countryIncidents'       ]) countryIncidents$  
  @select(['risk', 'selectedLocation', 'stateIncidents'         ]) stateIncidents$ 
  @select(['risk', 'selectedLocation', 'countyIncidents'        ]) countyIncidents$ 

  selectedSegement: string = 'COUNTY'
  selected$

  constructor(public navCtrl: NavController, public navParams: NavParams) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad InformationPage');
    this.selected$ = this.countyIncidents$ 
  }

  selectionChanged(event){
    switch(this.selectedSegement) {
      case 'COUNTRY':   this.selected$ = this.countryIncidents$;    break;
      case 'STATE':     this.selected$ = this.stateIncidents$;      break;
      case 'COUNTY':    this.selected$ = this.countyIncidents$;     break;
    }
  }
}
