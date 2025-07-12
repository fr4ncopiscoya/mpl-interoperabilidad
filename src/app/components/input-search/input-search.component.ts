import { Component, input, output } from '@angular/core';

@Component({
  selector: 'app-input-search',
  imports: [],
  templateUrl: './input-search.component.html',
})
export class InputSearchComponent {

  title = input<string>('');
  subTitle = input<string>('');
  maxLenght = input<string>();
  placeholder = input<string>();
  value = output<string>();
}
