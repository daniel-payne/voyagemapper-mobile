import { Reducer, combineReducers} from 'redux';

import {IGeographicState, initialGeographicState, geographicReducer} from '../data/reducers/geographic';
import {IRiskState,       initialRiskState,       riskReducer      } from '../data/reducers/risk';
import {IItineraryState,  initialItineraryState,  itineraryReducer } from '../data/reducers/itinerary';

export interface IApplicationState {
    geographic: IGeographicState,
    risk:       IRiskState,
    itinerary:  IItineraryState,
};

export const initialState = {
    geographic: initialGeographicState,
    risk:       initialRiskState,
    itinerary:  initialItineraryState,
}

export const rootReducer: Reducer<IApplicationState> = combineReducers<IApplicationState>({
    geographic: geographicReducer,
    risk:       riskReducer,
    itinerary:  itineraryReducer,
}); 