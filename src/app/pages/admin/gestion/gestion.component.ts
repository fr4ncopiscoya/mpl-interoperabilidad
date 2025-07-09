import { Component, effect, signal, ViewChild } from '@angular/core';
import { PideService } from '../../../services/pide.service';
import { GridService } from '../../../services/grid.service';
import { h } from 'gridjs';
import { AlertModalComponent } from "../../../components/alert-modal/alert-modal.component";
import { ModalComponent } from '../../../components/modal/modal.component';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms'; // For [(ngModel)]
import { ToastComponent } from '../../../components/toast/toast.component';

@Component({
  selector: 'app-gestion',
  imports: [AlertModalComponent, ModalComponent, CommonModule, FormsModule, ToastComponent],
  templateUrl: './gestion.component.html',
  styleUrl: './gestion.component.css'
})
export default class GestionComponent {

  @ViewChild('agregarUsuario') addUserModal!: ModalComponent;
  @ViewChild('editarModulos') modulosModal!: ModalComponent;
  @ViewChild('alertModal') alertModal!: AlertModalComponent;
  @ViewChild(ToastComponent) toastComponent!: ToastComponent;


  //Estado usuario
  status = [
    { ESTATUS: 1, name: 'Activo' },
    { ESTATUS: 0, name: 'Inactivo' }
  ]

  DATATABLE_ID = 'table-card';
  columns = signal<any[]>([]);

  user_id = signal<number | null>(null);
  dataRow: any;

  dataUsers = signal<any | null>(null);
  dataMenus = signal<any | null>(null);
  dataAreas = signal<any | null>(null);

  //Data usuario insert / edit

  titleModal = signal<string>('');
  textButtonModal = signal<string>('');

  usu_id = signal<number>(0);

  usu_nombres = signal<string>('');
  usu_apellidos = signal<string>('');
  usu_correo = signal<string>('');
  usu_usuario = signal<string>('');
  usu_password = signal<string>('');
  usu_dni = signal<string>('');
  usu_estado = signal<number>(1);
  usu_area = signal<number>(1);


  constructor(
    private pideService: PideService,
    private gridService: GridService,
  ) {
    this.getAreas();
    // this.getMenus();
    this.getUsers();
    effect(() => {
      const data = this.dataUsers();
      const columns = this.columns();

      if (data.length > 0) {
        this.gridService.render(this.DATATABLE_ID, columns, data, 8);
      }
    })
  }

  addUser() {
    
    const post = {
      p_usu_id:  this.usu_id(),
      p_usu_nombres:  this.usu_nombres(),
      p_usu_apellidos:  this.usu_apellidos(),
      p_usu_usuario:  this.usu_usuario(),
      p_usu_password:  this.usu_password(),
      p_usu_correo:  this.usu_correo(),
      p_usu_dni:  this.usu_dni(),
      p_usu_area:  this.usu_area(),
      p_usu_estatus:  this.usu_estado(),
    }

    console.log('post: ', post);
    
    this.pideService.insertUser(post).subscribe({
      next:(res)=>{
        console.log('result: ', res);
        setTimeout(() => {
          this.getUsers();
        }, 100);
      },
      error:(error)=>{
        console.log('error: ', error);
        
      }
    })
  }

  addPermissionsByUser() {
    const menus = this.dataMenus();

    if (!menus) return;

    const permisos = menus.map((item: any) => ({
      menu: item.ID,
      estado: item.ESTATUS ? 1 : 0 // si es null o undefined, se toma como 0
    }));



    const post = {
      p_usu_id: this.usu_id(),
      p_permisos_menu: permisos
    }

    this.pideService.insertPermissionsByUser(post).subscribe({
      next: (res) => {
        const message = res.message
        this.toastComponent.showToast(message, 'success');
        console.log('menus-nuevos: ', menus);
      },
      error: (error) => {
        console.log('error: ', error);

      }
    })
  }

  openAddUserModal(data: any) {
    if (data != '') {
      console.log('data-user: ', data);
      // this.user_id.set(data.ID);
      this.titleModal.set('EDITAR');
      
      this.usu_id.set(data.ID)
      this.usu_nombres.set(data.NOMBRE);
      this.usu_apellidos.set(data.APELLIDOS);
      this.usu_usuario.set(data.USUARIO);
      this.usu_password.set(data.PASSWORD);
      this.usu_dni.set(data.DNI);
      this.usu_estado.set(data.ESTATUS);
      this.usu_correo.set(data.CORREO);
      this.usu_area.set(data.AREA);
    } else {
      this.titleModal.set('AGREGAR');

      this.usu_id.set(0);
      this.usu_nombres.set('');
      this.usu_apellidos.set('');
      this.usu_usuario.set('');
      this.usu_password.set('');
      this.usu_dni.set('');
      this.usu_estado.set(1);
      this.usu_correo.set('');
      this.usu_area.set(1);
    }

    this.addUserModal.open();
  }

  openModulosModal(data: any) {
    this.usu_id.set(data.ID);
    this.getMenusByUser(this.usu_id());
    this.modulosModal.open();
  }

  getMenusByUser(id: number) {
    const post = {
      p_user_id: id
    }

    this.pideService.getMenusByUser(post).subscribe({
      next: (res) => {
        this.dataMenus.set(res);
      },
      error: (error) => {
        console.log('error: ', error);
      }
    })
  }

  getAreas() {
    this.pideService.getAreas('').subscribe({
      next: (res) => {
        this.dataAreas.set(res);
      },
      error: (error) => {
        console.log('error: ', error);

      }
    })
  }

  getUsers() {
    const self = this;

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
        formatter: (cell: string, row: any) => {

          const index = row.cells[6].data;
          const item = self.dataRow[index];

          return h('div', { className: 'text-end d-flex gap-1' }, [
            // h('button', {
            //   className: 'btn btn-sm btn-warning',
            //   title: 'Editar usuario',
            //   onclick: () => self.openAddUserModal(item),
            // }, h('i', { className: 'bi bi-pencil-square' })),

            // h('button', {
            //   className: 'btn btn-sm btn-secondary',
            //   title: 'Editar módulo',
            //   onclick: () => self.openModulosModal(item),
            // }, h('i', { className: 'bi bi-card-checklist' })),

            // <a href="#viewContactoffcanvas" data-bs-toggle="offcanvas" onclick="overviewList()" class="text-muted px-1 d-block viewlist-btn"><i class="bi bi-eye-fill"></i></a>
            h('a', {
              className: 'text-muted px-1 d-block viewlist-btn cursor-pointer',
              title: 'Editar Usuario',
              onclick: () => self.openAddUserModal(item),
            }, h('i', { className: 'bi bi-pencil-fill' })),

            h('a', {
              className: 'text-muted px-1 d-block viewlist-btn cursor-pointer',
              title: 'Editar módulo',
              onclick: () => self.openModulosModal(item),
            }, h('i', { className: 'bi bi-list-check' })),
          ])
        }
      }
    ]);

    this.pideService.getAllUsers('').subscribe({
      next: (res) => {
        const dataRaw = res
        const data = Array.isArray(dataRaw) ? dataRaw : [dataRaw]
        this.dataRow = data;

        const formattedTable = data.map((i: any, index) => [
          i.ID || '',
          i.NOMBRE || '',
          i.APELLIDOS || '',
          i.USUARIO || '',
          i.CORREO || '',
          // i.FECHA_REGISTRO || '',
          i.ESTATUS == '1' ? 'ACTIVO' : 'INACTIVO',
          index
        ])
        this.dataUsers.set(formattedTable);
      },
      error: (error) => {
        console.log('error: ', error);
      }
    })
  }

}
