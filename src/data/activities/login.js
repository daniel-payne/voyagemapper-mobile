import getOpenSession from '../connectors/server/getOpenSession'

const login = async (email, password) => {

  const session = await getOpenSession(email, password)  

  return session

}

export default login