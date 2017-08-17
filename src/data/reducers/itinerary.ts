import { Reducer, Action,  ActionCreator } from 'redux'
import Immutable                           from 'immutable'
import * as moment                         from 'moment'

import{ User }   from '../clases/user'
import{ Point }  from '../clases/point'

// Actions ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

const LOAD_USER = 'ITINERARY/LOAD_USER'
export const loadUser: ActionCreator<Action> = (payload) => ({
  type:     LOAD_USER, 
  payload:  payload 
})

const LOAD_POINT = 'ITINERARY/LOAD_POINT'
export const loadPoint: ActionCreator<Action> = (payload) => ({
  type:     LOAD_POINT, 
  payload:  payload 
})

const CLEAR = 'ITINERARY/CLEAR'
export const clearItinerary: ActionCreator<Action> = (payload) => ({
  type:     CLEAR, 
  payload:  payload 
})
 
// Interfaces /////////////////////////////////////////////////////////////////////////////////////////////////////////////////

export interface IItineraryState {
  count:             number,
  user:              any,
  points:            Immutable.Map<String, Point> 
}

export const initialItineraryState: IItineraryState = {
  count:             0,
  user:              new User({}),
  points:            Immutable.Map<String, Point>()
}

// Reducer ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

export const itineraryReducer: Reducer<IItineraryState> = (state: IItineraryState = initialItineraryState, action: any): IItineraryState => {
  let updateState = {}
 
  switch (action.type) {

    case LOAD_USER:  updateState = { 
      user:            action.payload 
    }
    break

    case LOAD_POINT:  updateState = { 
      points:           state.points.set(action.payload.pointId, action.payload)
    }
    break

    case CLEAR:  updateState = { 
      user:            new User({email: state.user.email}),
      points:          Immutable.Map<String, Point>()
    }
    break

    // case LOAD_POINTS:  updateState = { 
    //   points:           state.points.mergeWith((prev, next, key) => {
    //                       if(!next) {
    //                         return prev 
    //                       }
    //                       return next 
    //                     }, Immutable.Map(action.payload.map((item) => ([ item.placeId, item ]))) )
    // }
    // break

  }

  return Object.assign({}, state, updateState, {count: state.count + 1})

}
