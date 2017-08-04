import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ModalController  } from 'ionic-angular';

import { InformationPage }       from '../information/information'
import { AddPlacePage }          from '../add-place/add-place'

import { DataManager }           from '../../data/DataManager'

@IonicPage()
@Component({
  selector: 'page-places',
  templateUrl: 'places.html',
})
export class PlacesPage {

  constructor(
    private  navController:          NavController, 
    private  navParams:              NavParams,
    private  dataManager:            DataManager,
    public   modalController:        ModalController,
  ) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad PlacesPage');
  }

  ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

  showInformation(target){
    //this.dataManager.chooseInformation(target)
    this.navController.push(InformationPage)
  }

  ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

  addPlace(){    

    let addPlaceModal = this.modalController.create(AddPlacePage);
    
    addPlaceModal.present();

  }
  ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}
