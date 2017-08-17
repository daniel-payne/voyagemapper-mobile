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