import { observable } from 'mobx-angular';

export class Alert {
  @observable alertId:            number

  @observable countryNo:          number
  @observable stateNo:            number
  @observable countyNo:           number
  @observable conurbationId:      number

  @observable description:        string

}