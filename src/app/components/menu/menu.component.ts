import { Component, computed, inject } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { SessionService } from '../../services/session.service';
import { Menu } from '../../interfaces/pide.interface';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-menu',
  standalone: true,
  imports: [RouterLink, RouterLinkActive, CommonModule],
  templateUrl: './menu.component.html',
  styleUrl: './menu.component.css'
})
export class MenuComponent {

  private session = inject(SessionService);

  private extraChildren: Menu[] = [
    {
      ID: 10,
      DESCRIPCION: 'Titularidad Bienes',
      RUTA: '/pide/sunarp/bienes',
      ID_PADRE: 3,
      GRUPO: 'Propiedades'
    },
    {
      ID: 11,
      DESCRIPCION: 'Registro Vehicular',
      RUTA: '/pide/sunarp/vehicular',
      ID_PADRE: 3,
      GRUPO: 'Propiedades'
    },
    {
      ID: 12,
      DESCRIPCION: 'Consulta Partida',
      RUTA: '/pide/sunarp/partida',
      ID_PADRE: 3,
      GRUPO: 'Propiedades'
    }
  ];

  sanitizeId(key: string): string {
    return 'sidebar' + key.replace(/\s+/g, '');
  }

  getGroupIcon(key: string): string {
    const iconMap: Record<string, string> = {
      'Usuarios': 'bi bi-lock-fill',
      'Identificación': 'bi bi-person-bounding-box',
      'Propiedades': 'bi bi-collection-fill',
      // 'Propiedades': 'bi bi-journal-text',
      'Antecedentes': 'bi bi-incognito'
    };
    return iconMap[key] || 'bi bi-folder';
  }

  groupedMenus = computed(() => {
    const originalMenus = this.session.menus()?.filter((menu: Menu) => menu.ESTATUS === 1);
    if (!originalMenus || !Array.isArray(originalMenus)) return {};

    const flatMenus: Menu[] = [...originalMenus];

    // Si hay SUNARP activo, agregamos sus submenús
    const sunarp = flatMenus.find(m => m.ID === 3);
    if (sunarp) {
      sunarp.children = this.extraChildren;
    }


    // Agrupar solo por GRUPO
    const grouped: { [key: string]: Menu[] } = {};
    flatMenus.forEach(menu => {
      const group = menu.GRUPO || 'Otros';
      if (!grouped[group]) grouped[group] = [];
      grouped[group].push(menu);
    });

    return grouped;
  });

}
