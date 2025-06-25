import { Component, signal } from '@angular/core';
import { PideService } from '../../../../services/pide.service';
import { SpinnerService } from '../../../../services/spinner.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-bienes',
  imports: [CommonModule],
  templateUrl: './bienes.component.html',
  styleUrl: './bienes.component.css'
})
export default class BienesComponent {


  constructor(
    private pideService: PideService,
    private spinnerService: SpinnerService
  ) {

  }

  tipoPersona = signal<string>('N');
  apePaterno = signal<string>('');
  apeMaterno = signal<string>('');
  nombres = signal<string>('');
  razSocial = signal<string>('')
  dataPerNatural = signal(null);


  changeTipoPersona(value: string) {
    this.tipoPersona.set(value);
    this.resetFields();
  }

  resetFields() {
    this.apePaterno.set('');
    this.apeMaterno.set('');
    this.nombres.set('');
    this.razSocial.set('');
  }

  searchBienes(){
    if(this.tipoPersona() === 'N'){
      console.log('natural');
      this.getBienesPerNatural()
    }else{
      console.log('juridica');
      this.getBienesPerJuridica()
    }
  }


  getBienesPerNatural() {
    const post = {
      tipoParticipante: 'N',
      apellidoPaterno: this.apePaterno(),
      apellidoMaterno: this.apeMaterno(),
      nombres: this.nombres(),
    }

    console.log('post: ', post);


    this.pideService.getBienesPerNatural(post).subscribe({
      next: (res) => {
        console.log('res?', res);
      },
      error: (error) => {
        console.log('error: ', error);

      }
    })
  }

  getBienesPerJuridica() {
    const post = {
      razonSocial: this.razSocial()
    }
    this.pideService.getBienesPerJuridica(post).subscribe({
      next: (res) => {
        console.log('res?', res);
      },
      error: (error) => {
        console.log('error: ', error);

      }
    })
  }

}
