import { BrowserModule }                                from '@angular/platform-browser'
import { ErrorHandler, NgModule }                       from '@angular/core'
import { IonicApp, IonicErrorHandler, IonicModule }     from 'ionic-angular'
import { SplashScreen }                                 from '@ionic-native/splash-screen'
import { StatusBar }                                    from '@ionic-native/status-bar'
// import { DatePicker }                                   from '@ionic-native/date-picker';
import { HttpModule }                                   from '@angular/http'
import { IonicStorageModule }                           from '@ionic/storage'
import { StoreEnhancer }                                from 'redux'
import { NgReduxModule, NgRedux }                       from 'ng2-redux';

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
import { DisplayPageModule }       from '../pages/display/display.module'
import { AddPlacePageModule }      from '../pages/add-place/add-place.module'
import { AddTravelPageModule }     from '../pages/add-travel/add-travel.module'

import { IApplicationState, rootReducer, initialState}  from './app.reducer';
import { DataConnector }                                from '../data/connector';

let devtools: StoreEnhancer<IApplicationState> =
  window['devToolsExtension'] ?
  window['devToolsExtension']() : f => f;

@NgModule({
  declarations: [
    MyApp,
    HomePage
  ],
  imports: [
    BrowserModule,
    HttpModule,
    NgReduxModule,

    IonicStorageModule.forRoot(),
    IonicModule.forRoot(MyApp, {}, {
      links: [
      //  { component: DataPageModule,       name: 'Data',       segment: 'data'    },
      //  { component: DisplayPageModule,    name: 'Display',    segment: 'display' }
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
    DisplayPageModule,
    
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
    DataConnector,

    {provide: 'REST_URL', useValue: 'http://localhost:1337/'}
  ]
})
export class AppModule {
  constructor(ngRedux: NgRedux<IApplicationState>) {
    ngRedux.configureStore(rootReducer, initialState, [], [devtools] );
  }
}
