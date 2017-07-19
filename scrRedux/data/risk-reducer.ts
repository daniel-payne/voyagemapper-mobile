import { Reducer, Action,  ActionCreator } from 'redux'
import { Map } from 'immutable'

export const CURRENT_LOCATION = 'CURRENT'

// Actions ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

const LOAD_CURRENT_LOCATION = 'RISK_LOAD_CURRENT_LOCATION'
export const loadCurrentLocation: ActionCreator<Action> = (payload) => ({
  type:     LOAD_CURRENT_LOCATION, 
  payload:  payload
})

const LOAD_COUNTRY = 'RISK_LOAD_COUNTRY'
export const loadCountry: ActionCreator<Action> = (payload) => ({
  type:     LOAD_COUNTRY, 
  payload:  payload
})

const LOAD_INCIDENTS = 'RISK_LOAD_INCIDENTS'
export const loadIncidents: ActionCreator<Action> = (payload, target) => ({
  type:     LOAD_INCIDENTS, 
  payload:  payload,
  target:   target
})

const CHOOSE_LOCATION = 'RISK_CHOOSE_LOCATION'
export const chooseLocation: ActionCreator<Action> = (payload) => ({
  type:     CHOOSE_LOCATION, 
  payload:  payload
})

// Interfaces /////////////////////////////////////////////////////////////////////////////////////////////////////////////////

export interface ILocation {
  locationName:       string,

  [propName: string]: any,
}


export interface IRiskState {
  count:            number,
  selectedLocation: ILocation,
  countries:        any,
  locations:        any,
  lookBackInMonths: number,
}

export const initialRiskState: IRiskState = {
  count:             0,
  selectedLocation:  { locationName: null },
  countries:         Map<number,any>(),
  locations:         Map<number,any>(),
  lookBackInMonths:  24,
}

// Helpers ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

function assignIncidentsToLocation(location, incidents) {
  let newlocation = Object.assign({}, location)
 
  incidents.forEach(item => {
    if (item.countyNo === newlocation.countyNo && item.stateNo === newlocation.stateNo && item.countryNo === newlocation.countryNo){
      newlocation.countyIncidents = newlocation.countyIncidents.set(item.incidentId, item)  
    }
    else if ( item.stateNo === newlocation.stateNo && item.countryNo === newlocation.countryNo){
      newlocation.stateIncidents = newlocation.stateIncidents.set(item.incidentId, item)  
    }
    else if ( item.countryNo === newlocation.countryNo){
      newlocation.countryIncidents = newlocation.countryIncidents.set(item.incidentId, item)  
    }
  })

  newlocation.countyIncidentsCount  = newlocation.countyIncidents.size
  newlocation.stateIncidentsCount   = newlocation.stateIncidents.size
  newlocation.countryIncidentsCount = newlocation.countryIncidents.size


  return newlocation
}

function assignIncidents(oldState) {
  let newState = Object.assign({}, oldState)

  newState.locations = newState.locations.withMutations( map => {

    map.forEach(item => {
      if (newState.countries.get(item.countryNo)) { 
        map.set(item.locationId, assignIncidentsToLocation(item, newState.countries.get(item.countryNo).incidents))
      }
    })

  })

  newState.currentLocation = newState.locations.get(CURRENT_LOCATION)

  return newState
}

// Processes ////////////////////////////////////////////////////////////////////////////////////////////////////////////////

function processCurrentLocationUpdate(oldState: IRiskState, locationData: ILocation ): IRiskState {
 
  let newCurrentLocation =  Object.assign({}, locationData)
  
  newCurrentLocation.locationId       = CURRENT_LOCATION
  newCurrentLocation.countryIncidents = Map<number,any>()
  newCurrentLocation.stateIncidents   = Map<number,any>()
  newCurrentLocation.countyIncidents  = Map<number,any>()

  let newState = Object.assign({}, oldState, { locations: oldState.locations.set(CURRENT_LOCATION, newCurrentLocation)}) 

  newState = assignIncidents(newState)

  return newState

}

function processCountryLoad(oldState: IRiskState, countryNo: number ): IRiskState {
  let newState = oldState

  if (! oldState.countries.has(countryNo) ){

    newState = Object.assign({}, oldState, {countries: oldState.countries.set(countryNo, {countryNo: countryNo, incidents: Map<number,any>()}) }) 

  }

  return newState

}

function processIncidentsLoad(oldState: IRiskState, incidents: any[], countryNo: any ): IRiskState {

  let newState = oldState

  if (oldState.countries.has(countryNo) ){

    let newCountry = Object.assign({}, oldState.countries.get(countryNo))

    incidents.forEach(item => {

      newCountry.incidents = newCountry.incidents.set(item.incidentId, item)

    })

    newState = Object.assign({}, oldState, {countries: oldState.countries.set(countryNo, newCountry) }) 

    newState = assignIncidents(newState)

  }

  return newState

}

function processLocationChoose(oldState: IRiskState, locationId: number){
  let newState = Object.assign({}, oldState)

  newState.selectedLocation = newState.locations.get(locationId)

  return newState  
}


// Reducer ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

export const riskReducer: Reducer<IRiskState> = (state: IRiskState = initialRiskState, action: any): IRiskState => {

  let newState = Object.assign({}, state, {count: state.count + 1})

  switch (action.type) {

    case LOAD_CURRENT_LOCATION:           return processCurrentLocationUpdate( newState, action.payload                 )
    case LOAD_COUNTRY:                    return processCountryLoad(           newState, action.payload                 )
    case LOAD_INCIDENTS:                  return processIncidentsLoad(         newState, action.payload, action.target  )
    
    case CHOOSE_LOCATION:                 return processLocationChoose(        newState, action.payload                 )

    default:                              return newState

  }

}
