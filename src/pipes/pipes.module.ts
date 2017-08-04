import { NgModule }        from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ItineraryPage }   from './itinerary';

import { TypeIconPipe }         from '../pipes/type-icon/type-icon';
import { IncidentColorPipe }    from '../pipes/incident-color/incident-color';

@NgModule({
  declarations: [
    TypeIconPipe,
    IncidentColorPipe
  ],
  imports: [
  ],
  exports: [
    TypeIconPipe,
    IncidentColorPipe
  ]
})
export class PipesModule {}