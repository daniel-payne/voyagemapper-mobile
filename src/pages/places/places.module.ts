import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { PlacesPage } from './places';

import { PipesModule }         from '../../pipes/pipes.module';

@NgModule({
  declarations: [
    PlacesPage,
  ],
  imports: [
    IonicPageModule.forChild(PlacesPage),
    PipesModule
  ],
  exports: [
    PlacesPage
  ]
})
export class PlacesPageModule {}
