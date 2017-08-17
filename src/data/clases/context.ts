export class Context {
  contextReference:    string
  fullName:            string  

  countryNo:           string

  [propName: string]: any

  constructor(data: any) {
    this.contextReference   = data.contextReference 
    this.fullName           = data.fullName 

    this.countryNo          = data.contextReference.split(':')[0]

    //this.data = data
  }
}