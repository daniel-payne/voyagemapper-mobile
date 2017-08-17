import { Component } from '@angular/core'
import { IonicPage, NavController, NavParams } from 'ionic-angular'
import { AlertController, ModalController  }   from 'ionic-angular'
import { select, NgRedux     }                          from 'ng2-redux' 
// import { DatePicker } from '@ionic-native/date-picker'

import { DataConnector }         from '../../data/connector' 
import { IApplicationState }     from '../../app/app.reducer'

import { DataManager }    from '../../data/DataManager'
import { AddPlacePage }   from '../add-place/add-place'
import { AddTravelPage }  from '../add-travel/add-travel'
import { DisplayPage }    from '../display/display'

@IonicPage()
@Component({
  selector: 'page-data',
  templateUrl: 'data.html',
})
export class DataPage {

  @select(['itinerary',   'user'         ]) user$   
  @select(['itinerary',   'points'       ]) points$   
 
  @select(['geographic',  'position'     ]) position$   
  @select(['geographic',  'contexts'     ]) contexts$   
  @select(['geographic',  'countries'    ]) countries$   

  @select(['risk',        'incidents'    ]) incidents$   
 
  constructor(
    public navController:     NavController, 
    public navParams:         NavParams, 
    public alertController:   AlertController,
    public modalController:   ModalController,

    private dataConnector:    DataConnector,

    private ngRedux:          NgRedux<IApplicationState>,
    public dataManager:       DataManager,
    // public datePicker:        DatePicker
  ) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad DataPage')
  }

  ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

  openDisplay(){  
    this.navController.setRoot(DisplayPage)
  }

  ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

  startup(){  
    this.dataConnector.startup()
  }

  ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

  login(){  

    let email = this.ngRedux.getState().itinerary.user.email 

    let prompt = this.alertController.create({
      title: 'Login',
      inputs: [
        {
          name: 'email',
          placeholder: 'EMail',
          value: email
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
            this.dataConnector
                .login(data.email, data.password)
          }
        }
      ]
    })

    prompt.present()   

  }

  ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

  logout(){

    this.dataConnector.logout() 
        
  }

  ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

  refresh(){    

    this.dataConnector.refresh() 

  }

  ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  
  private findCities = (searchTerm, targetPrompt, falloverPrompt?) => {

    // if (searchTerm.length === 0){
    //   return
    // }

    // this.dataManager.matchConurbation(searchTerm).then((results) => {
    //   targetPrompt.data.inputs.length = 0

    //   results.forEach((item, i) =>{
    //     targetPrompt.data.inputs.push({
    //       type: 'radio',
    //       value: item,
    //       label: item.fullName,
    //       checked: i===0
    //     })
    //   })

    //   if (this.dataManager.conurbationMatches.length > 0){
    //     targetPrompt.present()
    //   } else if (falloverPrompt) {
    //     this.findTowns(searchTerm, falloverPrompt)
    //   }
      
    // })
  }

  ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

  private findTowns = (searchTerm, targetPrompt) => {

    // if (searchTerm.length === 0){
    //   return
    // }

    // this.dataManager.matchSettlement(searchTerm).then((results) => {
    //   targetPrompt.data.inputs.length = 0

    //   results.forEach((item, i) =>{
    //     targetPrompt.data.inputs.push({
    //       type: 'radio',
    //       value: item,
    //       label: item.fullName,
    //       checked: i===0
    //     })
    //   })

    //   targetPrompt.present()
    // })

  }

  ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

  private findAirports = (searchTerm, targetPrompt) => {

    // if (searchTerm.length === 0){
    //   return
    // }

    // this.dataManager.matchAirport(searchTerm).then((results) => {
    //   targetPrompt.data.inputs.length = 0

    //   results.forEach((item, i) =>{
    //     targetPrompt.data.inputs.push({
    //       type: 'radio',
    //       value: item,
    //       label: item.fullName,
    //       checked: i===0
    //     })
    //   })

    //   targetPrompt.present()
    // })

  }

  ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

  private findAccommodations = (searchTerm, context, targetPrompt) => {

    // if (searchTerm.length === 0){
    //   return
    // }

    // this.dataManager.matchAccommodation(searchTerm, context).then((results) => {
    //   targetPrompt.data.inputs.length = 0

    //   results.forEach((item, i) =>{
    //     targetPrompt.data.inputs.push({
    //       type: 'radio',
    //       value: item,
    //       label: item.fullName,
    //       checked: i===0
    //     })
    //   })

    //   targetPrompt.present()
    // })

  }

  ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

  addPlace(){    

    // let addPlaceModal = this.modalController.create(AddPlacePage);
    
    // addPlaceModal.present();

  }

  ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

  addTravel(){

    // let addTravelModal = this.modalController.create(AddTravelPage);
    
    // addTravelModal.present();

  }

  ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}
