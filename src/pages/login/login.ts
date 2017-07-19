import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

import { StoreManager } from '../../data/StoreManager'

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
    public storeManager:      StoreManager
  ) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad LoginPage');
  }

  useAnonymously(){
    this.storeManager.loadAnonymously()

    this.navCtrl.setRoot(HomePage) 
  }

}
 