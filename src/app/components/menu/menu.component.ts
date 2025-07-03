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
      'Identificación': 'bi bi-person-circle',
      'Propiedades': 'bi bi-journal-medical',
      'Antecedentes': 'bi bi-incognito'
    };
    return iconMap[key] || 'bi bi-folder';
  }

  groupedMenus = computed(() => {
    const originalMenus = this.session.menus();
    if (!originalMenus || !Array.isArray(originalMenus)) return {};

    // Clonar los menús originales
    const flatMenus: Menu[] = [...originalMenus];

    // Si existe SUNARP (ID 3), agregarle los hijos extra
    const hasSunarp = flatMenus.some(m => m.ID === 3);
    if (hasSunarp) {
      // Solo añadir si aún no están (evitar duplicados si reejecuta el computed)
      const childIds = new Set(flatMenus.map(m => m.ID));
      this.extraChildren.forEach(child => {
        if (!childIds.has(child.ID)) {
          flatMenus.push(child);
        }
      });
    }

    // Separar padres e hijos
    const parents = flatMenus.filter(m => !m.ID_PADRE);
    const children = flatMenus.filter(m => m.ID_PADRE);

    // Asociar hijos a sus padres
    const withChildren = parents.map(parent => ({
      ...parent,
      children: children.filter(c => c.ID_PADRE === parent.ID)
    }));

    // Agrupar por grupo
    const grouped: { [key: string]: Menu[] } = {};
    withChildren.forEach(menu => {
      const group = menu.GRUPO || 'Otros';
      if (!grouped[group]) grouped[group] = [];
      grouped[group].push(menu);
    });

    return grouped;
  });
}
