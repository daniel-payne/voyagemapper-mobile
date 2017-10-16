import store, { restUrl }                         from '../../store'
import { UPDATE_SESSION }                         from '../../stores/itinerary'
import cacheData                                  from '../local/cacheData'

const getOpenSession = (code) => {
  cacheData('SESSION', undefined)

  return fetch(restUrl + `itinerary/close/session?code=${code}`)
  .then((response) => {
    return response.json()
  })
  .then((data) => {

    store.dispatch({type: UPDATE_SESSION, payload: undefined })

    return undefined

  }).catch((error) => {

    console.log(`Error getting close for ${code}`, error)

  })

}

export default getOpenSession