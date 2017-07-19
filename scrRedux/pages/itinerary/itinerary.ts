import { Component }                           from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { select     }                          from 'ng2-redux'; 

import { InformationPage }       from '../information/information'
import { DataConnector }         from '../../data/data-connector';

@IonicPage()
@Component({
  selector: 'page-itinerary',
  templateUrl: 'itinerary.html',
})
export class ItineraryPage {

  @select(['risk', 'currentLocation'                           ]) currentLocation$      
  @select(['risk', 'currentLocation', 'locationName'           ]) locationName$      
  @select(['risk', 'currentLocation', 'contextName'            ]) contextName$      
  @select(['risk', 'currentLocation', 'countyIncidentsCount'   ]) countyIncidentsCount$      
  @select(['risk', 'currentLocation', 'stateIncidentsCount'    ]) stateIncidentsCount$      
  @select(['risk', 'currentLocation', 'countryIncidentsCount'  ]) countryIncidentsCount$     

  @select( state => state.risk.currentLocation && state.risk.currentLocation.countyIncidentsCount  === 0 ? 'secondary' : 'danger' ) countyIncidentsColor$ 
  @select( state => state.risk.currentLocation && state.risk.currentLocation.stateIncidentsCount   === 0 ? 'secondary' : 'danger' ) stateIncidentsColor$ 
  @select( state => state.risk.currentLocation && state.risk.currentLocation.countryIncidentsCount === 0 ? 'secondary' : 'danger' ) countryIncidentsColor$ 

  constructor(
    public  navCtrl:          NavController, 
    public  navParams:        NavParams,
    private dataConnector:    DataConnector,
  ) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ItineraryPage');
  }

  showInformation(locationID){
    this.dataConnector.chooseLocation(locationID)
    this.navCtrl.push(InformationPage)
  }

}
