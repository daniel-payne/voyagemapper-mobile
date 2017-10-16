const cacheData = async (key, data) => {
  
  const localStorage = window.localStorage

  localStorage.setItem(key, JSON.stringify(data))

}

export default cacheData