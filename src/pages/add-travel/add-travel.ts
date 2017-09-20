import { Component, ViewChild } from '@angular/core' 
import { ViewController }       from 'ionic-angular' 
import  moment                  from 'moment'

// import { DatePicker } from '@ionic-native/date-picker';

// import { DataManager }          from '../../data/DataManager'

@Component({
  selector: 'page-add-travel',
  templateUrl: 'add-travel.html',
})
export class AddTravelPage {

  @ViewChild('airportText' ) airportText: any;
  @ViewChild('placeText'   ) placeText: any;
  @ViewChild('hotelText'   ) hotelText: any;

  matches: any = []

  stepNo:                   number
  stepDescription:          string
      
  showAirportSearch:        boolean
    showAirportResults:     boolean
    showHotelOnlyOption:    boolean
  showReturnFlight:         boolean
  showFlightDates:          boolean
  showPlaceSearch:          boolean
    showTownsOption:        boolean
  showHotelSearch:          boolean
  showConfirmation:         boolean  

  hasOutboundFlight:        boolean
  hasReturnFlight:          boolean
  departureAirport:         any
  arrivalAirport:           any
  
  hasAccommodation:         boolean
  accommodationPlace:       any
  accommodationHotel:       any

  departureDate:              string   = moment().toISOString() 
  outboundOvernightFlight:    boolean
  arrivalDate:                string   = moment().toISOString()  

  leavingDate:                string   = moment().toISOString()   
  ReturnOvernightFlight:      boolean
  returningDate:              string   = moment().toISOString()   

  checkinDate:                string   = moment().toISOString()  
  checkoutDate:               string   = moment().toISOString()  

  constructor(
    private viewController: ViewController,     
    // public  dataManager:    DataManager,
    // private datePicker:     DatePicker,
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
    this.showAirportResults = true
    this.showReturnFlight   = false
    this.showFlightDates    = false
    this.showPlaceSearch    = false
    this.showHotelSearch    = false
    this.showConfirmation   = false

    this.showHotelOnlyOption  = true
  }

  step2(){
    this.stepNo             = 2
    this.stepDescription    = 'Travling to airport'
    this.showAirportSearch  = true
    this.showAirportResults = true
    this.showReturnFlight   = false
    this.showFlightDates    = false
    this.showPlaceSearch    = false
    this.showHotelSearch    = false
    this.showConfirmation   = false

    this.showHotelOnlyOption  = false

    this.airportText.value  = ''
    this.matches            = []
  }

  step3(){
    this.stepNo             = 3
    this.stepDescription    = 'Is there a return flight'
    this.showAirportSearch  = false
    this.showAirportResults = false
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
    this.showAirportResults = false
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
    this.showAirportResults = false
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
    this.showAirportResults = false
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
    this.showAirportResults = false
    this.showReturnFlight   = false
    this.showFlightDates    = false
    this.showPlaceSearch    = false
    this.showHotelSearch    = false
    this.showConfirmation   = true
  }

  addPoints(){

    if (this.hasOutboundFlight === true){

      this.departureDate = this.departureDate.substr(0,11) + '01:00' 
      this.arrivalDate   = this.arrivalDate.substr(0,11)   + '01:01' 

      // this.dataManager.createPoint( Object.assign({}, this.departureAirport,   {pointType: 'FLD', dateAtPoint: this.departureDate  } )) 
      // this.dataManager.createPoint( Object.assign({}, this.arrivalAirport,     {pointType: 'FLA', dateAtPoint: this.arrivalDate    } )) 
    }

    if (this.hasAccommodation === true){

      const start    = moment(this.checkinDate  )
      const end      = moment(this.checkoutDate )
      const duration = moment.duration(end.diff(start));

      this.checkinDate = this.checkinDate.substr(0,11) + '12:00' 

      // this.dataManager.createPoint( Object.assign({}, this.accommodationHotel, {pointType: 'ACH', dateAtPoint: this.checkinDate, durationAtPoint:  Math.round(duration.asDays())   } )) 
    }

    if (this.hasReturnFlight === true){

      this.leavingDate     = this.leavingDate.substr(0,11)     + '23:00' 
      this.returningDate   = this.returningDate.substr(0,11)   + '23:01' 
 
      // this.dataManager.createPoint( Object.assign({}, this.arrivalAirport,     {pointType: 'FLD', dateAtPoint: this.leavingDate    } )) 
      // this.dataManager.createPoint( Object.assign({}, this.departureAirport,   {pointType: 'FLA', dateAtPoint: this.returningDate  } )) 
    }

    this.close();
  }

