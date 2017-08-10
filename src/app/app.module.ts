import { BrowserModule }                                from '@angular/platform-browser';
import { ErrorHandler, NgModule }                       from '@angular/core';
import { IonicApp, IonicErrorHandler, IonicModule }     from 'ionic-angular';
import { SplashScreen }                                 from '@ionic-native/splash-screen';
import { StatusBar }                                    from '@ionic-native/status-bar';
// import { DatePicker }                                   from '@ionic-native/date-picker';
import { HttpModule }                                   from '@angular/http';
import { IonicStorageModule }                           from '@ionic/storage';

import { Geolocation } from '@ionic-native/geolocation';

import { DataManager }     from '../data/DataManager'

import { MyApp }    from './app.component';
import { HomePage } from '../pages/home/home';

//import { ItineraryPage }     from '../pages/itinerary/itinerary'
//import { PlacesPage }        from '../pages/places/places'

import { ItineraryPageModule }     from '../pages/itinerary/itinerary.module'
import { PlacesPageModule }        from '../pages/places/places.module'
import { PeoplePageModule }        from '../pages/people/people.module'
import { TrackingPageModule }      from '../pages/tracking/tracking.module'
import { TracingPageModule }       from '../pages/tracing/tracing.module'
import { InformationPageModule }   from '../pages/information/information.module'
import { PositionPageModule }      from '../pages/position/position.module'
import { LoginPageModule }         from '../pages/login/login.module'
import { LogoutPageModule }        from '../pages/logout/logout.module'

import { DataPageModule }          from '../pages/data/data.module'
import { AddPlacePageModule }      from '../pages/add-place/add-place.module'
import { AddTravelPageModule }     from '../pages/add-travel/add-travel.module'

@NgModule({
  declarations: [
    MyApp,
    HomePage
  ],
  imports: [
    BrowserModule,
    HttpModule,

    IonicStorageModule.forRoot(),
    IonicModule.forRoot(MyApp, {}, {
      links: [
 //       { component: ItineraryPage, name: 'Itinerary', segment: 'itinerary' },
 //       { component: PlacesPage,    name: 'Places',    segment: 'places' }
      ]
    }),


    ItineraryPageModule,
    PlacesPageModule,
    PeoplePageModule,
    TrackingPageModule,
    TracingPageModule,
    InformationPageModule,
    PositionPageModule,
    LoginPageModule,
    LogoutPageModule,

    DataPageModule,
    AddPlacePageModule,
    AddTravelPageModule,
    
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    HomePage 
  ],
  providers: [
    StatusBar,
    SplashScreen,
    Geolocation,
    // DatePicker,

    {provide: ErrorHandler, useClass: IonicErrorHandler},

    DataManager,

    {provide: 'REST_URL', useValue: 'http://localhost:1337/'}
  ]
})
export class AppModule {
  constructor() {
    
  }
}
