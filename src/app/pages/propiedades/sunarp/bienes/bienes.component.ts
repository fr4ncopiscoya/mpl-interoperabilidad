import { Component, effect, signal } from '@angular/core';
import { PideService } from '../../../../services/pide.service';
import { CommonModule } from '@angular/common';
import { GridService } from '../../../../services/grid.service';
import { h } from 'gridjs';

@Component({
  selector: 'app-bienes',
  imports: [CommonModule],
  templateUrl: './bienes.component.html',
  styleUrl: './bienes.component.css'
})
export default class BienesComponent {

  DATATABLE_ID = 'table-card';

  gridInstance: any;
  columns = signal<any[]>([]);

  dataBienes = signal<any[][]>([])

  tipoPersona = signal<string>('N');
  apePaterno = signal<string>('');
  apeMaterno = signal<string>('');
  nombres = signal<string>('');
  razSocial = signal<string>('')
  dataPerNatural = signal(null);


  changeTipoPersona(value: string) {
    this.tipoPersona.set(value);
    this.resetFields();
  }

  resetFields() {
    this.apePaterno.set('');
    this.apeMaterno.set('');
    this.nombres.set('');
    this.razSocial.set('');
    this.gridService.destroy(this.DATATABLE_ID);
  }

  searchBienes() {
    if (this.tipoPersona() === 'N') {
      this.getBienesPerNatural()
    } else {
      this.getBienesPerJuridica()
    }
  }

  constructor(
    private pideService: PideService,
    private gridService: GridService,
  ) {
    effect(() => {
      const data = this.dataBienes();
      const columns = this.columns();

      if (data.length > 0) {
        this.gridService.destroy(this.DATATABLE_ID);
        this.gridService.render(this.DATATABLE_ID, columns, data, 5);
      }
    }
    )
  }

  getBienesPerNatural() {
    const post = {
      tipoParticipante: 'N',
      apellidoPaterno: this.apePaterno(),
      apellidoMaterno: this.apeMaterno(),
      nombres: this.nombres(),
    }

    this.gridService.destroy(this.DATATABLE_ID);

    this.columns.set([
      {
        name: "N°Partida",
        formatter: (cell: string) => {
          const statusClass = 'btn btn-primary';
          return h('button', { className: `badge ${statusClass} p-1 rounded` }, cell);
        }

      },
      { name: "Ap.Paterno" },
      { name: "Ap.Materno" },
      { name: "Nombre" },
      { name: "Tip" },
      { name: "N°Doc" },
      { name: "Dirección" },
      { name: "Estado" },
      { name: "Libro" },
      { name: "N°Placa" },
      { name: "Oficina" },
      { name: "Registro" },
      { name: "Zona" }
    ]);

    this.pideService.getBienesPerNatural(post).subscribe({
      next: (res) => {
        const personasRaw = res.buscarTitularidadSIRSARPResponse?.respuestaTitularidad?.respuestaTitularidad || {};
        const personas = Array.isArray(personasRaw) ? personasRaw : [personasRaw];


        const formatted = personas.map((p: any) => [
          p.numeroPartida || '',
          p.apMaterno || '',
          p.apPaterno || '',
          p.nombre || '',
          p.tipoDocumento || '',
          p.numeroDocumento || '',
          p.direccion || '',
          p.estado || '',
          p.libro || '',
          p.numeroPlaca || '',
          p.oficina || '',
          p.registro || '',
          p.zona || '',
        ])

        this.dataBienes.set(formatted);
      },
      error: (error) => {
        console.log('error: ', error);
        this.dataBienes.set([]);
      }
    })
  }

  getBienesPerJuridica() {
    const post = {
      razonSocial: this.razSocial()
    }

    this.gridService.destroy(this.DATATABLE_ID);

    this.columns.set([
      "N°Partida", "Denominacion",
      "Oficina", "Tipo", "Zona",
    ]);

    this.pideService.getBienesPerJuridica(post).subscribe({
      next: (res) => {
        const personasRaw = res.personaJuridica.resultado || {};
        const personas = Array.isArray(personasRaw) ? personasRaw : [personasRaw];

        const formatted = personas.map((p: any) => [
          p.partida || '',
          p.denominacion || '',
          p.oficina || '',
          p.tipo || '',
          p.zona || '',
        ])

        this.gridService.destroy(this.DATATABLE_ID);

        this.dataBienes.set(formatted);
      },
      error: (error) => {
        console.log('error: ', error);
      }
    })
  }

}
