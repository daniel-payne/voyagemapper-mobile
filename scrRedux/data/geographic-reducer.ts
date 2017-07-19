import { Reducer, Action,  ActionCreator } from 'redux'

// Actions ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

const LOAD_CURRENT_POSITION = 'GEOGRAPHIC_LOAD_CURRENT_POSITION'
export const loadCurrentPosition: ActionCreator<Action> = (payload) => ({
  type:     LOAD_CURRENT_POSITION, 
  payload:  payload
})

// Interfaces /////////////////////////////////////////////////////////////////////////////////////////////////////////////////
export interface IPosition {
  latitude:           number,
  longitude:          number,
  takenAtUTC:         Object, 

  [propName: string]: any,
}

export interface IGeographicState {
  count:            number,
  currentPosition:  IPosition,
}

export const initialGeographicState: IGeographicState = {
  count:             0,
  currentPosition:   { latitude: null, longitude: null, takenAtUTC: null },
}

// Helpers ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////


// Processes ////////////////////////////////////////////////////////////////////////////////////////////////////////////////

function processCurrentPositionUpdate(oldState: IGeographicState, currentPosition: IPosition ): IGeographicState {

  let newState = Object.assign({}, oldState, {currentPosition}) 

  return newState

}

// Reducer ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

export const geographicReducer: Reducer<IGeographicState> = (state: IGeographicState = initialGeographicState , action: any): IGeographicState => {

  let newState = Object.assign({}, state, {count: state.count + 1})

  switch (action.type) {

    case LOAD_CURRENT_POSITION:           return processCurrentPositionUpdate( newState, action.payload                )

    default:                              return newState

  }
}
