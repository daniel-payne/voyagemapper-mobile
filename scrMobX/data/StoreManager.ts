import { Injectable, Inject } from '@angular/core'
import { observable, action } from 'mobx-angular'
import { Storage }            from '@ionic/storage'; 
import { Geolocation }        from '@ionic-native/geolocation';
import { Http }               from '@angular/http';

import { Country }  from './Country'
import { Position } from './Position'
import { Session }  from './Session'

//import { Location } from './Location'


@Injectable()
export class StoreManager {

  @observable currentPosition = new Position(null, null)
  @observable currentSession  = null

  @observable countries: Country[] = []

  constructor(
    private storage:     Storage,
    private geolocation: Geolocation,
    private http:        Http,
    @Inject('REST_URL')
    private restUrl:     string
  ){
  }

  @action loadCache = () => {   
    return this.storage.get('SESSION').then((data) => {
       

      return data
    })

  }

    @action
  loadUser = (userName, password) => {
  }
  
  @action
  loadAnonymously = () => {

    this.currentSession  = new Session() 

    this.storage.set('SESSION', this.currentSession)

  }

  @action
  refreshCurrentPosition() {
    this.geolocation.getCurrentPosition().then((resp) => {
      this.currentPosition = new Position(resp.coords.latitude, resp.coords.longitude) 

      this.http.get(this.restUrl + `geographic/match/${resp.coords.latitude}/${resp.coords.longitude}`)
        .subscribe((response: any) => { 

            const data: any = response.json()[0];

            const names = data.locationFullName.split(',')

            const location = {
              primaryName:           names[0],
              fullName:               data.locationFullName,
              secondaryName:            names.slice(1).join(','),
              countryNo:              data.countryNo,
              stateNo:                data.stateNo,
              countyNo:               data.countyNo
            }

            this.currentPosition.location = location 
        });

    }).catch((error) => {
      console.log('Error getting location', error);
    });
  }

  @action
  refreshSession = () => {
  }

}






