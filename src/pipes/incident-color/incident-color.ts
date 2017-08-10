import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'incidentColor',
})
export class IncidentColorPipe implements PipeTransform {
  transform(value: number, ...args) {
    if (value === undefined) return 'default'
    if (value === 0)         return 'secondary'
    return 'danger'
  }
}
