import refresh                            from './refresh'

const startup = async () => {

  const newPosition = await refresh()
   
  if (newPosition){
    alert(JSON.stringify(newPosition))
  }
 
}

export default startup