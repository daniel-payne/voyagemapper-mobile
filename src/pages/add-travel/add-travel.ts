import { Component, ViewChild } from '@angular/core';
import { ViewController }       from 'ionic-angular';

import { DataManager }          from '../../data/DataManager'

@Component({
  selector: 'page-add-travel',
  templateUrl: 'add-travel.html',
})
export class AddTravelPage {

  @ViewChild('airportText' ) airportText: any;
  @ViewChild('placeText'   ) placeText: any;
  @ViewChild('hotelText'   ) hotelText: any;

  matches: any = []

  stepNo:             number
  stepDescription:    string
  showAirportSearch:  boolean
  ShowAirportResults: boolean
  showReturnFlight:   boolean
  showFlightDates:    boolean
  showPlaceSearch:    boolean
  showHotelSearch:    boolean
  showConfirmation:   boolean

  leavingAirport:     any
  arrivingAirport:    any
  hasReturningFlight: boolean
  hasAccommodation:   boolean
  accommodationPlace: any
  accommodationHotel: any

  leavingDate:            string   = (new Date()).toISOString()  
  leavingOvernightFlight: boolean
  
  showTownsOption:        boolean

  constructor(
    private viewController: ViewController,     
    public  dataManager:    DataManager
  ) {
    this.step1()
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad add-travel');
  }

  step1(){
    this.stepNo             = 1
    this.stepDescription    = 'Travling from airport'
    this.showAirportSearch  = true
    this.ShowAirportResults = true
    this.showReturnFlight   = false
    this.showFlightDates    = false
    this.showPlaceSearch    = false
    this.showHotelSearch    = false
    this.showConfirmation   = false
  }

  step2(){
    this.stepNo             = 2
    this.stepDescription    = 'Travling to airport'
    this.showAirportSearch  = true
    this.ShowAirportResults = true
    this.showReturnFlight   = false
    this.showFlightDates    = false
    this.showPlaceSearch    = false
    this.showHotelSearch    = false
    this.showConfirmation   = false

    this.airportText.value  = ''
    this.matches            = []
  }

  step3(){
    this.stepNo             = 3
    this.stepDescription    = 'Is there a return flight'
    this.showAirportSearch  = false
    this.ShowAirportResults = false
    this.showReturnFlight   = true
    this.showFlightDates    = false
    this.showPlaceSearch    = false
    this.showHotelSearch    = false
    this.showConfirmation   = false

    this.airportText.value  = ''
    this.matches            = []
  }

  step4(){
    this.stepNo             = 4
    this.stepDescription    = 'Flight Dates'
    this.showAirportSearch  = false
    this.ShowAirportResults = false
    this.showReturnFlight   = false
    this.showFlightDates    = true
    this.showPlaceSearch    = false
    this.showHotelSearch    = false
    this.showConfirmation   = false
  }

  step5(){
    this.stepNo             = 5
    this.stepDescription    = 'Choose city you are staying in'
    this.showAirportSearch  = false
    this.ShowAirportResults = false
    this.showReturnFlight   = false
    this.showFlightDates    = false
    this.showPlaceSearch    = true
    this.showHotelSearch    = false
    this.showConfirmation   = false

    this.matches            = []
  }

  step6(){
    this.stepNo             = 6
    this.stepDescription    = 'Choose hotel you are staying in'
    this.showAirportSearch  = false
    this.ShowAirportResults = false
    this.showReturnFlight   = false
    this.showFlightDates    = false
    this.showPlaceSearch    = false
    this.showHotelSearch    = true
    this.showConfirmation   = false

    this.matches            = []
  }

    step7(){
    this.stepNo             = 7
    this.stepDescription    = 'Confirm Travel'
    this.showAirportSearch  = false
    this.ShowAirportResults = false
    this.showReturnFlight   = false
    this.showFlightDates    = false
    this.showPlaceSearch    = false
    this.showHotelSearch    = false
    this.showConfirmation   = true
  }

  close(){
    this.viewController.dismiss();
  }

  getAirports(searchTerm: any){
    
    if (searchTerm.length > 2){
      this.dataManager.matchAirport(searchTerm).then((results) => {
  
        this.matches =  [...results]
        
      })
    }
  } 

  chooseAirport(match){
    if (this.stepNo === 1){
      this.leavingAirport = match
      this.step2()
    } else if (this.stepNo === 2){
      this.arrivingAirport = match
      this.step3()
    }
  }

  chooseReturn(value){
    this.hasReturningFlight = value
    this.step4()   
  }

  chooseAccommodation(value){
    this.hasAccommodation = value
    this.step5()   
  }

  getCities(searchTerm: any){
    
    if (searchTerm.length > 2){
      this.dataManager.matchConurbation(searchTerm).then((results) => {
  
        this.matches =  [...results]
  
        this.stepDescription = 'Choose a city you are staying in'
        this.showTownsOption = (this.matches.length < 5)
        
      })
    }
  }

  getTowns(searchTerm: any){
    if (searchTerm.length > 2){
      this.dataManager.matchSettlement(searchTerm).then((results) => {
  
        this.matches =  [...results]
  
        this.stepDescription = 'Choose a town you are staying in'
        this.showTownsOption = false
        
      })
    }
  }

  choosePlace(match){
    this.accommodationPlace = match
    this.step6()  
    this.stepDescription    = `Choose hotel in ${match.fullName}`
  }

  getHotels(searchTerm: any){
    
    if (searchTerm.length > 2){
      this.dataManager.matchAccommodation(searchTerm, this.accommodationPlace.contextReference).then((results) => {
  
        this.matches =  [...results]
  
        this.stepDescription = 'Choose a town you are staying in'
        this.showTownsOption = false
        
      })
    }
  }

 chooseHotel(match){
    this.accommodationHotel = match
    this.step7()  

  }
}
