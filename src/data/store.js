import { 
  createStore, 
  applyMiddleware, 
  compose, 
  combineReducers 
}                                                from 'redux'
import { 
  routerMiddleware, 
  routerReducer 
}                                                from 'react-router-redux'
import thunk                                     from 'redux-thunk'
import createHistory                             from 'history/createBrowserHistory'

import counter                                   from './stores/counter'
import geographic                                from './stores/geographic'
import itinerary                                 from './stores/itinerary'

export const history = createHistory()

const rootReducer = combineReducers({
  routing: routerReducer,
  
  counter,
  geographic,
  itinerary,
})
 
const rootURL = 'http://127.0.0.1:8000'

const initialState = {}
const enhancers = []
const middleware = [
  thunk.withExtraArgument({rootURL}),
  routerMiddleware(history)
]

if (process.env.NODE_ENV === 'development') {
  const devToolsExtension = window.devToolsExtension

  if (typeof devToolsExtension === 'function') {
    enhancers.push(devToolsExtension())
  }
}

const composedEnhancers = compose(
  applyMiddleware(...middleware),
  ...enhancers
)

const store = createStore(
  rootReducer,
  initialState,
  composedEnhancers
)

export default store

export const restUrl = 'http://localhost:1337/'
