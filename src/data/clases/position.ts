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