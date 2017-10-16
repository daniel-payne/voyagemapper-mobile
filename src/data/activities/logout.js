import getCloseSession from '../connectors//server/getCloseSession'

const logout = async (code) => {

  const session = await getCloseSession(code)  

  return session

}

export default logout