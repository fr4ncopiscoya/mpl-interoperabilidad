import { Component, effect, signal } from '@angular/core';
import { PideService } from '../../../services/pide.service';
import { GridService } from '../../../services/grid.service';
import { h } from 'gridjs';

@Component({
  selector: 'app-gestion',
  imports: [],
  templateUrl: './gestion.component.html',
  styleUrl: './gestion.component.css'
})
export default class GestionComponent {

  DATATABLE_ID = 'table-card';
  columns = signal<any[]>([]);

  dataUsers = signal<any | null>(null);

  constructor(
    private pideService: PideService,
    private gridService: GridService
  ) {
    this.getUsers();
    effect(() => {
      const data = this.dataUsers();;
      const columns = this.columns();

      if (data.length > 0) {
        this.gridService.render(this.DATATABLE_ID, columns, data, 8);
      }
    })
  }

  getUsers() {
    this.columns.set([
      { name: "ID" },
      { name: "Nombres" },
      { name: "Apellidos" },
      { name: "Usuario" },
      { name: "Correo" },
      // { name: "Agregado" },
      {
        name: "Estado",
        formatter: (cell: string) => {
          const statusClass = cell === 'ACTIVO' ? 'bg-success text-white' : 'bg-danger text-white';
          return h('span', { className: `badge ${statusClass} p-1 rounded` }, cell);
        }
      },
      {
        name: "Acciones",
        formatter: () => {
          return h('div', { className: 'text-end d-flex gap-1' }, [
            h('button', {
              className: 'btn btn-sm btn-warning',
              title: 'Editar usuario',
              // onclick: () => obtener_datos(id),
              'data-bs-toggle': 'modal',
              'data-bs-target': '#myModal2'
            }, h('i', { className: 'bi bi-pencil-square' })),

            h('button', {
              className: 'btn btn-sm btn-secondary',
              title: 'Editar módulo',
              // onclick: () => obtener_datos(id),
            }, h('i', { className: 'bi bi-card-checklist' })),

            h('button', {
              className: 'btn btn-sm btn-info',
              title: 'Cambiar contraseña',
              // onclick: () => get_id_usuario(id),
              'data-bs-toggle': 'modal',
              'data-bs-target': '#myModal3'
            }, h('i', { className: 'bi bi-key-fill' })),

            h('button', {
              className: 'btn btn-sm btn-danger',
              title: 'Borrar usuario',
              // onclick: () => eliminar(id)
            }, h('i', { className: 'bi bi-trash' })),
          ]);
        }
      }
    ]);

    this.pideService.getAllUsers('').subscribe({
      next: (res) => {
        const dataRaw = res
        const data = Array.isArray(dataRaw) ? dataRaw : [dataRaw]

        const formattedTable = data.map((i: any) => [
          i.ID || '',
          i.NOMBRE || '',
          i.APELLIDOS || '',
          i.USUARIO || '',
          i.CORREO || '',
          // i.FECHA_REGISTRO || '',
          i.ESTATUS == '1' ? 'ACTIVO' : 'INACTIVO'
        ])
        this.dataUsers.set(formattedTable);
      },
      error: (error) => {
        console.log('error: ', error);
      }
    })
  }

}
