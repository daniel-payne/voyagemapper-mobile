import { Component  }                                                  from '@angular/core';
import { IonicPage, NavController, NavParams, ModalController }        from 'ionic-angular';

import { InformationPage }       from '../information/information'
import { AddTravelPage }         from '../add-travel/add-travel'

import { DataManager }     from '../../data/DataManager'

@IonicPage()
@Component({
  selector: 'page-itinerary',
  templateUrl: 'itinerary.html',
})
export class ItineraryPage {

  constructor(
    private  navController:          NavController, 
    private  navParams:              NavParams,
    // private  dataManager:            DataManager,
    public   modalController:        ModalController,
  ) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ItineraryPage');
  }

  ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

  showInformation(target){
    // this.dataManager.choosePoint(target)
    
    this.navController.push(InformationPage)
  }

  ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

  refresh(){    

    // this.dataManager.refresh() 

  }
  
  ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

  addTravel(){

    let addTravelModal = this.modalController.create(AddTravelPage);
    
    addTravelModal.present();

  }

  ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////


}
