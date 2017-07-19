import { observable } from 'mobx-angular';

import { Group }    from './Group'
import { Location } from './Location'

export class Session {
  @observable isAnonymous:         boolean = true

  @observable sessionGuid:         string  
  @observable sessionExpiresAtUtc: string

  @observable lookbackInMonths:    number = 36

  @observable discardedAlertIDs:   string[]

  @observable locations:           Location[]
  @observable groups:              Group[]
  @observable Itineraries:         Location[]
}