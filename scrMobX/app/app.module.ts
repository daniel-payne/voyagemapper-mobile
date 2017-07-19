import { BrowserModule }                                from '@angular/platform-browser';
import { ErrorHandler, NgModule }                       from '@angular/core';
import { IonicApp, IonicErrorHandler, IonicModule }     from 'ionic-angular';
import { SplashScreen }                                 from '@ionic-native/splash-screen';
import { StatusBar }                                    from '@ionic-native/status-bar';
import { HttpModule }                                   from '@angular/http';
import { IonicStorageModule }                           from '@ionic/storage';
import { MobxAngularModule }                            from 'mobx-angular';

import { Geolocation } from '@ionic-native/geolocation';

import { StoreManager }    from '../data/StoreManager'

import { MyApp }    from './app.component';
import { HomePage } from '../pages/home/home';

import { ItineraryPageModule }     from '../pages/itinerary/itinerary.module'
import { PlacesPageModule }        from '../pages/places/places.module'
import { PeoplePageModule }        from '../pages/people/people.module'
import { TrackingPageModule }      from '../pages/tracking/tracking.module'
import { TracingPageModule }       from '../pages/tracing/tracing.module'
import { InformationPageModule }   from '../pages/information/information.module'
import { PositionPageModule }      from '../pages/position/position.module'
import { LoginPageModule }         from '../pages/login/login.module'
import { LogoutPageModule }        from '../pages/logout/logout.module'

@NgModule({
  declarations: [
    MyApp,
    HomePage 
  ],
  imports: [
    BrowserModule,
    HttpModule,

    MobxAngularModule,
    
    IonicStorageModule.forRoot(),
    IonicModule.forRoot(MyApp),

    ItineraryPageModule,
    PlacesPageModule,
    PeoplePageModule,
    TrackingPageModule,
    TracingPageModule,
    InformationPageModule,
    PositionPageModule,
    LoginPageModule,
    LogoutPageModule,
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
    {provide: ErrorHandler, useClass: IonicErrorHandler},

    StoreManager,

    {provide: 'REST_URL', useValue: 'http://localhost:1337/'}
  ]
})
export class AppModule {
  constructor() {
    
  }
}
