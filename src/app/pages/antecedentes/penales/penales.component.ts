import { Component, signal } from '@angular/core';

@Component({
  selector: 'app-penales',
  imports: [],
  templateUrl: './penales.component.html',
})
export default class PenalesComponent {

  apePaterno = signal<string>('');
  apeMaterno = signal<string>('');
  primer_nombre = signal<string>('');
  segundo_nombre = signal<string>('');
  tercer_nombre = signal<string>('');
  nuDni = signal<string>('');

  searchAntPenales(){
    const post = {
      apePaterno: this.apePaterno(),
      apeMaterno: this.apeMaterno(),
      nombre1: this.primer_nombre(),
      nombre2: this.segundo_nombre(),
      nombre3: this.tercer_nombre(),
      nuDni: this.nuDni()
    }


  }


  resetFields(){
    this.apePaterno.set('');
    this.apeMaterno.set('');
    this.primer_nombre.set('');
    this.segundo_nombre.set('');
    this.tercer_nombre.set('');
    this.nuDni.set('');
  }

}
