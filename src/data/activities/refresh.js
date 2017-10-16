import store             from '../store'
import getCurrenPosition from '../connectors/local/getCurrenPosition'
import getFindLocation   from '../connectors/server/getFindLocation'
import getRetreveContext from '../connectors/server/getRetreveContext'
import postUpdateContext from '../connectors/server/postUpdateContext'

const refresh = async () => {

  const currentPosition = await getCurrenPosition()
  const { session }     = store.getState()
  let   currentLocation
  let   currentContext

  if (currentPosition.latitude){
    currentLocation = await getFindLocation(currentPosition.latitude, currentPosition.longitude)  
  }

  if (currentLocation){
    currentContext = await getRetreveContext(currentLocation.contextId) 
  }

  if (session.code && currentContext){
    postUpdateContext(session.code, currentContext.id)
  }

  return { currentPosition, currentLocation, currentContext }
}

export default refresh