import { Injectable, Inject } from '@angular/core'

import { Storage }            from '@ionic/storage'; 
import { Geolocation }        from '@ionic-native/geolocation';
import { Http }               from '@angular/http';

import 'rxjs/add/operator/toPromise';

import { findCountryName }    from './countries'

const POSITION = 'POSITION'

function extractCountryNo(fromContext){ 
  return parseInt(fromContext.split(':')[0], 10)
}

function extractPointFromData(data){

    const names = data.fullName.split(',')

    const countryNo = extractCountryNo(data.contextReference)

    return {
      type:                   data.type,
      id:                     data.id,

      primaryName:            names[0],
      fullName:               data.fullName,
      secondaryName:          names.slice(1).join(','),
      contextReference:       data.contextReference,              

      tzId:                   data.tzId,

      countryNo,
    }
}

@Injectable()
export class DataManager {

  session:        any      = { isAnonymous: true }

  currentPosition: any     = {latitude: undefined, longitude: undefined, point: {pointId: 0, type: POSITION, fullName: 'Position Unknown'}}

  countries:      any[]    = []
  points:         any[]    = [this.currentPosition.point]
  incidents:      any[]    = []

  lookbackInMonths: number = 36

  conurbationMatches:   any[] = []
  settlementMatches:    any[] = []
  airportMatches:       any[] = []
  accommodationMatches: any[] = []

  constructor(
    private storage:     Storage,
    private geolocation: Geolocation,
    private http:        Http,
    @Inject('REST_URL')
    private restUrl:     string
  ){
  }

  ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

  loadCachedSession(){
    this.storage.get('SESSION').then((data) => {
      if (data){
        Object.assign(this.session, data)  
      }
    })


    this.storage.keys().then(keys => {

      keys.forEach(key => {
        if (key.indexOf('POINT') === 0){
          this.storage.get(key).then((data) => {
            let countryNo = extractCountryNo(data.contextReference)

            this.findCountry(countryNo)
            this.points.push(data) 
          })
        }
      })

    })
  }

  ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

  loadRevokeSession(){
    this.http.get(this.restUrl + `security/revoke/sessions?sessionCode=${this.session.sessionCode}`)
      .subscribe((response: any) => { 

          const data: any = response.json()[0];

          Object.assign(this.session, data, {isAnonymous: true, guid: undefined})

      });

    this.storage.remove('SESSION')
  }

  ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

  loadUserSession(email, password){
      this.http.get(this.restUrl + `security/existing/sessions?email=${email}&password=${password}`)
        .subscribe((response: any) => { 
 
            const data: any = response.json()[0];

            Object.assign(this.session, data, {isAnonymous: false})

            this.storage.set('SESSION', this.session)

        });
  }

  ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

  loadCurrentPosition() {
    this.geolocation.getCurrentPosition().then((resp) => {
      this.currentPosition.latitude          = resp.coords.latitude  
      this.currentPosition.longitude         = resp.coords.longitude
      this.currentPosition.point.fullName    = 'Loading latitude & longitude'     

      this.http.get(this.restUrl + `geographic/find/contexts?latitude=${resp.coords.latitude}&longitude=${resp.coords.longitude}`)
        .subscribe((response: any) => { 
 
            const data: any = response.json()[0];

            const newPoint = extractPointFromData(data)
            const oldPoint = this.findPoint(POSITION)

            this.findCountry(newPoint.countryNo)

            Object.assign(oldPoint, newPoint, {type: POSITION})

            this.checkIncidentLists()

        });

    }).catch((error) => {
      console.log('Error getting contexts', error); 
    });
  }

  ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  
  matchConurbation(text){
    return this.http.get(this.restUrl + `geographic/match/conurbations?text=${text}`).toPromise().then((data) => {
      let results = []

      data.json().forEach(item => {
        if (! results.find(match => match.fullName === item.fullName) ){
          results.push(item)
        }
      })

      this.conurbationMatches.length = 0 
      this.conurbationMatches.push.apply(this.conurbationMatches, results);

      return results
    })
  }

  ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

