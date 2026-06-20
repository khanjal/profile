import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'duration',
  standalone: true,
})
export class DurationPipe implements PipeTransform {
  transform(startDate: string, endDate: string | null = null): string {
    const start = new Date(startDate);
    const end = endDate ? new Date(endDate) : new Date();

    let months = (end.getFullYear() - start.getFullYear()) * 12 + (end.getMonth() - start.getMonth());
    const years = Math.floor(months / 12);
    months = months % 12;

    if (years === 0) {
      return months <= 1 ? '1 month' : `${months} months`;
    }
    if (months === 0) {
      return years === 1 ? '1 year' : `${years} years`;
    }
    return `${years} yr${years > 1 ? 's' : ''} ${months} mo${months > 1 ? 's' : ''}`;
  }
}