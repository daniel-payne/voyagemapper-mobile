import { observable } from 'mobx-angular';

import { Alert } from './Alert'

export class Country {
  @observable countryId:          number
  
  @observable countryNo:          number

  @observable alerts:             Alert[]
}