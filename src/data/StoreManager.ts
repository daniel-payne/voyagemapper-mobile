import { Injectable, Inject } from '@angular/core'

import { Storage }            from '@ionic/storage'; 
import { Geolocation }        from '@ionic-native/geolocation';
import { Http }               from '@angular/http';

function extractCountryId(fromContext){
  return fromContext.split(':')[0];
}

@Injectable()
export class StoreManager {

  currentPosition:    any = { location: {} }
  currentSession:     any = null
  currentInformation: any = null

  countries:        any[] = []
  points:           any[] = []

  searchResults:    any[] = []
  browseContexts:   any[] = []
  browseResults:    any[] = []

  userPlaces:       any[] = []
  userItinerary:    any[] = []

  groupPlaces:      any[] = []
  groupMembers:     any[] = []

  trackingOptions:  any[] = []

  tracngPoints:     any[] = []

  lookbackInMonths: number = 36

  constructor(
    private storage:     Storage,
    private geolocation: Geolocation,
    private http:        Http,
    @Inject('REST_URL')
    private restUrl:     string
  ){
  }
  ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

  loadCache = () => {   
    return this.storage.get('SESSION').then((data) => {
      return data
    })
  }
  ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

  loadUser = (userName, password) => {
  }
  ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  
  loadAnonymously = () => {

    this.currentSession  = {}

    this.storage.set('SESSION', this.currentSession)

  }
  ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

  loadCurrentPosition() {
    this.geolocation.getCurrentPosition().then((resp) => {
      this.currentPosition.latitude  = resp.coords.latitude  
      this.currentPosition.longitude = resp.coords.longitude
      this.currentPosition.location  = {primaryName: 'Loading latitude & longitude'}    

      this.http.get(this.restUrl + `geographic/find/contexts?latitude=${resp.coords.latitude}&longitude=${resp.coords.longitude}`)
        .subscribe((response: any) => { 
 
            const data: any = response.json()[0];

            const names = data.fullName.split(',')

            const countryId = extractCountryId(data.contextReference)

            const location = {
              typeIcon:               'locate',
              primaryName:            names[0],
              fullName:               data.locationFullName,
              secondaryName:          names.slice(1).join(','),
              contextReference:       data.contextReference,              
              type:                   data.type,
              id:                     data.id,
              tzId:                   data.tzId,
            }

            this.currentPosition.location = location

            this.refreshCountry(countryId)
        });

    }).catch((error) => {
      console.log('Error getting location', error);
    });
  }
  ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

  // private refreshSession = () => {
  // }

  private findCountry(countryNo){
    var country = this.countries.find(item => item.countryNo === countryNo)

    if (! country){
      country = {countryNo, incidents: []}
      this.countries.push(country)
    }    

    return country
  }
  ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

  private refreshCountry = (countryNo) => {
    this.http.get(this.restUrl + `/risk/match/incidents?countryNo=${countryNo}&lookBackInMonths=${this.lookbackInMonths}`)
      .subscribe((response: any) => { 

          const data: any = response.json()[0];

          var country = this.findCountry(data.countryNo)

          country.listCreatedUTC   = data.listCreatedUTC
          country.incidentList     = data.incidentList
          
          this.checkIncidents(country)
      })
  }
  ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

  private checkIncidents(country){
    
    let newIncidents  = []
    let missingList   = [] 
    let promisses     = []
    let loadIncidents = []

    country.incidentList.split(',').forEach(item =>{
      let found = country.incidents.find(match => match.incidentId === item)

      if (found){
        newIncidents.push(found)
      } else {
        missingList.push(item)
      }
    })

    missingList.forEach( item => {
      promisses.push( 
        this.storage.get('INCIDENT'+ item).then((data) => {

          if (data){
            newIncidents.push(data)
          } else {
            loadIncidents.push(item)
          }
          
          return data
        })
      )
    })

    Promise.all(promisses).then(data => {
      this.refreshIncidents(country, loadIncidents)
      country.incidents = newIncidents
    }) 
  }
  ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

  private refreshIncidents(country, list){

  }
  ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

  chooseInformation(target){
    this.currentInformation = target
  }
  ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}






