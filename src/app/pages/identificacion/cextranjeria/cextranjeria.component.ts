import { Component, inject, signal } from '@angular/core';
import { PideService } from '../../../services/pide.service';
import { SweetAlertService } from '../../../services/sweet-alert.service';
import { InputSearchComponent } from "../../../components/input-search/input-search.component";

interface DatosPersona {

  apepaterno: string,
  apematerno: string,
  nombres: string,
  calmigratoria: string
}


@Component({
  selector: 'app-cextranjeria',
  imports: [InputSearchComponent],
  templateUrl: './cextranjeria.component.html',
})
export default class CextranjeriaComponent {

  private pideService = inject(PideService);
  private sweetAlertService = inject(SweetAlertService);

  dataExtranjeria = signal<DatosPersona | null>(null);

  getCExtranjeria(query: string) {
    const post = {
      docconsulta: query
    }
    if (query.length === 9) {
      this.pideService.getCarnetExtranjeria(post).subscribe({
        next: (res) => {
          const codigo = res.codRespuesta;
          const message = res.desRespuesta;

          if(codigo !== '0000'){
            this.sweetAlertService.error('ERROR', message);
          }else{
            const data = res.datosPersonales
            this.dataExtranjeria.set(data);
            this.sweetAlertService.success('', message);
          }


        },
        error: (error) => {
          console.log('error: ', error);
          this.dataExtranjeria.set(null);
          this.sweetAlertService.error('ERROR', error);
        }
      })
    }else{
      this.sweetAlertService.info('', 'Por favor ingresar minimo 9 caracteres');
    }
  }

}
