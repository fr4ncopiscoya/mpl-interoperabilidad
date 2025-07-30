import { Component, computed, inject, OnInit, signal, ViewChild } from '@angular/core';
import { SessionService } from '../../services/session.service';
import { ModalComponent } from "../modal/modal.component";
import { PideService } from '../../services/pide.service';
import { SweetAlertService } from '../../services/sweet-alert.service';

@Component({
  selector: 'app-navbar',
  imports: [ModalComponent],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css'
})
export class NavbarComponent {

  @ViewChild('updatePassword') changePassword!: ModalComponent;
  

  private session = inject(SessionService);
  private pideService = inject(PideService);
  private sweetAlertService = inject(SweetAlertService);
  
  USERNAME = computed(() => this.session.user_name());
  IDUSER = computed(() => this.session.user_id());

  newPass = signal<string>('');

  updatePassUser(){
    const post ={
      password : this.newPass(),
      iduser : this.IDUSER()
    }
    this.pideService.updatePasswordUser(post).subscribe({
      next: (res) =>{
        console.log('response: ', res);
        if(!res.success){
          this.sweetAlertService.error('ERROR', res.message);
        }else{
          this.sweetAlertService.success('Resultado Exitoso',res.message);
          this.changePassword.close();
        }
      },
      error: (err) =>{
        console.log('error: ', err);
        this.sweetAlertService.error('ERROOR', err.error.message)
      }
    })
  }

  closeSession() {
    this.session.clearSession();
  }

}
