import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'transformMinute'
})
export class TransformMinutePipe implements PipeTransform {

  // if the duration is 110 minutes, the component should display "1 hour(s) 50 minute(s)"
  // in the duration field, and a pipe should do this transformation.
  transform(value: number, ...args: string[]): string {
    // How it works is, lets say duration is 115 minutes
    // 1. hours would calculate 115/60 = 1.916666666666667 (notice how if I set it to 120 it results in 2.00)
    // 2. Round down to find hours, so it is 1 hour
    // 3. now that we found how many hours to multiply it by 60 to convert those hours to minutes
    // 4. value will always be greater than the amount of hours (since if value/60 < 1, rounding down would result in 0 hours)
    // 5. subtract value - hours * 60, boom - hours and minutes found from given minutes

    // get raw float point hours by dividing with 60 minutes
    // round down using math.floor to find exact hour
    let hours = Math.floor(value/60);

    //get minutes via finding the remainder of how much hours
    let minutes = value - hours * 60;

    let changedFormat = hours + " Hour(s) " + minutes + " minute(s)";

    return changedFormat;
  }

}
