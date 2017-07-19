import { observable } from 'mobx-angular' 

import { Member } from './Member'

export class Group {
  @observable name:              string

  @observable locations:         Location[]

  @observable members:           Member[]
}
