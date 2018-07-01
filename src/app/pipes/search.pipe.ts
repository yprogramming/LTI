import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'search'
})
export class SearchPipe implements PipeTransform {

  transform(value: Array<Object>, keyword: string): Array<Object> {
    const data = keyword ? keyword.toLowerCase() : null;
    return data ? value.filter((dt: Object) =>
      dt['name'].toLowerCase().indexOf(data) !== -1
    ) : value;
  }

}
