import { Component, inject, signal } from '@angular/core';
import { PideService } from '../../../services/pide.service';
import { SweetAlertService } from '../../../services/sweet-alert.service';

@Component({
  selector: 'app-penales',
  imports: [],
  templateUrl: './penales.component.html',
})
export default class PenalesComponent {

  private pideService = inject(PideService);
  private sweetAlertService = inject(SweetAlertService);

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
      primer_nombre: this.primer_nombre(),
      segundo_nombre: this.segundo_nombre(),
      tercer_nombre: this.tercer_nombre(),
      nuDni: this.nuDni()
    }

    this.pideService.getAPenales(post).subscribe({
      next:(res)=>{
        const data = res.verificarAntecedentesPenalesResponse;
        const codigo = data.xCodigoRespuesta;
        const message = data.xMensajeRespuesta;

        if(codigo == '0001'){     
          this.sweetAlertService.success(codigo,message);
        }else{
          this.sweetAlertService.error(codigo,message);  
        }
      },
      error:(error)=>{
        console.log('error:', error);
      }
    })

    console.log('post: ', post);

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
