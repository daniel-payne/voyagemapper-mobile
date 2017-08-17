export class Country {
  countryNo:           string
  fullName:            string  
  CountryGoogleArray:  string

  [propName: string]: any

  constructor(data: any) {
    this.countryNo          = data.countryNo 
    this.fullName           = data.fullName 
    this.CountryGoogleArray = data.CountryGoogleArray 
    //this.data = data
  }

  googleArray = (): any => {
    let googleArray

    let inner = () => {

      if(! googleArray){
        googleArray = JSON.parse(this.CountryGoogleArray ) 
      }

      return JSON.parse(googleArray)

    }

    return inner     
  }
}