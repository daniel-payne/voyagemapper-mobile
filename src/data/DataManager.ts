import { Injectable, Inject }             from '@angular/core'
import { Http, RequestOptions, Headers  } from '@angular/http'

import Immutable                          from 'immutable'

import { Storage }               from '@ionic/storage'; 
import { Geolocation }           from '@ionic-native/geolocation';


import 'rxjs/add/operator/toPromise';

import { findCountryName }    from './countries'

const CURRENT_POSITION = 'CUP'

// function extractContext(fromContext){ 
//   const numbers = fromContext.split(':')
//   let result = {
//     countryNo:     undefined,
//     stateNo:       undefined,
//     countyNo:      undefined,
//     ConurbationId: undefined,
//   }

//   if (numbers.length > 0) {result.countryNo     = parseInt(fromContext.split(':')[0], 10)}
//   if (numbers.length > 1) {result.stateNo       = parseInt(fromContext.split(':')[1], 10)}
//   if (numbers.length > 2) {result.countyNo      = parseInt(fromContext.split(':')[2], 10)}
//   if (numbers.length > 3) {result.ConurbationId = parseInt(fromContext.split(':')[3], 10)}

//   return result
// }


@Injectable()
export class DataManager {

  authorization:   any     = { isLogedin: false, session: undefined }

  cooridnates:     any     = {}
  position:        any     = { fullName: 'Position Unknown'}

  countries:      Immutable.Map<number, any>    = Immutable.Map<number, any>()
  points:         Immutable.Map<string, any>    = Immutable.Map<string, any>()
  incidents:      Immutable.Map<string, any>    = Immutable.Map<string, any>()
  contexts:       Immutable.Map<string, any>    = Immutable.Map<string, any>()

  lookbackInMonths: number = 36

  conurbationMatches:   any[] = []
  settlementMatches:    any[] = []
  airportMatches:       any[] = []
  accommodationMatches: any[] = []

  currentPosition:      any   = { context: { countryIncidents: [], stateIncidents: [], countyIncidents: [] } }
  itinerary:            any[] = []
  userPlaces:           any[] = []
  groupPlaces:          any[] = []
  memberPositions:      any[] = []

  selectedPoint:        any   = {}

  constructor(
    private storage:     Storage,
    private geolocation: Geolocation,
    private http:        Http,
    @Inject('REST_URL')
    private restUrl:     string
  ){
  }

  ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  
  startup = () => {

    return this.discoverAuthorization()
               .then(() => {
                 return this.discoverCachedPoints() 
               }).then(() => {
                 if (this.authorization.isLogedin === true){
                   return this.loadRetrevePoints()
                 } 
               }).then(() => {
                 return this.refresh()
               })
  }

  ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
 
  login = (userName, password) => {
     return this.loadUserSession(userName, password)
       .then(()=>{

          if (this.authorization.isLogedin === true){
            return this.loadRetrevePoints()
          } 

       })
        
  }

  ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
 
  logout = () => {

    this.storage.clear()

    this.countries      = this.countries.clear()
    this.points         = this.points.clear()
    this.incidents      = this.incidents.clear()

    this.authorization = {
        isLogedin:   false,
        session:     undefined
    }
      
    return this.loadRevokeAuthorization()      

  }

  ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
 
  refresh = () => {

    this.loadCurrentCooridnates()
      .then(()=>{

        if (this.cooridnates.latitude && this.cooridnates.longitude){

          return this.loadCurrentPosition(this.cooridnates.latitude, this.cooridnates.longitude) 

        }

      })
      .then(()=>{

        return this.buildIncidents()

      })
        
  }

  ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
 
  createPoint = (data) => {

    let point = this.findPoint(data.pointType, data.fullName, data.dateAtPoint)

    Object.assign(point, data)
    
    this.cachePoint(point) 

    this.buildIncidents(point.countryNo)

    if (this.authorization.isLogedin === true){

      this.loadAddPoint(point).then(() =>{   
      }) 

    }
  }

  ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
 
  choosePoint = (selectedPoint) => {
    this.selectedPoint = selectedPoint
  }

  ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
 
  discoverAuthorization = () => {

    return this.storage.get('AUTHORIZATION').then(data => {
      if (data){

          this.authorization = data 

      }  

      return this.authorization
    })

  }

  ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

