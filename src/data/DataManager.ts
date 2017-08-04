import { Injectable, Inject }             from '@angular/core'
import { Http, RequestOptions, Headers  } from '@angular/http'

import Immutable                          from 'immutable'

import { Storage }               from '@ionic/storage'; 
import { Geolocation }           from '@ionic-native/geolocation';


import 'rxjs/add/operator/toPromise';

import { findCountryName }    from './countries'

const CURRENT_POSITION = 'CUP'

function extractContext(fromContext){ 
  const numbers = fromContext.split(':')
  let result = {
    countryNo:     undefined,
    stateNo:       undefined,
    countyNo:      undefined,
    ConurbationId: undefined,
  }

  if (numbers.length > 0) {result.countryNo     = parseInt(fromContext.split(':')[0], 10)}
  if (numbers.length > 1) {result.stateNo       = parseInt(fromContext.split(':')[1], 10)}
  if (numbers.length > 2) {result.countyNo      = parseInt(fromContext.split(':')[2], 10)}
  if (numbers.length > 3) {result.ConurbationId = parseInt(fromContext.split(':')[3], 10)}

  return result
}


@Injectable()
export class DataManager {

  authorization:   any     = { isLogedin: false, session: undefined }

  cooridnates:     any     = {}
  position:        any     = { fullName: 'Position Unknown'}

  countries:      Immutable.Map<string, any>    = Immutable.Map<string, any>()
  points:         Immutable.Map<string, any>    = Immutable.Map<string, any>()
  incidents:      Immutable.Map<string, any>    = Immutable.Map<string, any>()

  lookbackInMonths: number = 36

  conurbationMatches:   any[] = []
  settlementMatches:    any[] = []
  airportMatches:       any[] = []
  accommodationMatches: any[] = []

  currentPosition:      any   = {countryIncidents: [], stateIncidents: [], countyIncidents: []}
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
    return this.checkCachedAuthorization()
      .then(session => {

        return this.checkCachedPoints()

      }).then( () => {      

        if (this.authorization.isLogedin === true){
          return this.loadRetrevePoints()
        } 

      }).then( () => {

        this.buildIncidents()

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
 
  createPoint = (point) => {
    let countryNo = extractContext(point.contextReference).countryNo
    
    this.assignPoint(point) 
    this.findCountry(countryNo)
    this.buildIncidents(countryNo)

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

  checkCachedAuthorization = () => {

    return this.storage.get('AUTHORIZATION').then((data) => {

      if (data){

        this.authorization = data 

      }  

    })

  }

  ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

  checkCachedPoints = () => {

    return this.storage
               .keys()
               .then(keys => {

      keys.forEach(key => {
        if (key.indexOf('POINT') === 0){
          this.storage.get(key).then((data) => {
            let countryNo = extractContext(data.contextReference).countryNo

            this.findCountry(countryNo)

            this.assignPoint(data)
          })
        }
      })

    })

  }

  ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

  loadAddPoint = (point) => {  

    let headers   = new Headers()

    headers.append('session', this.authorization.session)  

    return this.http.post(this.restUrl + `itinerary/add/point`, point, new RequestOptions({ headers })).toPromise().then((data) => {

      let newPoint = data.json()[0]
      
      this.assignPoint(newPoint)
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

      this.http.get(this.restUrl + `itinerary/retrieve/points`, new RequestOptions({ headers }) ).toPromise().then((data) => {

        let newPoint = data.json().forEach( (newPoint) => {
          const countryNo = extractContext(newPoint.contextReference).countryNo

          this.findCountry(countryNo)

          this.assignPoint(newPoint)
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

    return this.http.get(this.restUrl + `geographic/find/contexts?latitude=${latitude}&longitude=${longitude}`)
                    .toPromise()
                    .then((response) => {

      const data: any = response.json()[0];

      const countryNo = extractContext(data.contextReference).countryNo

      this.findCountry(countryNo)

      this.position = Object.assign({}, this.position, data)


    });

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
      this.createIncidentHierarchy()
    })

  }

  ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

  private createIncidentHierarchy(){

    this.currentPosition     = {}
    this.itinerary           = []
    this.userPlaces          = []
    this.groupPlaces         = []
    this.memberPositions     = []

    this.currentPosition ={
       fullName:          this.position.fullName,
       contextReference:  this.position.contextReference,
       countryIncidents:  [], 
       stateIncidents:    [], 
       countyIncidents:   []
    }

    this.applyIncidentHierarchy(this.currentPosition)

    this.points.forEach(item =>{
      let newPlace = Object.assign({}, item)

      const names = newPlace.fullName.split(',')

      newPlace.primaryName   = names[0]
      newPlace.secondaryName = names.slice(1)

      const contexts = newPlace.secondaryName.slice(1)
      
      if (contexts.length  > 2) {
        newPlace.countyName    = contexts[0] 
        newPlace.stateName     = contexts[1] 
        newPlace.countryName   = contexts[2] 
      } else if (contexts.length  > 1) {
        newPlace.countyName    = contexts[0] 
        newPlace.stateName     = 'state' 
        newPlace.countryName   = contexts[1] 
      } else if (contexts.length  > 0) {
        newPlace.countyName    = 'county' 
        newPlace.stateName     = 'state' 
        newPlace.countryName   = contexts[0] 
      } else {
        newPlace.countyName    = 'county' 
        newPlace.stateName     = 'state' 
        newPlace.countryName   = 'country'
      }

      this.applyIncidentHierarchy(newPlace)

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

  }

  ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

  private applyIncidentHierarchy(target){

    if (! target.contextReference){
      return
    }

    const targetContext = extractContext(target.contextReference)
    const country   = this.findCountry(targetContext.countryNo)

    target.countyIncidents  = []
    target.stateIncidents   = []
    target.countryIncidents = [] 

    this.incidents.forEach(item => {
      const itemContext = extractContext(item.contextReference)

      if (itemContext.ConurbationId === targetContext.ConurbationId){
        target.countyIncidents.push(item)  
      } else if (item.contextReference === target.contextReference){
        target.countyIncidents.push(item)  
      } else if (itemContext.stateNo === targetContext.stateNo && itemContext.countryNo === targetContext.countryNo){
        target.stateIncidents.push(item)  
      } else if (itemContext.countryNo === targetContext.countryNo){
        target.countryIncidents.push(item)  
      }

    })


  }

  ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

  private assignPoint(point){

    let reference = point.dateAtPoint ? 
                      `${point.pointType}-${point.fullName} ${point.dateAtPoint}` 
                      : 
                      `${point.pointType}-${point.fullName}`
    
    this.points = this.points.set(reference, point)

    this.storage.set(`POINT ${reference}`, point)

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

    return found
  }

  ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

  private findCountry(countryNo){

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

  
}