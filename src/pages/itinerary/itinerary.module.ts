import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ItineraryPage } from './itinerary';

@NgModule({
  declarations: [
    ItineraryPage,
  ],
  imports: [
    IonicPageModule.forChild(ItineraryPage),
  ],
  exports: [
    ItineraryPage
  ]
})
export class ItineraryPageModule {}
