import { observable }     from 'mobx-angular' 

import { Location } from './Location'

export class Position {
   @observable latitude:      number = 1
   @observable longitude:     number
   @observable takenAtUtc:    any

   @observable location: any = new Location()

   constructor(latitude, longitude){
     this.latitude  = latitude
     this.longitude = longitude
   }

}