import store, { restUrl }                                            from '../../store'
//import { UPDATE_CURRENT_LOCATION, UPDATE_CURRENT_LOCATION_ERROR, } from '../stores/geographic'

const getRetreveContext = (id) => {
  
  return fetch(restUrl + `risk/retreve/context?id=${id}`)
  .then((response) => {
    return response.json()
  })
  .then((data) => {

    const context = data[0]

    store.dispatch({type: 'UPDATE_CURRENT_CONTEXT', payload: { context }})

    return context

  }).catch((error) => {

    store.dispatch({type: 'UPDATE_CURRENT_CONTEXT_ERROR'})

    console.log(`ERROR risk/retreve/context?id=${id}`, error)

  })

}

export default getRetreveContext 