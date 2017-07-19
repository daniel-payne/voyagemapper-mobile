import { Component } from '@angular/core'
import { IonicPage, NavController, NavParams, ModalController } from 'ionic-angular'
import { AlertController } from 'ionic-angular'
// import { DatePicker } from '@ionic-native/date-picker'

import { DataManager }    from '../../data/DataManager'
import { AddPlacePage }   from '../add-place/add-place'
import { AddTravelPage }  from '../add-travel/add-travel'

@IonicPage()
@Component({
  selector: 'page-data',
  templateUrl: 'data.html',
})
export class DataPage {

  constructor(
    public navCtrl:           NavController, 
    public navParams:         NavParams, 
    public alertController:   AlertController,
    public dataManager:       DataManager,
    public modalController:   ModalController
    // public datePicker:        DatePicker
  ) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad DataPage')
  }

  ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

  loadCache(){ 
    this.dataManager.loadCachedSession()     
  }

  ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

  loadUser(){  

    let prompt = this.alertController.create({
      title: 'Login',
      inputs: [
        {
          name: 'email',
          placeholder: 'EMail',
          value: 'testuser@test.net'
        },
         {
          name: 'password',
          placeholder: 'Password',
          type: 'password',
          value: '123'
        },
      ],
      buttons: [
        {
          text: 'Login',
          handler: data => {
            this.dataManager.loadUserSession(data.email, data.password) 
          }
        }
      ]
    })

    prompt.present()   

  }

  ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

  loadRevoke(){

     this.dataManager.loadRevokeSession() 
        
  }

  ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

  loadPosition(){    

    this.dataManager.loadCurrentPosition() 

  }

  ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  
  private findCities = (searchTerm, targetPrompt, falloverPrompt?) => {

    if (searchTerm.length === 0){
      return
    }

    this.dataManager.matchConurbation(searchTerm).then((results) => {
      targetPrompt.data.inputs.length = 0

      results.forEach((item, i) =>{
        targetPrompt.data.inputs.push({
          type: 'radio',
          value: item,
          label: item.fullName,
          checked: i===0
        })
      })

      if (this.dataManager.conurbationMatches.length > 0){
        targetPrompt.present()
      } else if (falloverPrompt) {
        this.findTowns(searchTerm, falloverPrompt)
      }
      
    })
  }

  ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

  private findTowns = (searchTerm, targetPrompt) => {

    if (searchTerm.length === 0){
      return
    }

    this.dataManager.matchSettlement(searchTerm).then((results) => {
      targetPrompt.data.inputs.length = 0

      results.forEach((item, i) =>{
        targetPrompt.data.inputs.push({
          type: 'radio',
          value: item,
          label: item.fullName,
          checked: i===0
        })
      })

      targetPrompt.present()
    })

  }

  ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

  private findAirports = (searchTerm, targetPrompt) => {

    if (searchTerm.length === 0){
      return
    }

    this.dataManager.matchAirport(searchTerm).then((results) => {
      targetPrompt.data.inputs.length = 0

      results.forEach((item, i) =>{
        targetPrompt.data.inputs.push({
          type: 'radio',
          value: item,
          label: item.fullName,
          checked: i===0
        })
      })

      targetPrompt.present()
    })

  }

  ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

  private findAccommodations = (searchTerm, context, targetPrompt) => {

    if (searchTerm.length === 0){
      return
    }

    this.dataManager.matchAccommodation(searchTerm, context).then((results) => {
      targetPrompt.data.inputs.length = 0

      results.forEach((item, i) =>{
        targetPrompt.data.inputs.push({
          type: 'radio',
          value: item,
          label: item.fullName,
          checked: i===0
        })
      })

      targetPrompt.present()
    })

  }

  ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

  addPlace(){    

    let addPlaceModal = this.modalController.create(AddPlacePage);
    
    addPlaceModal.present();

  }

  ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

  addTravel(){

    let addTravelModal = this.modalController.create(AddTravelPage);
    
    addTravelModal.present();

  }

  ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}
