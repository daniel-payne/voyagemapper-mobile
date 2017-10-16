import store                                                       from '../../store'
import Position                                                    from '../../classes/Position'
import { UPDATE_CURRENT_POSITION, UPDATE_CURRENT_POSITION_ERROR, } from '../../stores/geographic'

const getCurrenPosition = async () => {
  
  return new Promise(function(resolve, reject) {
  
    navigator.geolocation.getCurrentPosition((response) => {

      const position = new Position({
        latitude:  response.coords.latitude,
        longitude: response.coords.longitude,
      })

      store.dispatch({ type: UPDATE_CURRENT_POSITION, payload: position })

      resolve(position)
      
    }, (error) => {

      store.dispatch({ type: UPDATE_CURRENT_POSITION_ERROR })

      console.log('Error getting location', error)

      reject(error)

    })

  })

}

export default getCurrenPosition