import { Component, ElementRef, ViewChild } from '@angular/core';
import { NavController, NavParams, ViewController } from 'ionic-angular';

import { DataManager } from '../../data/DataManager'

@Component({
  selector: 'page-add-place',
  templateUrl: 'add-place.html', 
})
export class AddPlacePage {

  @ViewChild('searchPlace') searchPlace: ElementRef 
 
  matches: any = []

  pointType       = undefined
  showTownsOption = false

  constructor(
    private viewController: ViewController,     
    public  dataManager:       DataManager
  ) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad add-place') 
  }

  close(){
    this.viewController.dismiss()  
  }

  getCities(searchTerm: any){
    
    if (searchTerm.length > 2){
      this.dataManager.matchConurbation(searchTerm).then((results) => {
  
        this.matches =  [...results]
  
        this.pointType       = 'CON'
        this.showTownsOption = (this.matches.length < 5)
        
      })
    }
  }

  getTowns(searchTerm: any){
    
    if (searchTerm.length > 2){
      this.dataManager.matchSettlement(searchTerm).then((results) => {
  
        this.matches =  [...results]
  
        this.pointType       = 'SET'
        this.showTownsOption = false
        
      })
    }
  }

  addPlace(match){
 
    let newPoint = Object.assign( {}, match, {pointType: this.pointType} )

    this.dataManager.createPoint(newPoint) 

    this.close()
  }
}
