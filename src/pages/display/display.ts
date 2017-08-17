import { Component }                          from '@angular/core' 
import { NavController, NavParams }           from 'ionic-angular'
import { AlertController, ModalController  }  from 'ionic-angular'
import { select, NgRedux     }                from 'ng2-redux' 

import { DataConnector }         from '../../data/connector' 
import { IApplicationState }     from '../../app/app.reducer'

import { DataPage }    from '../data/data'

@Component({
  selector: 'page-display',
  templateUrl: 'display.html',
})
export class DisplayPage {

  constructor(
    public navController:     NavController, 
    public navParams:         NavParams,
    public alertController:   AlertController,
    public modalController:   ModalController,

    private dataConnector:    DataConnector,
    private ngRedux:          NgRedux<IApplicationState>,
  ) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad DisplayPage');
  }

  ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

  openData(){  
    this.navController.setRoot(DataPage)
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
  
}
