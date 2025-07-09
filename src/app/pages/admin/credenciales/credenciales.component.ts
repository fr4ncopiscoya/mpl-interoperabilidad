import { Component, inject } from '@angular/core';
import { PideService } from '../../../services/pide.service';

@Component({
  selector: 'app-credenciales',
  imports: [],
  templateUrl: './credenciales.component.html',
  styleUrl: './credenciales.component.css'
})
export default class CredencialesComponent {

  private pideService = inject(PideService);

  updateReniecCredentials(){
    const post ={

    };

    this.pideService.updateReniecCredentials(post).subscribe({
      next:(res) =>{
        console.log('resonse: ', res);
        
      },
      error:(error)=>{
        console.log('error: ', error);
        
      }
    })
  }

}
