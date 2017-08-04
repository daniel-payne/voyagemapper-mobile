import { NgModule }        from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ItineraryPage }   from './itinerary';

import { PipesModule }         from '../../pipes/pipes.module';

@NgModule({
  declarations: [
    ItineraryPage,
  ],
  imports: [
    IonicPageModule.forChild(ItineraryPage),
    PipesModule
  ],
  exports: [
    ItineraryPage
  ]
})
export class ItineraryPageModule {}
