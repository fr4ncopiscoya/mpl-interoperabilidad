import { Component, inject } from '@angular/core';
import { PideService } from '../../services/pide.service';

@Component({
  selector: 'app-login',
  imports: [],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export default class LoginComponent {

  private pideService = inject(PideService);

  getCarnetExtranjeria(){
    const post = {
      docconsulta: '006672632'
    };
    this.pideService.getCarnetExtranjeria(post).subscribe({
      next:(res)=>{
        console.log('data CEE:', res);
      },
      error:(error)=>{
        console.log('Error en la petición', error);
        
      }
    })
  }
  



  constructor() {
    // this.getReniec();
    // this.getCarnetExtranjeria();
    // Dispara la solicitud HTTP para que aparezca en la pestaña "Network"
    // this.pideService.getReniec().subscribe({
    //   next: () => {
    //     console.log('Petición completada');
    //   },
    //   error: (error) => {
    //     console.error('Error en la petición:', error);
    //   }
    // });
  }
}
