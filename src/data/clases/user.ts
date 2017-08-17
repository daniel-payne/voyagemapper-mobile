import * as moment                from 'moment'

export class User {
  email?:      string
  pointList:   string 

  session?:    string
  expires?:    any  

  [propName: string]: any

  constructor(data: any) {
    this.email     = data.email
    this.pointList = data.pointList  
    this.session   = data.session 

    if (data.expires){
      this.expires = moment.utc(data.expires) 
    }
  
    //this.data = data
  }

  isActive = (): boolean => {

    if (this.expires !== undefined && moment.utc().isBefore(this.expires) ) {
      return true
    }

    return false
  }
}