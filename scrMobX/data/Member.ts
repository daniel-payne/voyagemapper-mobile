import { observable } from 'mobx-angular' 

import { Location } from './Location'

export class Member {
  @observable displayName:       string
  @observable latestLocation:    Location
}
