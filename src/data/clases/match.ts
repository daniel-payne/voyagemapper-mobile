export class Match {
  contextReference:    string
  fullName:            string
  latitude:            string  
  longitude:           string
  matchId:             string
  matchType:           string

  primaryName:         string
  secondaryName:       string

  [propName: string]: any

  constructor(data: any) {
    this.contextReference   = data.contextReference 
    this.fullName           = data.fullName 
    this.latitude           = data.latitude 
    this.longitude          = data.longitude 

    this.matchId            = data.matchId 
    this.matchType          = data.matchType 

    if (data.conurbationId){
      this.matchId   = data.conurbationId
      this.matchType = 'CON' 
    } else if (data.settlementId){
      this.matchId   = data.settlementId
      this.matchType = 'SET' 
    }
    
    const names = data.fullName.split(',')

    this.primaryName   = names[0].trim()

    this.secondaryName = names.slice(1).join(', ')

    //this.data = data
  }
}