  discoverCachedPoints =  () => {
    
    return this.storage.keys().then(keys => {
      let promises = []

      keys.forEach( key => {
    
        if (key.indexOf('POINT') === 0){
          
          promises.push( this.storage.get(key).then(data => {

              let point = this.findPoint(data.pointType, data.fullName, data.dateAtPoint)

              Object.assign(point, data)

              this.findContext(point.contextReference)

          }))

        } else if (key.indexOf('CONTEXT') === 0){
          
          promises.push( this.storage.get(key).then(data => {

              let context = this.findContext(data.contextReference)

              Object.assign(context, data)

          }))

        }
        
      })

      return Promise.all(promises) 
    })

  }

  ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

  loadAddPoint = (point) => {  

    let headers   = new Headers()

    headers.append('session', this.authorization.session)  

    return this.http.post(this.restUrl + `itinerary/add/point`, point, new RequestOptions({ headers })).toPromise().then((data) => {

      let newPoint = data.json()[0]

      let point = this.findPoint(newPoint.pointType, newPoint.fullName. newPoint.dateAtPoint)

      newPoint = Object.assign({}, point, newPoint)
      
      this.cachePoint(newPoint)

    })

  }
  
  ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

  loadRevokeAuthorization = () => {

    return this.http
               .get(this.restUrl + `security/revoke/sessions?session=${this.authorization.session}`)
               .toPromise()
               .then((response) => {

                 this.storage.remove('AUTHORIZATION')

               })   

  }

  ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

  loadUserSession = (email, password) => {

      return this.http
          .get(this.restUrl + `security/existing/sessions?email=${email}&password=${password}`)
          .toPromise()
          .then((response) => {
 
          const data: any = response.json()[0];

          this.authorization = {
             isLogedin:      true,
             email:          email,
             session:        data.session,
             expires:        data.expires
          }

          this.storage.set('AUTHORIZATION', this.authorization)

      });

  }

  ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

  loadRetrevePoints = () => {

    if (this.authorization.isLogedin === true){

      let headers   = new Headers()

      headers.append('session', this.authorization.session)  

      return this.http.get(this.restUrl + `itinerary/retrieve/points`, new RequestOptions({ headers }) ).toPromise().then((data) => {

        data.json().forEach( (data) => {

        let point    = this.findPoint(data.pointType, data.fullName. data.dateAtPoint)

        let newPoint = Object.assign({}, point, data)
          
        this.cachePoint(newPoint)

        })

      })
    }

  }
  
  ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

  loadCurrentCooridnates = () => {
    
    return this.geolocation.getCurrentPosition().then((resp) => {
   
      this.cooridnates = {
        latitude:           resp.coords.latitude,  
        longitude:          resp.coords.longitude,
     }

     return resp

    }).catch((error) => {
 
      this.position    = { fullName: 'GPS Position Unavaiable at present' } 

      console.log('Error getting contexts', error); 
    });
    
  }

  ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    
  loadCurrentPosition = (latitude, longitude) => {

    return this.http.get(this.restUrl + `geographic/find/context?latitude=${latitude}&longitude=${longitude}`)
                    .toPromise()
                    .then((response) => {

      const data: any = response.json()[0];

      const countryNo = +data.contextReference.split(':')[0]

      this.findCountry(countryNo)
      this.findContext(data.contextReference)

      this.position = Object.assign({}, this.position, data)

    });

  }

  ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

  loadListContexts = (list) => {

    return this.http.get(this.restUrl + `geographic/list/contexts?list=${list}`).toPromise().then((data) => {

      data.json().forEach( (item) => {
  
        let context    = this.findContext(item.contextReference)

        let words      = item.fullName.split(',')
 
        words.reverse()

        if (words.length > 0 && words[0] !== '') {item.countryName   = words[0].trim()}
        if (words.length > 1 && words[1] !== '') {item.stateName     = words[1].trim()}
        if (words.length > 2 && words[2] !== '') {item.countyName    = words[2].trim()}
        if (words.length > 3 && words[3] !== '') {item.countyName    = words[3].trim()}

        this.cacheContext(item)
        
        Object.assign(context, item)
          
      })

    })
 
  } 

  ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  
  matchConurbation = (text) => {  

    return this.http.get(this.restUrl + `geographic/match/conurbations?text=${text}`).toPromise().then((data) => {
      let results = []

      data.json().forEach(item => {
        if (! results.find(match => match.fullName === item.fullName) ){
          results.push(item)
        }
      })

      this.conurbationMatches = results 

      return results
    })

  }

  ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

  matchSettlement = (text) => {  

    return this.http.get(this.restUrl + `geographic/match/settlements?text=${text}`).toPromise().then((data) => {
      let results = []

      data.json().forEach(item => {
        if (! results.find(match => match.fullName === item.fullName) ){
          results.push(item)
        }
      })

      this.settlementMatches = results 

      return results
    })

  }
    
  ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

