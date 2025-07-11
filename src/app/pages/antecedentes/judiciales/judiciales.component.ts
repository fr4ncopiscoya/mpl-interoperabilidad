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
      primerApellido: this.apeMaterno(),
      segundoApellido: this.apeMaterno(),
      nombres: this.nombres(),
    }

    this.pideService.getAJudiciales(post).subscribe({
      next:(res)=>{
        console.log('res: ', res);
        
      },
      error:(error)=>{
        console.log('error: ', error);
        
      }
    })

  }

}