  matchSettlement(text){
    return this.http.get(this.restUrl + `geographic/match/settlements?text=${text}`).toPromise().then((data) => {
      let results = []

      data.json().forEach(item => {
        if (! results.find(match => match.fullName === item.fullName) ){
          results.push(item)
        }
      })

      this.settlementMatches.length = 0 
      this.settlementMatches.push.apply(this.settlementMatches, results);

      return results
    })
  }
    
  ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

  matchAirport(text){
    return this.http.get(this.restUrl + `geographic/match/airports?text=${text}`).toPromise().then((data) => {
      let results = []

      data.json().forEach(item => {
        if (! results.find(match => match.fullName === item.fullName) ){
          results.push(item)
        }
      })

      this.airportMatches.length = 0 
      this.airportMatches.push.apply(this.airportMatches, results);

      return results
    })
  }///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

  matchAccommodation(text, context){
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

      this.accommodationMatches.length = 0 
      this.accommodationMatches.push.apply(this.airportMatches, results);

      return results
    })
  }

  ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

  addPoint(point){
    let countryNo = extractCountryNo(point.contextReference)
    let found = this.findPoint(point.type, point.fullName)
    this.findCountry(countryNo)

    Object.assign(found, point) 

    this.storage.set('POINT'+ found.fullName, found) 

    this.checkIncidentLists()

    if (! this.session.isAnonymous){
      this.http.post(this.restUrl + `itinerary/ass/points?session=${this.session.guid}`, found)
        .subscribe((response: any) => { 
        });
    }

  }

  ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

  private checkIncidentLists(){

    let countriesMissingIncidents = []

    this.countries.forEach(item => {
      if (! item.incidentList){
        countriesMissingIncidents.push(item)
      }
    })

    countriesMissingIncidents.forEach(item => {
          this.http.get(this.restUrl + `risk/match/incidents?countryNo=${item.countryNo}&lookBackInMonths=${this.lookbackInMonths}`)
            .subscribe((response: any) => { 

              const data: any = response.json()[0];

              let promises = []

              item.listCreatedUTC   = data.listCreatedUTC
              item.incidentList     = data.incidentList

              if (item.incidentList  && item.incidentList.length > 0 ){

                item.incidentList .split(',').forEach(item => {
                  let found = this.findIncident(item)

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

              Promise.all(promises).then(() => this.checkIncidentCache())
              
              return item.incidentList
          })
    })

  }

  ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

  private checkIncidentCache(){
     let missingList = []

     this.incidents.forEach(item => {
       if (! item.incidentType){
         missingList.push(item.incidentId)
       }
     })

     if (missingList.length > 0){
        this.http.get(this.restUrl + `risk/list/incidents?list=${missingList.join(',')}`)
          .subscribe((response: any) => { 

            const data: any = response.json();

            data.forEach(item => {
              let found = this.findIncident(item.incidentId)

              Object.assign(found, item)

              this.storage.set('INCIDENT'+ found.incidentId, found)
            })

            return data
        })
     }

  }

  ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

  private findPoint(type, fullName?){

    let found =  this.points.find(match => {
      if (match.type === type) {
        if (fullName && match.fullName === fullName){
          return match
        } else if (! fullName){
          return match
        }
      }
    })

    if (! found){
      found = {type, fullName}

      this.points.push(found)
    }

    return found
  }

  ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

  private findCountry(countryNo){
    let found =  this.countries.find(match => match.countryNo === countryNo)

    if (! found){
      let name = findCountryName(countryNo)

      found = {countryNo, name}

      this.countries.push(found)
    }

    return found
  }

  ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

  private findIncident(incidentId){
    let found =  this.incidents.find(match => match.incidentId === incidentId)

    if (! found){

      found = {incidentId}

      this.incidents.push(found)
    }

    return found
  }

  ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}