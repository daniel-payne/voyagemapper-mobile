import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'typeIcon',
})
export class TypeIconPipe implements PipeTransform {
  transform(value: string, ...args) {
    if (value === 'CUP') return 'locate'
    if (value === 'FLD') return 'plane'
    if (value === 'FLA') return 'plane'
    if (value === 'ACH') return 'key'
    if (value === 'CON') return 'home'  
    if (value === 'SET') return 'home' 
    return null
  }
}

    // if (value === 'CUP') return 'location_on'
    // if (value === 'FLD') return 'flight_takeoff'
    // if (value === 'FLA') return 'flight_land'
    // if (value === 'ACH') return 'hotel'
    // if (value === 'CON') return 'location_city'  
    // if (value === 'SET') return 'home'  
