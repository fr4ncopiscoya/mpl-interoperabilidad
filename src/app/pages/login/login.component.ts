import { Component, inject, signal, ViewChild } from '@angular/core';
import { PideService } from '../../services/pide.service';
import { ToastComponent } from '../../components/toast/toast.component';
import { Router } from '@angular/router';
import { SessionService } from '../../services/session.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-login',
  imports: [ToastComponent, FormsModule, CommonModule],
  templateUrl: './login.component.html',
})
export default class LoginComponent {

  constructor(private route: Router) {
  }
  @ViewChild(ToastComponent) toastComponent!: ToastComponent;

  private pideService = inject(PideService);
  private session = inject(SessionService);

  username = signal<string>('');
  password = signal<string>('');

  USERNAME = signal<string>('');

  togglePassword() {
    let passwordInput = document.getElementById('password-input') as HTMLInputElement;
    let passwordIcon = document.getElementById('passwordEye') as HTMLSpanElement;

    if (passwordIcon.classList.contains('ri-eye-fill')) {
      passwordInput.type = 'text';
      passwordIcon.classList.remove('ri-eye-fill');
      passwordIcon.classList.add('ri-eye-off-fill');
    } else {
      passwordInput.type = 'password';
      passwordIcon.classList.remove('ri-eye-off-fill');
      passwordIcon.classList.add('ri-eye-fill');
    }
  }

  login() {
    let btnLogin = document.getElementById('btnLoginAction') as HTMLButtonElement;
    btnLogin.innerHTML = '<span class="align-items-center"><span class="spinner-border flex-shrink-0" role="status"><span class="visually-hidden">Loading...</span></span><span class="flex-grow-1 ms-2">Ingresando...</span></span>';
    btnLogin.classList.add('pe-none', 'btn-load');

    const post = {
      p_loging: this.username(),
      p_passwd: this.password(),
    };

    this.pideService.loginAuth(post).subscribe({
      next: (res: any) => {
        const code = res.codigo;
        const message = res.mensaje;

        switch (code) {
          case 0:
            this.toastComponent.showToast(message, 'success');

            this.session.user_id.set(res.id_usuario);
            this.session.user_name.set(res.username);
            this.session.menus.set(res.menus);

            // Guardar en localStorage que está logueado
            localStorage.setItem('session-dashboard', 'true'); //con esto valida permiso de ruta
            localStorage.setItem('user-id', res.id_usuario);
            localStorage.setItem('username', res.username);
            localStorage.setItem('menus', JSON.stringify(res.menus));

            setTimeout(() => {
              this.route.navigate(['/pide']);
            }, 2000);
            break;
          case 1:
            this.toastComponent.showToast(message, '');
            break;
          case 2:
            this.toastComponent.showToast(message, '');
            break;
          default:
            break;
        }

        // if (code === 0) {
        // } else {
        //   this.toastComponent.showToast('Acceso denegado al dashboard.', 'danger');
        // }

        btnLogin.innerHTML = 'Ingresar';
        btnLogin.classList.remove('pe-none', 'btn-load');
      },
      error: (error) => {
        console.log('Error en la petición', error);
        btnLogin.innerHTML = 'Ingresar';
        btnLogin.classList.remove('pe-none', 'btn-load');
        this.toastComponent.showToast('Error al iniciar sesión, intentelo nuevamente.', 'danger');
      }
    })
  }

}
