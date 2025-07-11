import { Component, inject, signal } from '@angular/core';
import { PideService } from '../../../services/pide.service';
import { SweetAlertService } from '../../../services/sweet-alert.service';

@Component({
  selector: 'app-credenciales',
  imports: [],
  templateUrl: './credenciales.component.html',
  styleUrl: './credenciales.component.css'
})
export default class CredencialesComponent {

  private pideService = inject(PideService);
  private sweetAlertService = inject(SweetAlertService);

  oldCredential = signal<string>('MPL@2025');
  newCredential = signal<string>('MPL@2025');
  nuDni = signal<string>('');

  resetFields() {
    this.oldCredential.set('');
    this.newCredential.set('');
    this.nuDni.set('');
  }

  updateReniecCredentials() {
    const post = {
      oldCredential: this.oldCredential(),
      newCredential: this.newCredential(),
      nuDni: this.nuDni()
    };

    this.pideService.updateReniecCredentials(post).subscribe({
      next: (res) => {
        const codigo = res.actualizarcredencialResponse.return.coResultado;

        const message = res.actualizarcredencialResponse.return.deResultado;

        if (codigo !== '0000') {
          this.sweetAlertService.error('ERROR', message);
        } else {
          this.sweetAlertService.success('ACTUALIZADO', 'Credenciales actualizados correctamente');
        }

      },
      error: (error) => {
        console.log('error: ', error);

      }
    })
  }

}
