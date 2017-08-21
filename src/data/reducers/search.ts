import { Reducer, Action,  ActionCreator } from 'redux'
import Immutable from 'immutable'

import { Match } from '../clases/match'

// Actions ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

const LOAD_CONURBATION_MATCHES = 'SEARCH/LOAD_CONURBATION_MATCHES'
export const loadMatches: ActionCreator<Action> = (payload, target) => ({
  type:     LOAD_CONURBATION_MATCHES, 
  payload:  payload,
  target:   target
})

const CLEAR = 'SEARCH/CLEAR'
export const clearSearch: ActionCreator<Action> = (payload) => ({
  type:     CLEAR, 
  payload:  payload 
})

// Interfaces /////////////////////////////////////////////////////////////////////////////////////////////////////////////////

export interface ISearchState {
  count:       number,
  matches:     Immutable.Set<Match> 
}

export const initialSearchState: ISearchState = {
  count:       0,
  matches:     Immutable.Set<Match>(),
}

// Reducer ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

export const searchReducer: Reducer<ISearchState> = (state: ISearchState = initialSearchState , action: any): ISearchState => {

  let updateState = {}
 

  switch (action.type) {


    case CLEAR:  
    updateState = { 
      matches:         Immutable.Set<Match>(),
    }
    break

    case LOAD_CONURBATION_MATCHES:  
      updateState = { 
        matches: Immutable.Set<Match>( action.payload )
      }
    break

  }

  return Object.assign({}, state, updateState, {count: state.count + 1})

} 

 
