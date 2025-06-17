import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';

interface MenuOptions{
  icon:string,
  label:string,
  route:string,
}

@Component({
  selector: 'app-menu',
  imports: [RouterLink, RouterLinkActive],
  templateUrl: './menu.component.html',
  styleUrl: './menu.component.css'
})
export class MenuComponent {

  menuOptions:MenuOptions[] = [
    {
      icon: 'bi bi-file-earmark-text',
      label: 'Documentos',
      route: '/dashboard/documentos',
    },
    {
      icon: 'bi bi-cloud-upload',
      label: 'Subir Documento',
      route: '/dashboard/upload',
    }
  ]

}
