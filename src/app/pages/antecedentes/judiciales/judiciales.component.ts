import { Component, inject, signal } from '@angular/core';
import { PideService } from '../../../services/pide.service';
import { SweetAlertService } from '../../../services/sweet-alert.service';

@Component({
  selector: 'app-judiciales',
  imports: [],
  templateUrl: './judiciales.component.html',
})
export default class JudicialesComponent {

  apePaterno = signal<string>('');
  apeMaterno = signal<string>('');
  nombres = signal<string>('');

  private pideService = inject(PideService);
  private sweetAlertService = inject(SweetAlertService);

  resetFields(){
    this.apePaterno.set('');
    this.apeMaterno.set('');
    this.nombres.set('');
  }

  searchAntJudiciales(){
    const post = {
      primerApellido: this.apePaterno(),
      segundoApellido: this.apeMaterno(),
      nombres: this.nombres(),
    }
    
    this.pideService.getAJudiciales(post).subscribe({
      next:(res)=>{
        const data = res.echoResponse??res;
        const code = data.codigoError
        const message = data.mensajeError
        const resultado = data.resultado

        if(code !== "OK"){
          this.sweetAlertService.error('ERROR !', message)
        }else{
          this.sweetAlertService.success(resultado, message)
        }
        
      },
      error:(error)=>{
        console.log('error: ', error);
        this.sweetAlertService.error('ERROR - SYSTEM!', error)
      }
    })

  }

}
