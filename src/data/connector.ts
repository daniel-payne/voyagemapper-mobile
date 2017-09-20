import { Injectable, Inject }              from '@angular/core'
import { Http, RequestOptions, Headers  }  from '@angular/http'
import { NgRedux    }                      from 'ng2-redux'
import { Geolocation }                     from '@ionic-native/geolocation'
import { Storage }                         from '@ionic/storage'
import Immutable                           from 'immutable'
import * as moment                         from 'moment'
import 'rxjs/add/operator/toPromise';

import { IApplicationState } from '../app/app.reducer'


import { Position } from './clases/position'  
import { Context }  from './clases/context'  
import { User }     from './clases/user' 
import { Point }    from './clases/point' 
import { Country }  from './clases/country' 
import { Incident } from './clases/incident' 
import { Match }    from './clases/match' 

import { 
  loadPosition, 
  loadContext,
  loadCountry,
  clearGeographic,
} from './reducers/geographic'

import { 
//  loadIncident,
  loadIncidents,
  clearRisk,
} from './reducers/risk'

import{
  loadUser,
  loadPoint,
  clearItinerary,
} from './reducers/itinerary'


import{
  loadMatches,
  clearSearch
} from './reducers/search'


@Injectable()
export class DataConnector {

  constructor (
    private ngRedux:     NgRedux<IApplicationState>,
    private geolocation: Geolocation, 
    private storage:     Storage,
    private http:        Http,
    @Inject('REST_URL')
    private restUrl:     string
  ) {
  }

  ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  // Public Actions
  ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

  public startup = async () => {

    const user = await this.discoverUser()

    this.ngRedux.dispatch( loadUser( user || new User({}) ) )

    if (user) { 

      if (user.isActive() === true) {

        await this.reload(user)

        return true
      }
 
    } 

    await this.build()

    return false

  }

  ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

  public reload = async (user) =>{

    const newUser = await this.getRefreshSession(user)

    await this.getMatchPoints(newUser)

    await this.build()

  }
  
  ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

  public login = async (email, password) =>{

    const user: any = await this.getExistingSession(email, password)

    await this.getMatchPoints(user)

    await this.build()

  }

  ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

  public logout = async () =>{

    const user   = this.ngRedux.getState().itinerary.user

    await this.getRevokeSession(user)

    this.storage.clear()

    let newUser = new User({email: user.email })
 
    this.cacheUser(newUser)

    this.ngRedux.dispatch( loadUser(newUser) )
    this.ngRedux.dispatch( clearItinerary()  )
    this.ngRedux.dispatch( clearGeographic() )
    this.ngRedux.dispatch( clearRisk()       )

    await this.build()

  }

  ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

  public refresh = async () => {

    const position: any = await this.getCurrenPosition()
  
    if (position){

      await this.getFindContext(position.latitude, position.longitude)

      await this.build()

    }  

  }

  ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  public clearMatches = async () => {

    this.ngRedux.dispatch( clearSearch() ) 

  }
  
  ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

  public matchConurbation = async (searchTerm: string) => {

    return this.http.get(this.restUrl + `geographic/match/conurbations?text=${searchTerm}`).toPromise().then((data) => {

       let matches = data.json().map(item => new Match(item)) 

       this.ngRedux.dispatch( loadMatches(matches) )

    })

  }

  ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

  public matchSettlement = async (searchTerm: string) => {

    return this.http.get(this.restUrl + `geographic/match/settlements?text=${searchTerm}`).toPromise().then((data) => {

       let matches = data.json().map(item => new Match(item)) 

       this.ngRedux.dispatch( loadMatches(matches) )

    })

  }   
  
  ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

  public addPoint = async (newPoint: Point) => {
 
    const user = this.ngRedux.getState().itinerary.user

    if (user.isActive() === true){

      return this.postAddPoint(newPoint) 

    } else {

      if (user.pointList.indexOf(newPoint.pointId) === -1){

        let newUser = new User(user)

        newUser.pointList = `${newUser.pointList ? newUser.pointList + ',': ''}${newPoint.pointId}`
      
        this.cacheUser(newUser)        
        this.cachePoint(newPoint)

        this.ngRedux.dispatch( loadUser(newUser) )
        this.ngRedux.dispatch( loadPoint(newPoint) )
      }

    }

    this.ngRedux.dispatch( clearSearch() )

    return this.build()

  }   

  ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  // Cache Actions
  ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

