import { Reducer, combineReducers} from 'redux';
// import { OpaqueToken }             from '@angular/core';

import {IGeographicState, initialGeographicState, geographicReducer} from '../data/geographic-reducer';
import {IRiskState,       initialRiskState,       riskReducer      } from '../data/risk-reducer';

export interface IApplicationState {
    geographic: IGeographicState,
    risk:       IRiskState,
};

export const initialState = {
    geographic: initialGeographicState,
    risk:       initialRiskState,
}

export const rootReducer: Reducer<IApplicationState> = combineReducers<IApplicationState>({
    geographic: geographicReducer,
    risk:       riskReducer,
});

 