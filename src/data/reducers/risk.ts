import { Reducer, Action,  ActionCreator } from 'redux'
import Immutable from 'immutable'

import { Incident } from '../clases/incident'

// Actions ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

const LOAD_INCIDENT = 'RISK/LOAD_INCIDENT'
export const loadIncident: ActionCreator<Action> = (payload, target) => ({
  type:     LOAD_INCIDENT, 
  payload:  payload,
  target:   target
})

const CLEAR = 'RISK/CLEAR'
export const clearGeographic: ActionCreator<Action> = (payload) => ({
  type:     CLEAR, 
  payload:  payload 
})

// Interfaces /////////////////////////////////////////////////////////////////////////////////////////////////////////////////

export interface IRiskState {
  count:            number,
  incidents:        Immutable.Map<String, Incident> 
}

export const initialRiskState: IRiskState = {
  count:             0,
  incidents:         Immutable.Map<String, Incident>(),
}

// Reducer ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

export const riskReducer: Reducer<IRiskState> = (state: IRiskState = initialRiskState , action: any): IRiskState => {

  let updateState = {}

  switch (action.type) {

    case LOAD_INCIDENT:  updateState = { 
      incidents:   state.incidents.set(action.payload.incidentId, action.payload)
    }
    break

    case CLEAR:  updateState = { 
      incidents:         Immutable.Map<String, Incident>(),
    }
    break

    // case LOAD_INCIDENTS:  updateState = { 
    //   incidents:        state.incidents.mergeWith((prev, next, key) => {
    //                       if(!next) {
    //                         return prev 
    //                       }
    //                       return next 
    //                     }, Immutable.Map(action.payload.map((item) => ([ item.incidentId, item ]))) )
    // }
    // break

  }

  return Object.assign({}, state, updateState, {count: state.count + 1})

} 

 
