import store, { restUrl }                                          from '../../store'
import { UPDATE_CURRENT_LOCATION, UPDATE_CURRENT_LOCATION_ERROR, } from '../../stores/geographic'

const getFindLocation = (latitude, longitude) => {
  
  return fetch(restUrl + `geographic/find/context?latitude=${latitude}&longitude=${longitude}`)
  .then((response) => {
    return response.json()
  })
  .then((data) => {

    const location = data[0]

    store.dispatch({type: UPDATE_CURRENT_LOCATION, payload: location })

    return location

  }).catch((error) => {

    store.dispatch({type: UPDATE_CURRENT_LOCATION_ERROR})

    console.log(`ERROR geographic/find/context?latitude=${latitude}&longitude=${longitude}`, error)

  })

}

export default getFindLocation