import { Component }             from '@angular/core';
import { NavController }         from 'ionic-angular';

import { ItineraryPage }         from '../itinerary/itinerary'
import { PlacesPage }            from '../places/places'
import { PeoplePage }            from '../people/people'
import { TrackingPage }          from '../tracking/tracking'

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {   

    itineraryPage:  any;
    placesPage:     any;
    peoplePage:     any;
    trackingPage:   any;

  constructor(
    public  navCtrl:        NavController,
  ) {
    this.itineraryPage =  ItineraryPage;
    this.placesPage    =  PlacesPage;
    this.peoplePage    =  PeoplePage;
    this.trackingPage  =  TrackingPage;
  }

}
