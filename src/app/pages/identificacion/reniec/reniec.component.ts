import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PideService } from '../../../services/pide.service';
import { SweetAlertService } from '../../../services/sweet-alert.service';
import { InputSearchComponent } from "../../../components/input-search/input-search.component";

interface DatosPersona {
  apPrimer: string;
  apSegundo: string;
  direccion: string;
  estadoCivil: string;
  foto: string;
  prenombres: string;
  restriccion: string;
  ubigeo: string;
}


@Component({
  selector: 'app-reniec',
  imports: [CommonModule, InputSearchComponent],
  templateUrl: './reniec.component.html',
  styleUrl: './reniec.component.css'
})
export default class ReniecComponent {
  private pideService = inject(PideService);
  private sweetAlertService = inject(SweetAlertService);

  // DATA USUARIO RENIEC
  dataReniec = signal<DatosPersona | null>(null);

  /**
   * CONVERT BASE64 PHOTO
   * @returns Imagen en base64 convertida
   * @throws Imagen por defecto
   */
  getFotoSrc(): string {
    const data = this.dataReniec();
    if (data?.foto) {
      return `data:image/jpeg;base64,${data.foto}`;
    }
    return 'assets/images/avatar2.png';
  }

  /**
   * GET DATA FROM RENIEC 
   * @param query Número de DNI a consultar
   * @returns Datos del contribuyente
   * @throws Si el codeResult es diferente de 0000, devuelve null y errorMessage
   */
  getReniec(query: string) {
    const post = {
      nuDniConsulta: query
    };

    this.pideService.getReniec(post).subscribe({
      next: (res) => {
        const codeResult: string = res.consultarResponse.return.coResultado;
        const message: string = res.consultarResponse.return.deResultado;

        switch (codeResult) {
          case '0000':
            this.dataReniec.set(res.consultarResponse.return.datosPersona);
            this.sweetAlertService.success('', message);
            break;
          default:
            this.dataReniec.set(null);
            this.sweetAlertService.error('ERROR', message);
            break;
        }
      },
      error: (error) => {
        console.error('Error en la petición:', error);
      }
    });
  }

}
