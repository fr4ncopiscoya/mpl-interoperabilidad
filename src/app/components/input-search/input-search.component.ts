import { Component, input, output } from '@angular/core';

@Component({
  selector: 'app-input-search',
  imports: [],
  templateUrl: './input-search.component.html',
})
export class InputSearchComponent {

  //Allow the input to accept specific data types
  inputType = input<'numeric' | 'letters' | 'alphanumeric'>('alphanumeric');

  title = input<string>('');
  subTitle = input<string>('');
  maxLenght = input<string>();
  placeholder = input<string>();
  value = output<string>();

  /**
   * Normalizes and validates the input field value based on the selected input type. ('numeric' | 'letters' | 'alphanumeric')
   * 
   * @param event The `input` event triggered by the text field.
   * @returns void — updates the input value directly in the DOM.
   */
  onInputChange(event: Event) {
    const inputElement = event.target as HTMLInputElement;
    let value = inputElement.value.toUpperCase();

    switch (this.inputType()) {
      case 'numeric':
        value = value.replace(/[^0-9]/g, '');
        break;
      case 'letters':
        value = value.replace(/[^A-Z]/g, '');
        break;
      case 'alphanumeric':
        value = value.replace(/[^A-Z0-9]/g, '');
        break;
    }

    inputElement.value = value;
  }

}
