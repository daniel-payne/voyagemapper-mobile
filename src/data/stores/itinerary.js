export const UPDATE_SESSION       = 'ITINERARY/UPDATE_SESSION'
export const UPDATE_SESSION_ERROR = 'ITINERARY/UPDATE_SESSION_ERROR'

const initialState = {
  session: {}
}

export default (state = initialState, action) => {
  const { payload } = action

  switch (action.type) {
    case UPDATE_SESSION:
      return {
        ...state,
        session: payload
      }

    default:
      return state
  }
}