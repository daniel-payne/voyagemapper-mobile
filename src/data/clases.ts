import * as moment                from 'moment'

export class Position {
  latitude:            number 
  longitude:           number 
  takenAtUTC:          Object 
  fullName:            string 
  contextReference:    string

  [propName: string]: any

  constructor(data: any) {
    this.latitude   = data.latitude 
    this.longitude  = data.longitude 
    this.takenAtUTC = moment.utc() 

    if (data.latitude && data.longitude && (data.fullName === undefined)) {
      this.fullName   = `lat: ${data.latitude.toFixed(4)} long: ${data.longitude.toFixed(4)}`
    } else {
      this.fullName   = data.fullName
    } 

    this.contextReference  = data.contextReference 

    //this.data = data
  }

}

export class Context {
  contextReference:    string
  fullName:            string  

  countryNo:           string

  [propName: string]: any

  constructor(data: any) {
    this.contextReference   = data.contextReference 
    this.fullName           = data.fullName 

    this.countryNo          = data.contextReference.split(':')[0]

    //this.data = data
  }
}

export class User {
  email?:      string
  pointList:   string 

  session?:    string
  expires?:    any  

  [propName: string]: any

  constructor(data: any) {
    this.email     = data.email
    this.pointList = data.pointList  
    this.session   = data.session 

    if (data.expires){
      this.expires = moment.utc(data.expires) 
    }
  
    //this.data = data
  }

  isActive = (): boolean => {

    if (this.expires !== undefined && moment.utc().isBefore(this.expires) ) {
      return true
    }

    return false
  }
}

export class Point {
  contextReference:    string
  fullName:            string
  latitude:            string  
  longitude:           string
  pointId:             string
  pointType:           string

  [propName: string]: any

  constructor(data: any) {
    this.contextReference   = data.contextReference 
    this.fullName           = data.fullName 
    this.latitude           = data.latitude 
    this.longitude          = data.longitude 
    this.pointId            = data.pointId 
    this.pointType          = data.pointType 

    //this.data = data
  }
}

export class Country {
  countryNo:           string
  fullName:            string  
  CountryGoogleArray:  string

  [propName: string]: any

  constructor(data: any) {
    this.countryNo          = data.countryNo 
    this.fullName           = data.fullName 
    this.CountryGoogleArray = data.CountryGoogleArray 
    //this.data = data
  }

  googleArray = (): any => {
    let googleArray

    let inner = () => {

      if(! googleArray){
        googleArray = JSON.parse(this.CountryGoogleArray ) 
      }

      return JSON.parse(googleArray)

    }

    return inner     
  }
}

export class Incident {
  incidentId:                string
  incidentDate:              string
  incidentType:              string
  numberKilled:              string
  numberWounded:             string
  incidentDescription:       string
  locationDescription:       string
  perpetratorDescription:    string
  latitude:                  string
  longitude:                 string
  contextReference:          string

  [propName: string]: any

  constructor(data: any) {
    this.incidentId                = data.incidentId 
    this.incidentDate              = data.incidentDate 
    this.incidentType              = data.incidentType 
    this.numberKilled              = data.numberKilled 
    this.numberWounded             = data.numberWounded 
    this.incidentDescription       = data.incidentDescription 
    this.locationDescription       = data.locationDescription 
    this.perpetratorDescription    = data.perpetratorDescription 
    this.latitude                  = data.latitude 
    this.longitude                 = data.longitude 
    this.contextReference          = data.contextReference 

    //this.data = data
  }


}

 