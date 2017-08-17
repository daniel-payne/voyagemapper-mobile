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