import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

// import { DataManager } from '../../data/DataManager'

import { HomePage }  from '../home/home' 

@IonicPage()
@Component({
  selector:    'page-login',
  templateUrl: 'login.html',
})
export class LoginPage {

  constructor(
    public navCtrl:           NavController, 
    public navParams:         NavParams, 
    // public dataManager:       DataManager
  ) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad LoginPage');
  }

  useAnonymously(){
    //this.dataManager.loadAnonymously()

    this.navCtrl.setRoot(HomePage) 
  }

}
 