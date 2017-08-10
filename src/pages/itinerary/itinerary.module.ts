import { NgModule }        from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ItineraryPage }   from './itinerary';
import { MaterialIconsModule }                          from 'ionic2-material-icons'

import { PipesModule }         from '../../pipes/pipes.module';

@NgModule({
  declarations: [
    ItineraryPage,
  ],
  imports: [
    IonicPageModule.forChild(ItineraryPage),
    PipesModule,
    MaterialIconsModule
  ],
  exports: [
    ItineraryPage
  ]
})
export class ItineraryPageModule {}