  matchAirport = (text) => {  
    return this.http.get(this.restUrl + `geographic/match/airports?text=${text}`).toPromise().then((data) => {
      let results = []

      data.json().forEach(item => {
        if (! results.find(match => match.fullName === item.fullName) ){
          results.push(item)
        }
      })

      this.airportMatches = results 

      return results
    })
  }
  
  ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

  matchAccommodation = (text, context) => {     
    if (text === 'ALL'){
      text=''
    }

    return this.http.get(this.restUrl + `geographic/match/accommodations?text=${text}&context=${context}`).toPromise().then((data) => {
      let results = []

      data.json().forEach(item => {
        if (! results.find(match => match.fullName === item.fullName) ){
          results.push(item)
        }
      })

      this.accommodationMatches = results 

      return results
    })
  }

  ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

  matchIncidents = (countryNo) => {  

      return new Promise((resolve, reject) => {

          this.http.get(this.restUrl + `risk/match/incidents?countryNo=${countryNo}&lookBackInMonths=${this.lookbackInMonths}`)
                   .toPromise()
                   .then((data) => {

              let list =  data.json()[0].incidentList;

              let promises = []

              if (list  && list.length > 0 ){

                list.split(',').forEach(incidentId => {
                  let found = this.findIncident(incidentId)

                  if (! found.incidentType){
                    promises.push(
                        this.storage.get('INCIDENT'+ found.incidentId).then((data) => {
                          if (data){
                            Object.assign(found, data)  
                          }
                        })
                    ) 
                  }
                })

              }

              Promise.all(promises).then(() => resolve())

          }) 

      })
  }

  ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

  listIncidents = (list) => {  
    return this.http.get(this.restUrl + `risk/list/incidents?list=${list.join(',')}`)
                   .toPromise()
                   .then((data) => {

            const items: any = data.json();

            items.forEach(item => {
              let found = this.findIncident(item.incidentId)

              Object.assign(found, item)

              if (found.contextReference){

                let numbers = found.contextReference.split(':')

                if (numbers.length > 0 && numbers[0] !== '') {found.countryNo     = parseInt(numbers[0], 10)}
                if (numbers.length > 1 && numbers[1] !== '') {found.stateNo       = parseInt(numbers[1], 10)}
                if (numbers.length > 2 && numbers[2] !== '') {found.countyNo      = parseInt(numbers[2], 10)}
                if (numbers.length > 3 && numbers[3] !== '') {found.conurbationId = parseInt(numbers[3], 10)}

              }

              this.storage.set('INCIDENT'+ found.incidentId, found)
            })

            return data
        })
  }

  ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

  private buildIncidents(countryNo?){

    let checkCountries = []

    if (countryNo){
      checkCountries.push(countryNo)
    } else {
      this.countries.forEach(item => {
        if (! item.incidentList){
          checkCountries.push(item.countryNo)
        }
      })
    }

    let promises = []

    checkCountries.forEach(item => {
       promises.push(this.matchIncidents(item))
    })

    Promise.all(promises).then(() => {

      let missingList = []

      this.incidents.forEach(item => {
        if (! item.incidentType){
          missingList.push(item.incidentId)
        }
      })    
      
      if (missingList.length > 0){
        return this.listIncidents(missingList)
      }

    }).then(() => {
      this.buildContexts()
    })

  }

  ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  
  private buildContexts(){

    let checkContexts = []

    this.contexts.forEach(item => {
      if (! item.tzId){
        checkContexts.push(item.contextReference)
      }
    })
 
    if (checkContexts.length === 0){

      this.buildDisplayData()

    } else {

      this.loadListContexts(checkContexts.join(',')).then(() => {

        this.buildDisplayData()

      })

    }

  }

  ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

