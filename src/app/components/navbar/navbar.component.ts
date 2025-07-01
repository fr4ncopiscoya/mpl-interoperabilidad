import { Component, computed, inject, OnInit, signal } from '@angular/core';
import { SessionService } from '../../services/session.service';

@Component({
  selector: 'app-navbar',
  imports: [],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css'
})
export class NavbarComponent {

  private session = inject(SessionService);
  USERNAME = computed(() => this.session.user_name());

  closeSession() {
    this.session.clearSession();
  }

}