  private convertFromString = (data) => {
    let item 

    if (data){
      try {
        item = JSON.parse(data)
      } catch (error) {
        console.log('Error Converting ' + data)
      }     
    } 

    return item
  }

  ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  
  private  discoverUser = async () => {

    return this.storage.get('USER').then(data => {

      let item
      let user  

      if (data){

        item = this.convertFromString(data) 
        user = new User(item)

      } 

      return user

    }) 

  }

  ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  
  private  discoverPoint = async (pointId: number) => {

    return this.storage.get(`POINT ${pointId}`).then(data => {

      let item
      let point 

      if (data){

        item  = this.convertFromString(data) 
        point = new Point(item)

      }   

      return point  

    }) 

  }

  ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  
  private  discoverContext = async (contextReference: string) => {

    return this.storage.get(`CONTEXT ${contextReference}`).then(data => {

      let item 
      let context

      if (data){

        item    = this.convertFromString(data) 
        context = new Context(item)

      }  

      return context  

    }) 

  }

  ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  
  private  discoverCountry = async (CountryNo: string) => {

    return this.storage.get(`COUNTRY ${CountryNo}`).then(data => {

      let item 
      let country

      if (data){
        item    = this.convertFromString(data) 
        country = new Country(item)
      }  

      return country  

    }) 

  }
 
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  
  private  discoverIncident = async (incidentId: string) => {

    return this.storage.get(`INCIDENT ${incidentId}`).then(data => {

      let item 
      let incident

      if (data){
        item     = this.convertFromString(data) 
        incident = new Incident(item)
      }  

      return incident  

    }) 

  }
 
  ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

  private cacheUser = async (user) => {

    this.storage.set(`USER`, JSON.stringify(user) )

  }

  ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
          
  private cacheContext = async (context) => {

    this.storage.set(`CONTEXT ${context.contextReference}`, JSON.stringify(context) )  

  }  
  
  ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

  private cachePoint = async (point) => {

    this.storage.set(`POINT ${point.pointId}`, JSON.stringify(point) )  

  }

  ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

  private cacheCountry = async (country) => {

    this.storage.set(`COUNTRY ${country.countryNo}`, JSON.stringify(country) )  

  }

  ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

  private cacheIncident = async (incident) => {

    this.storage.set(`INCIDENT ${incident.incidentId}`, JSON.stringify(incident) )  

  }
  
  ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  // HTTP Server Calls
  ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

  private getCurrenPosition = () => {

    return this.geolocation.getCurrentPosition().then((response: any) => {

      const position = new Position(response.coords)
 
      this.ngRedux.dispatch( loadPosition(position) )

      return position
     
    }).catch((error) => {

      this.ngRedux.dispatch( loadPosition({fullName: 'Can not read GPS position'}) )

      console.log('Error getting location', error)

    })

  }

  ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

  private getFindContext = (latitude: number, longitude: number) => {
    
    const oldPosition = this.ngRedux.getState().geographic.position

    return this.http.get(this.restUrl + `geographic/find/context?latitude=${latitude}&longitude=${longitude}`).toPromise().then((response: any) => {

      const data: any = response.json()[0]
      
      const newPosition = Object.assign({}, oldPosition, {
          contextReference: data.contextReference,
          fullName:         data.fullName
      })

      this.ngRedux.dispatch( loadPosition(newPosition) )

      return newPosition

    }).catch((error) => {

      console.log('Error getting find context', error)

    })

  }

  ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

  private getExistingSession = (email: string, password: string) => {

    const oldUser = this.ngRedux.getState().itinerary.user

    let headers            = new Headers()
    const authorization    = `${email}:${password}`
    const b64Authorization = window.btoa(authorization)

    headers.append('Authorization', `Basic ${b64Authorization}`) 

    return this.http.get(this.restUrl + `security/existing/session`, new RequestOptions({ headers }) ).toPromise().then((response: any) => {

          const data: any = response.json()[0]
          
          const newUser = Object.assign({}, oldUser, {
             email:   email,
             session: data.session,
             expires: data.expires
          })

          this.cacheUser(newUser)
          this.ngRedux.dispatch( loadUser(newUser) )

          return newUser

    }).catch((error) => {

      console.log(`Error getting existing session for ${email}`, error)

    })

  }
  
  ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

