import { Injectable, Inject }     from '@angular/core';
//import { Http, Response }         from '@angular/http';
import { Http }                   from '@angular/http';
import { NgRedux    }             from 'ng2-redux';
import { Geolocation }            from '@ionic-native/geolocation';
import { Storage }                from '@ionic/storage';
import * as moment                from 'moment';

import { IApplicationState}                                            from '../app/app.reducer';
import { IPosition, loadCurrentPosition }                              from '../data/geographic-reducer';
import { 
  ILocation, 
  loadCurrentLocation, 
  loadCountry, 
  loadIncidents, 
  chooseLocation 
}                                                                      from '../data/risk-reducer';

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

  getCurrentLocation(){

    this.geolocation.getCurrentPosition().then((resp) => {
      const position: IPosition = {
        latitude:   resp.coords.latitude,
        longitude:  resp.coords.longitude,
        takenAtUTC: moment.utc(),
      }
 
      this.ngRedux.dispatch( loadCurrentPosition(position) );
     
      this.http.get(this.restUrl + `geographic/match/${position.latitude}/${position.longitude}`)
        .subscribe((response: any) => { 

            const data: any = response.json()[0];

            const names = data.locationFullName.split(',')

            const location: ILocation = {
              locationName:           names[0],
              fullName:               data.locationFullName,
              contextName:            names.slice(1).join(','),
              countryNo:              data.countryNo,
              stateNo:                data.stateNo,
              countyNo:               data.countyNo
            }

            this.ngRedux.dispatch( loadCurrentLocation(location) );

            this.getIncidentsForCountry(data.countryNo)
        });

    }).catch((error) => {
      console.log('Error getting location', error);
    });

  }

  getIncidentsForCountry(countryNo) {

    this.ngRedux.dispatch( loadCountry(countryNo) )
    
    let currentRiskState     = this.ngRedux.getState().risk 
    let incidentsCount       = currentRiskState.countries.get(countryNo).incidents ? currentRiskState.countries.get(countryNo).incidents.size : -1 
    let lookBackInMonths     = currentRiskState.lookBackInMonths

    if (incidentsCount === 0) { 

      this.http.get(this.restUrl + `risk/incidents/country/${countryNo}?LookBackInMonths=${lookBackInMonths}`)
        .subscribe((response: any) => { 

            const data: any = response.json()[0];

            const ids      = data.incidentList.split(',')
            const promises = []
            let   missingIncidentIDs = []
            let   incidents          = []

            ids.forEach(item => {
              promises.push(this.storage.get('I'+item).then((val) => {
                  if (val){
                    incidents.push(val)
                  } else {
                    missingIncidentIDs.push(item)
                    incidents.push({incidentId:item })
                  }
              }))
            })

            Promise.all(promises).then(() => {
 
              this.ngRedux.dispatch( loadIncidents(incidents, countryNo) );
              
              if (missingIncidentIDs.length > 0){
                this.getIncidents( missingIncidentIDs.join(','),  countryNo)
              }
              
            })

        });

    }

  }

  getIncidents(list, countryNo){
      this.http.get(this.restUrl + `risk/incidents/?list=${list}`)
        .subscribe((response: any) => { 

            const datum: any = response.json();

            datum.forEach(item => {
              this.storage.set('I'+ item.incidentId, item);  
            })
 
            this.ngRedux.dispatch( loadIncidents(datum, countryNo) );

        });
  }

  chooseLocation(locationID){
    this.ngRedux.dispatch( chooseLocation(locationID) );
  }
  
}
