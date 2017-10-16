import { restUrl }                         from '../../store'

const postUpdateContext = (code, contextId) => {

  return fetch(restUrl + `itinerary/update/context?code=${code}&context=${contextId}`, { method: 'post' })
  //.then((response) => {
    //return response.json()
  //})
  .then((data) => {

    // store.dispatch({type: UPDATE_SESSION })

    return true

  }).catch((error) => {

    console.log(`Error getting update session for ${code}`, error)

  })

}

export default postUpdateContext