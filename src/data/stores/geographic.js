export const UPDATE_CURRENT_POSITION       = 'GEOGRAPHIC/UPDATE_CURRENT_POSITION'
export const UPDATE_CURRENT_POSITION_ERROR = 'GEOGRAPHIC/UPDATE_CURRENT_POSITION_ERROR'
export const UPDATE_CURRENT_LOCATION       = 'GEOGRAPHIC/UPDATE_CURRENT_LOCATION'
export const UPDATE_CURRENT_LOCATION_ERROR = 'GEOGRAPHIC/UPDATE_CURRENT_LOCATION_ERROR'

const MISSING_LOCATION = 'Position Unknown' 

const initialState = {
  currentPosition: {
    latitude:  undefined,
    longitude: undefined,
    status:    undefined,
  },
  currentLocation: { 
    fullName:  MISSING_LOCATION,
    contextID: undefined,
    type:      undefined, 
  }
}

export default (state = initialState, action) => {
  const { payload } = action

  switch (action.type) {
    case UPDATE_CURRENT_POSITION:
      return {
        ...state,
        currentPosition: payload 
      }
      case UPDATE_CURRENT_POSITION_ERROR:
      return {
        ...state,
        currentPosition: { latitude: undefined, longitude: undefined, status: 'Error getting location' },
        currentLocation: { fullName: MISSING_LOCATION },
      }

      case UPDATE_CURRENT_LOCATION:
      return {
        ...state,
        currentLocation: payload 
      }

      case UPDATE_CURRENT_LOCATION_ERROR:
      return {
        ...state,
        currentLocation: { fullName: `Lat: ${state.currentPosition.latitude} Long: ${state.currentPosition.longitude} ` }
      }

    default:
      return state
  }
}
