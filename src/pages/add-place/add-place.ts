import { Component, ElementRef, ViewChild } from '@angular/core';
import { NavController, NavParams, ViewController } from 'ionic-angular';

import { DataManager } from '../../data/DataManager'

@Component({
  selector: 'page-add-place',
  templateUrl: 'add-place.html',
})
export class AddPlacePage {

  @ViewChild('searchPlace') searchPlace: ElementRef;
 
  matches: any = []

  searchType      = 'city'
  showTownsOption = false

  constructor(
    private viewController: ViewController,     
    public  dataManager:       DataManager
  ) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad add-place');
  }

  close(){
    this.viewController.dismiss();
  }

  getCities(searchTerm: any){
    
    if (searchTerm.length > 2){
      this.dataManager.matchConurbation(searchTerm).then((results) => {
  
        this.matches =  [...results]
  
        this.searchType      = 'city'
        this.showTownsOption = (this.matches.length < 5)
        
      })
    }
  }

  getTowns(searchTerm: any){
    
    if (searchTerm.length > 2){
      this.dataManager.matchSettlement(searchTerm).then((results) => {
  
        this.matches =  [...results]
  
        this.searchType      = 'town'
        this.showTownsOption = false
        
      })
    }
  }

  addPlace(match){
    this.dataManager.addPoint(match) 

    this.close()
  }
}
