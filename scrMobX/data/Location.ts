import { observable } from 'mobx-angular' 

export class Location {
  @observable fullName:           string

  @observable primaryName:        string
  @observable secondaryName:      string
  @observable tertiaryName:       string

  @observable countryNo:          number
  @observable stateNo:            number
  @observable countyNo:           number
  @observable conurbationId:      number

  constructor(){
    
  }
}