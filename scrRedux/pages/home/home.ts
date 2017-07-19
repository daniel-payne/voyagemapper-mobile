import { Component }             from '@angular/core';
import { NavController }         from 'ionic-angular';
//import { Geolocation }         from '@ionic-native/geolocation';
import { select     }            from 'ng2-redux';
//import { Observable }          from 'rxjs/Observable';

import { ItineraryPage }         from '../itinerary/itinerary'
import { PlacesPage }            from '../places/places'
import { PeoplePage }            from '../people/people'
import { TrackingPage }          from '../tracking/tracking'

//import {ILocation}             from '../../data/risk-reducer';
import { DataConnector }         from '../../data/data-connector';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

    @select(['risk', 'currentLocation' ]) documentsStream       

    itineraryPage:  any;
    placesPage:     any;
    peoplePage:     any;
    trackingPage:   any;

  constructor(
    public  navCtrl:        NavController,
    private dataConnector:  DataConnector
  ) {
    this.itineraryPage =  ItineraryPage;
    this.placesPage    =  PlacesPage;
    this.peoplePage    =  PeoplePage;
    this.trackingPage  =  TrackingPage;

    dataConnector.getCurrentLocation()
  }

}