  private getRefreshSession = (user) => {
    

    let headers            = new Headers()

    headers.append('Session', user.session) 

    return this.http.get(this.restUrl + `security/refresh/session`, new RequestOptions({ headers }) ).toPromise().then((response: any) => {

          const data: any = response.json()[0]

          const oldUser = this.ngRedux.getState().itinerary.user
          
          const newUser = Object.assign({}, oldUser, {
             session: data.session,
             expires: data.expires
          })

          this.cacheUser(newUser)
          this.ngRedux.dispatch( loadUser(newUser) )

          return newUser

    }).catch((error) => {

      console.log(`Error getting refresh session for ${user.session}`, error)

    })

  }

  ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

  private getRevokeSession = (user) => {

    const oldUser = this.ngRedux.getState().itinerary.user
    
    const newUser = Object.assign({}, oldUser, {
        pointList:  undefined,
        session:    undefined,
        expires:    undefined
    })

    this.cacheUser(newUser)
    this.ngRedux.dispatch( loadUser(newUser) )

    if (! user.session){
      return newUser
    }

    let headers            = new Headers()

    headers.append('Session', user.session) 

    return this.http.get(this.restUrl + `security/revoke/session`, new RequestOptions({ headers }) ).toPromise().then((response: any) => {

          const data: any = response.json()[0]

          return newUser

    }).catch((error) => {

      console.log(`Error getting revoke session for ${user.session}`, error)

    })

  }

  ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

  private getMatchPoints = (user) => {
    let headers            = new Headers()

    headers.append('Session', user.session) 

    return this.http.get(this.restUrl + `itinerary/match/points`, new RequestOptions({ headers }) ).toPromise().then((response: any) => {

          const data: any = response.json()

          const oldUser = this.ngRedux.getState().itinerary.user
          
          const newUser = Object.assign({}, oldUser, {
             pointList: data.map(item => item.pointId.toString()).join(','), 
          })

          this.cacheUser(newUser)
          this.ngRedux.dispatch( loadUser(newUser) )

          return newUser

    }).catch((error) => {

      console.log(`Error getting refresh session for ${user.session}`, error)

    })

  }

  ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

  private getListPoints = (guid, list) => {
    let headers            = new Headers()

    headers.append('Session', guid) 

    return this.http.get(this.restUrl + `itinerary/list/points?list=${list}`, new RequestOptions({ headers }) ).toPromise().then((response: any) => {

          const data: any = response.json()

          data.forEach(item => {

            let point = new Point(item)

             this.cachePoint(point) 
             this.ngRedux.dispatch( loadPoint(point) )
          })
 

    }).catch((error) => {

      console.log(`Error getting list points for ${list}`, error)

    })

  }

  ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

  private getListContexts = (list) => {

    return this.http.get(this.restUrl + `geographic/list/contexts?list=${list}` ).toPromise().then((response: any) => {

          const data: any = response.json()

          data.forEach(item => {
            const context = new Context(item)
             
            this.cacheContext(context) 
            this.ngRedux.dispatch( loadContext(context) )
          })
 

    }).catch((error) => {

      console.log(`Error getting list contexts for ${list}`, error)

    })

  }

  ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

  private getListCountries = (list) => {

    return this.http.get(this.restUrl + `geographic/list/countries?list=${list}` ).toPromise().then((response: any) => {

          const data: any = response.json()

          data.forEach(item => {
            const country = new Country(item)
             
            this.cacheCountry(country) 
            this.ngRedux.dispatch( loadCountry(country) )
          })
 

    }).catch((error) => {

      console.log(`Error getting list contexts for ${list}`, error)

    })

  }

 ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

  private getListIncidents = (list) => {

    return this.http.get(this.restUrl + `risk/list/incidents?list=${list}` ).toPromise().then((response: any) => {

          const data: any = response.json()

          let incidents = []

          data.forEach(item => {
            const incident = new Incident(item)
             
            this.cacheIncident(incident) 
            
            incidents.push(incident)
          })

          this.ngRedux.dispatch( loadIncidents(incidents) )
 

    }).catch((error) => {

      console.log(`Error getting list contexts for ${list}`, error)

    })

  }
  ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

  private getMatchIncidents = (countryNo) => {

    return this.http.get(this.restUrl + `risk/match/incidents?countryNo=${countryNo}&lookBackInMonths=36` ).toPromise().then((response: any) => {

          const data: any = response.json()[0]

          return data.incidentList

    }).catch((error) => {

      console.log(`Error getting match incidents for ${countryNo}`, error)

    })

  }
  ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