  close(){
    this.viewController.dismiss();
  }

  getAirports(searchTerm: any){
    if (this.stepNo === 1){
      this.showHotelOnlyOption = (searchTerm.length === 0);
    }

    if (searchTerm.length <= 2){
      this.matches = []
    }

    if (searchTerm.length > 2){
      // this.dataManager.matchAirport(searchTerm).then((results) => {
  
        // this.matches =  [...results]
        
      // }) 
    }
  }  

  chooseAccomodationOnly(value){

    if (value === true){
      this.hasAccommodation  = true
      this.hasOutboundFlight = false
      this.hasReturnFlight   = false

      this.step5() 
    }

  }

  chooseAirport(match){

    this.hasOutboundFlight = true

    if (this.stepNo === 1){

      this.departureAirport = match
      this.step2()

    } else if (this.stepNo === 2){

      this.arrivalAirport = match
      this.step3()

    }

  }

  chooseReturnFlight(value){
    this.hasReturnFlight = value
    this.step4()   
  }

  chooseAccommodation(value){
    this.hasAccommodation = value

    if (this.outboundOvernightFlight === true){
      this.arrivalDate = moment(this.departureDate).add(1, 'days').toISOString()
    } else {
      this.arrivalDate = this.departureDate
    }

    if (this.ReturnOvernightFlight === true){
      this.returningDate = moment(this.leavingDate).add(1, 'days').toISOString()
    } else {
      this.returningDate = this.leavingDate
    }

    if (value == true){

      this.checkinDate  = this.arrivalDate
      this.checkoutDate = this.leavingDate

      this.step5()   

    } else {

      this.step7()  

    }
  }

  getCities(searchTerm: any){
    
    if (searchTerm.length > 2){
      // this.dataManager.matchConurbation(searchTerm).then((results) => {
  
      //   this.matches =  [...results]
  
      //   this.stepDescription = 'Choose a city you are staying in'
      //   this.showTownsOption = (this.matches.length < 5)
        
      // })
    }
  }

  getTowns(searchTerm: any){
    if (searchTerm.length > 2){
      // this.dataManager.matchSettlement(searchTerm).then((results) => {
  
      //   this.matches =  [...results]
  
      //   this.stepDescription = 'Choose a town you are staying in'
      //   this.showTownsOption = false
        
      // })
    }
  }

  choosePlace(match){
    this.accommodationPlace = match
    this.step6()  
    this.stepDescription    = `Choose hotel in ${match.fullName}`
  }

  getHotels(searchTerm: any){
    
    if (searchTerm.length > 2){
      // this.dataManager.matchAccommodation(searchTerm, this.accommodationPlace.contextReference).then((results) => {
  
      //   this.matches =  [...results]
  
      //   this.stepDescription = 'Choose a town you are staying in'
      //   this.showTownsOption = false
        
      // })
    }
  }

 chooseHotel(match){
    this.accommodationHotel = match
    this.step7()  

  }

  chooseUnnamedHotel(){
    this.accommodationHotel = { 
      fullName:          'A hotel in ' + this.accommodationPlace.fullName, 
      contextReference:                  this.accommodationPlace.contextReference,
      latitude:                          this.accommodationPlace.latitude,
      longitude:                         this.accommodationPlace.longitude,
    }
    this.step7()  
  }
}
