import { Reducer, Action,  ActionCreator } from 'redux'
import Immutable from 'immutable'

import { Position } from '../clases/position' 
import { Context }  from '../clases/context'
import { Country }  from '../clases/country'

// Actions ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

const LOAD_POSITION = 'GEOGRAPHIC/LOAD_POSITION'
export const loadPosition: ActionCreator<Action> = (payload) => ({
  type:     LOAD_POSITION, 
  payload:  payload
})

const LOAD_CONTEXT = 'GEOGRAPHIC/LOAD_CONTEXT'
export const loadContext: ActionCreator<Action> = (payload) => ({
  type:     LOAD_CONTEXT, 
  payload:  payload
})

const LOAD_COUNTRY = 'GEOGRAPHIC/LOAD_COUNTRY'
export const loadCountry: ActionCreator<Action> = (payload) => ({
  type:     LOAD_COUNTRY, 
  payload:  payload
})

const CLEAR = 'GEOGRAPHIC/CLEAR'
export const clearGeographic: ActionCreator<Action> = (payload) => ({
  type:     CLEAR, 
  payload:  payload 
})

// Interfaces /////////////////////////////////////////////////////////////////////////////////////////////////////////////////

export interface IGeographicState {
  count:            number 
  position:         Position 

  contexts:         Immutable.Map<String, Context> 
  countries:        Immutable.Map<String, Country> 
}

export const initialGeographicState: IGeographicState = {
  count:             0,
  position:          new Position( {fullName: 'Position Unknown'} ),

  contexts:          Immutable.Map<String, Context>(),
  countries:         Immutable.Map<String, Country>(),
}

// Reducer ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

export const geographicReducer: Reducer<IGeographicState> = (state: IGeographicState = initialGeographicState , action: any): IGeographicState => {

  let updateState = {}

  switch (action.type) {

    case LOAD_POSITION:  updateState = { 
      position:   action.payload 
    }
    break

    case LOAD_CONTEXT:  updateState = { 
      contexts:   state.contexts.set(action.payload.contextReference, action.payload)
    }
    break

    case LOAD_COUNTRY:  updateState = { 
      countries:   state.countries.set(action.payload.countryNo, action.payload)
    }
    break

    case CLEAR:  updateState = { 
      contexts:          Immutable.Map<String, Context>(),
      countries:         Immutable.Map<String, Country>(),
    }
    break

  }

  return Object.assign({}, state, updateState, {count: state.count + 1})

}
