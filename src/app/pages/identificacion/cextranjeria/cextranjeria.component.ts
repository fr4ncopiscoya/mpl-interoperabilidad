import { Component, signal } from '@angular/core';
import { ResultMessageComponent } from "../../../components/result-message/result-message.component";
import { ResultMessageService } from '../../../services/result-message.service';
import { PideService } from '../../../services/pide.service';

interface DatosPersona {

  apepaterno: string,
  apematerno: string,
  nombres: string,
  calmigratoria: string
}


@Component({
  selector: 'app-cextranjeria',
  imports: [ResultMessageComponent],
  templateUrl: './cextranjeria.component.html',
  styleUrl: './cextranjeria.component.css'
})
export default class CextranjeriaComponent {

  constructor(private pideService: PideService) {

  }

  dataExtranjeria = signal<DatosPersona | null>(null);

  getCExtranjeria(query: string) {
    const post = {
      docconsulta: query
    }
    this.pideService.getCarnetExtranjeria(post).subscribe({
      next: (res) => {
        console.log('result ', res);
        const data = res.datosPersonales

        this.dataExtranjeria.set(data);
      },
      error: (error) => {
        console.log('error: ', error);
        this.dataExtranjeria.set(null);
      }
    })
  }

}
