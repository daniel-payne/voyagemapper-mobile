import store, { restUrl }                         from '../../store'
import { UPDATE_SESSION }                         from '../../stores/itinerary'
import cacheData                                  from '../local/cacheData'

const getOpenSession = (email, password) => {
  
 //let headers            = new Headers()
  const authorization    = `${email}:${password}`
  const b64Authorization = window.btoa(authorization)
 
  // headers.append('Save-Data', `Basic ${b64Authorization}`) 

  // var options = { 
  //   method: 'GET',
  //   headers,
  //   mode: 'cors',
  //   cache: 'default' 
  // }

  return fetch(restUrl + `itinerary/open/session?authorization=${b64Authorization}`)
  .then((response) => {
    return response.json()
  })
  .then((data) => {
    cacheData('EMAIL',   email)
    cacheData('SESSION', data[0])

    store.dispatch({type: UPDATE_SESSION, payload: data[0] })

    return data[0]

  }).catch((error) => {

    console.log(`Error getting session for ${email}`, error)

  })

}

export default getOpenSession