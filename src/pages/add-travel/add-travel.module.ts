import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { AddTravelPage } from './add-travel';

@NgModule({
  declarations: [
    AddTravelPage,
  ],
  imports: [
    IonicPageModule.forChild(AddTravelPage),
  ],
  exports: [
    AddTravelPage
  ]
})
export class AddTravelPageModule {}