  private buildDisplayData(){

    this.itinerary           = []
    this.userPlaces          = []
    this.groupPlaces         = []
    this.memberPositions     = []

    this.currentPosition ={
       fullName:          this.position.fullName,
       primaryName:       this.position.fullName.split(',')[0],
       secondaryName:     this.position.fullName.split(',').slice(1),
       contextReference:  this.position.contextReference,
       context:           this.findContext(this.position.contextReference)
    }

    this.points.forEach(item =>{
      let newPlace = Object.assign({}, item)

      const names = newPlace.fullName.split(',')

      newPlace.primaryName   = names[0]
      newPlace.secondaryName = names.slice(1)

      newPlace.context = this.findContext(item.contextReference)

      switch(newPlace.pointType) {
          case 'CON':  newPlace.pointName = 'Conurbation';       break;
          case 'SET':  newPlace.pointName = 'Settlement';        break;
          case 'FLA':  newPlace.pointName = 'Flight Arrival';    break;
          case 'FLD':  newPlace.pointName = 'Flight Departure';  break;
          case 'ACH':  newPlace.pointName = 'Hotel Stay';        break;
      }

      if (newPlace.pointType === 'ACH'){
        newPlace.durationName = newPlace.durationAtPoint + ' Days'
      }

      if (['CON', 'SET'].indexOf( newPlace.pointType) >-1 ){
        this.userPlaces.push(newPlace) 
      } else if (['FLD', 'FLA', 'ACH'].indexOf( newPlace.pointType) >-1 ){
        this.itinerary.push(newPlace) 
      }
   
    })

    this.itinerary = this.itinerary.sort((a,b) => {
      if (a.dateAtPoint < b.dateAtPoint){
        return -1
      } else if  (a.dateAtPoint > b.dateAtPoint){
        return 1
      } else {
        return 0
      }
    })

    this.contexts.forEach(context => {

      context.countyIncidents  = []
      context.stateIncidents   = []
      context.countryIncidents = [] 

      this.incidents.forEach(item => {

        if (item.conurbationId !== undefined && item.conurbationId === context.conurbationId){
          context.countyIncidents.push(item)  
        } else if (item.contextReference === context.contextReference){
          context.countyIncidents.push(item)  
        } else if (item.stateNo === context.stateNo && item.countryNo === context.countryNo){
          context.stateIncidents.push(item)  
        } else if (item.countryNo === context.countryNo){
          context.countryIncidents.push(item)  
        }

      })
    })

  }

  ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

  private cachePoint(point){

    let reference = point.dateAtPoint ? 
                      `${point.pointType}-${point.fullName} ${point.dateAtPoint}` 
                      : 
                      `${point.pointType}-${point.fullName}`
    
    this.points = this.points.set(reference, point)

    this.storage.set(`POINT ${reference}`, point)

  }

  ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

  private cacheContext(context){
   
    this.contexts = this.points.set(context.contextReference, context)

    this.storage.set(`CONTEXT ${context.contextReference}`, context)

  }

  ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

  private findPoint(pointType, fullName, dateAtPoint?){

    let reference = dateAtPoint ? 
                      `${pointType}-${fullName} ${dateAtPoint}` 
                      : 
                      `${pointType}-${fullName}`
    
    let found =  this.points.get(reference)

    if (! found){
      
      found = {pointType, fullName, dateAtPoint: dateAtPoint}

      this.points = this.points.set(reference, found)

    } 
      
    if (! found.country && found.countyNo){
      found.country = this.findCountry(found.countyNo)
    }

    if (! found.context && found.contextReference){
      found.context = this.findContext(found.contextReference)
    }

    return found
  }

  ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

  private findCountry(countryNo: number){

    let found =  this.countries.get(countryNo)

    if (! found){
      let name = findCountryName(countryNo)

      found = {countryNo, name}

      this.countries = this.countries.set(countryNo, found)
    }

    return found

  }

  ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

  private findIncident(incidentId){

    let found =  this.incidents.get(incidentId)

    if (! found){
      
      found = {incidentId}

      this.incidents = this.incidents.set(incidentId, found)
    }

    return found

  }

  ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

  private findContext(contextReference){

    let found =  this.contexts.get(contextReference)

    if (! found){
      let numbers
     
      found = {
        contextReference,

        country:       undefined,

        countryNo:     undefined,
        stateNo:       undefined,
        countyNo:      undefined,
        conurbationId: undefined,

        countyName:  'County', 
        stateName:   'State', 
        countryName: 'Country',

        countyIncidents:  [], 
        stateIncidents:   [],
        countryIncidents: [],

      }

      if (contextReference){

        let numbers = found.contextReference.split(':')

        if (numbers.length > 0 && numbers[0] !== '') {found.countryNo     = parseInt(numbers[0], 10)}
        if (numbers.length > 1 && numbers[1] !== '') {found.stateNo       = parseInt(numbers[1], 10)}
        if (numbers.length > 2 && numbers[2] !== '') {found.countyNo      = parseInt(numbers[2], 10)}
        if (numbers.length > 3 && numbers[3] !== '') {found.conurbationId = parseInt(numbers[3], 10)}

        this.contexts = this.contexts.set(contextReference, found)
      }

    }

    return found

  }

  ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

  
}