  postAddPoint = (point) => {  
    
    const user = this.ngRedux.getState().itinerary.user

    let headers   = new Headers()

    headers.append('session', user.session)  

    return this.http.post(this.restUrl + `itinerary/add/point`, point, new RequestOptions({ headers })).toPromise().then((data) => {

      let item = data.json()[0]

      let newPoint =  new Point(item)
      
      this.cachePoint(newPoint)

      this.ngRedux.dispatch( loadPoint(newPoint) )

    })

  }

  ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  // Build Calls
  ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

  private build = async () => {

    await this.hydratePoints()
    await this.hydrateContexts()
    await this.hydrateCountries()
    await this.hydrateIncidents()

  }

  private hydratePoints = async () => {
   
    const user   = this.ngRedux.getState().itinerary.user

    if (! user.pointList){
      return
    }

    let   ids    = user.pointList.split(',')

    let promises = []

    ids.forEach(id => {
      promises.push( this.discoverPoint(id) )
    })

    await Promise.all(promises).then(points => {
        
      points.forEach(point => {
        if (point) {
                  
          this.ngRedux.dispatch( loadPoint(point) )

          ids = ids.filter(id => id !== point.pointId) 
        }
      })

    })

    if (ids.length > 0){
     
      return this.getListPoints(user.session, ids.join(','))
   
    }
    
  }

  ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

  private hydrateContexts = async () => {

    const user     = this.ngRedux.getState().itinerary.user
    const position = this.ngRedux.getState().geographic.position
    const points   = this.ngRedux.getState().itinerary.points.toArray()

    let references: string[]    = []
    let promises:   any[]       = []

    points.forEach(point => {
      if (references.indexOf( point.contextReference ) === -1){
        references.push(point.contextReference)
      }
    })

    if (position.contextReference){
      if (references.indexOf( position.contextReference ) === -1){
        references.push(position.contextReference)
      }
    }

    if (references.length === 0){
      return
    }

    references.forEach(reference => {
      promises.push( this.discoverContext(reference) )
    })

   await Promise.all(promises).then(contexts => {
        
      contexts.forEach(context => {
        if (context) {
          this.ngRedux.dispatch( loadContext(context) )
          
          references = references.filter(reference => reference !== context.contextReference) 
        }
      })

    })

   if (references.length > 0){
     
      return this.getListContexts(references.join(','))
   
    }

  }

  ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

  private hydrateCountries = async () => {

    const contexts = this.ngRedux.getState().geographic.contexts.toArray()

    let countryNos          = []
    let promises            = []

    contexts.forEach(context => {
      if (countryNos.indexOf( context.countryNo ) === -1){
        countryNos.push(context.countryNo)
      }
    })

    if (countryNos.length === 0){
      return
    }

    countryNos.forEach(countryNo => {
      promises.push( this.discoverCountry(countryNo) )
    })

   await Promise.all(promises).then(countries => {
        
      countries.forEach(country => {
        if (country) {
          this.ngRedux.dispatch( loadCountry(country) )

          countryNos = countryNos.filter(countryNo => countryNo !== country.countryNo) 
        }
      })

    })

   if (countryNos.length > 0){
     
      return this.getListCountries(countryNos.join(','))
   
    }

  }

  ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

  private hydrateIncidents = async () => {
    const countries = this.ngRedux.getState().geographic.countries.toArray()

    let incidentIds          = []
    let promises             = []

    countries.forEach(country => {
      promises.push( this.getMatchIncidents(country.countryNo) )
    })

   await Promise.all(promises).then(items => {
        
      items.forEach(item => {
        if (item) {
          incidentIds.push( ...item.split(',') ) 
        }
      })

    })

    promises = []

    incidentIds.forEach(incidentId => {
      promises.push( this.discoverIncident(incidentId) )
    })

    await Promise.all(promises).then(incidents => {
      
      let newIncidents = []

      incidents.forEach(incident => {
        if (incident) {
          newIncidents.push(incident)
          incidentIds = incidentIds.filter(incidentId => incidentId !== incident.incidentId) 
        }
      })

      this.ngRedux.dispatch( loadIncidents(newIncidents) )

    })

   if (incidentIds.length > 0){
     
      return this.getListIncidents(incidentIds.join(','))
   
    }

  }

  ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

  private buildDisplay = async () => {

  }

  ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

  
}
