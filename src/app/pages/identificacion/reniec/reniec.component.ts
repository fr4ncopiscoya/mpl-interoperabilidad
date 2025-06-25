import { Component, signal } from '@angular/core';
import { SpinnerService } from '../../../services/spinner.service';
import { CommonModule } from '@angular/common';
import { PideService } from '../../../services/pide.service';
import { ResultMessageService } from '../../../services/result-message.service';
import { ResultMessageComponent } from '../../../components/result-message/result-message.component';

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
  imports: [CommonModule, ResultMessageComponent],
  templateUrl: './reniec.component.html',
  styleUrl: './reniec.component.css'
})
export default class ReniecComponent {
  constructor(
    private pideService: PideService,
    private resultMessage: ResultMessageService,
  ) { }

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
    return '../../../../assets/images/avatar2.png';
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
            this.resultMessage.setResult(message, 'success');
            break;
          default:
            this.dataReniec.set(null);
            this.resultMessage.setResult(message, 'danger');
            break;
        }
      },
      error: (error) => {
        this.resultMessage.setResult('Ocurrió un error', 'danger')
        console.error('Error en la petición:', error);
      }
    });
  }

}
