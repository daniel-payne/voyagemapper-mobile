
export class Location {
  fullName:           string

  primaryName:        string
  secondaryName:      string
  tertiaryName:       string

  countryNo:          number
  stateNo:            number
  countyNo:           number
  conurbationId:      number
}

export class Alert {
  alertId:            number

  countryNo:          number
  stateNo:            number
  countyNo:           number
  conurbationId:      number

  description:        string

}

export class Country {
  countryId:          number
  
  countryNo:          number

  alerts:         Alert[]
}

export class Position {
   latitude:      number
   longitude:     number
   takenAtUtc:    any

   countryNo:     number
   stateNo:       number
   countyNo:      number
   conurbationId: number

   country:       Country

   countryAlerts: Alert[]
   stateAlerts:   Alert[]
   countyAlerts:  Alert[]
}

class Member {
  displayName:       string
  latestLocation:    Location
}

class Group {
  name:              string

  locations:         Location[]

  members:           Member[]
}

class Session {
  isAnonymous:         boolean = true

  sessionGuid:         string  
  sessionExpiresAtUtc: string

  lookbackInMonths:    number = 36

  discardedAlertIDs:   string[]

  locations:           Location[]
  groups:              Group[]
  Itineraries:         Location[]
}

class Store {

  currentPosition = new Position()
  currentSession  = new Session()

  countries = []

  loadCache = () => {

  }

  loadCurrentPosition = () => {
    this.currentPosition.latitude   = 52.34543
    this.currentPosition.longitude  = 0.00123
    this.currentPosition.takenAtUtc = '2017-05-12T10:23'
  }

  createUser = (email, password) => {

  }

  loadUserSession = (email, password) => {

  }

  loadLocations = () => {

  }

  loadAlertsForCountry = (countryId) => {

  }

  refresh = () => {

  }

  discardAlert = (alertId) => {

  }

}

const store = new Store()

store.loadCurrentPosition()

export default store




