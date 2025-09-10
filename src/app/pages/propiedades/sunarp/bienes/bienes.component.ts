import { Component, effect, Signal, signal, ViewChild } from '@angular/core';
import { PideService } from '../../../../services/pide.service';
import { CommonModule } from '@angular/common';
import { GridService } from '../../../../services/grid.service';
import { ModalComponent } from '../../../../components/modal/modal.component';
import { DomSanitizer } from '@angular/platform-browser';
import jsPDF from 'jspdf';
import { h } from 'gridjs';
import { SweetAlertService } from '../../../../services/sweet-alert.service';

interface Asiento {
  idImgAsiento: number;
  tipo: string;
  numPag: number;
  listPag?: {
    nroPagRef: number;
    pagina: number;
  };
}

interface Ficha {
  idImgFicha: number;
  tipo: string;
  numPag: number;
  listPag?: {
    nroPagRef: number;
    pagina: number;
  }[]; // En este caso, es un array
}

interface PaginaRef {
  nroPagRef: number;
  pagina: number;
}


@Component({
  selector: 'app-bienes',
  imports: [CommonModule, ModalComponent],
  templateUrl: './bienes.component.html',
})
export default class BienesComponent {

  @ViewChild('globalModal') globalModal!: ModalComponent;

  rowsPartidaData: {
    id: number;
    tipo: string;
    numPag: number;
    nroPagRef?: number;
    pagina?: number;
    transaccion: number;
    nroTotalPag: number;
  }[] = [];

  DATATABLE_ID = 'table-card';
  DATATABLE_PARTIDA_ID = 'table-partida';

  gridInstance: any;
  columns = signal<any[]>([]);
  columnsPartida = signal<any[]>([]);

  dataBienes = signal<any[][]>([]);

  tipoPersona = signal<string>('N');
  apePaterno = signal<string>('');
  apeMaterno = signal<string>('');
  nombres = signal<string>('');
  razSocial = signal<string>('');
  dataPerNatural = signal(null);

  numPartida: number | null = null;

  baseToImage: string = '';

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

  descargarPDF() {
    if (!this.baseToImage) return;

    const pdf = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4'
    });

    // Ajustar tamaño de imagen al tamaño del PDF
    const imgProps = pdf.getImageProperties(this.baseToImage);
    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;

    pdf.addImage(this.baseToImage, 'JPEG', 0, 0, pdfWidth, pdfHeight);
    pdf.save(`partida_${this.numPartida}.pdf`);
  }

  constructor(
    private pideService: PideService,
    private gridService: GridService,
    private sweetAlertService: SweetAlertService,
    private domSanitizer: DomSanitizer
  ) {
    effect(() => {
      const data = this.dataBienes();
      const columns = this.columns();

      if (data.length > 0) {
        this.gridService.destroy(this.DATATABLE_ID);
        this.gridService.render(this.DATATABLE_ID, columns, data, 5);
      }

      (window as any).abrirModalPartida = (partida: number) => {
        this.abrirModal(partida);
      };
    }
    )
  }

  isEmptyObject(obj: any) {
    return obj && Object.keys(obj).length === 0 && obj.constructor === Object;
  }

  isEmptyArrayOfEmptyObjects(arr: any[]): boolean {
    return (
      Array.isArray(arr) &&
      arr.length === 1 &&
      this.isEmptyObject(arr[0])
    );
  }


  abrirModal(partida: number) {
    this.numPartida = partida;
    this.getPartida(this.numPartida);
    setTimeout(() => this.globalModal.open());
  }

  // cerrarModal() {
  //   this.baseToImage = '';
  //   this.globalModal.close();
  // }

  getPartida(numero: number) {
    this.baseToImage = '';
    const post = { partida: numero };

    this.columnsPartida.set([
      {
        name: "ID",
        formatter: (cell: string, row: any) => {
          const index = row.cells[0].data;
          const item = this.rowsPartidaData[index];

          return h(
            'button',
            {
              className: 'badge btn btn-primary p-1 rounded',
              onclick: () => this.getPartidaImg(item)
            },
            item.id?.toString() ?? ''
          );
        }
      },
      { name: "Tipo" },
      { name: "N° Pagina" },
      { name: "N° Pagina Ref" },
    ]);

    this.pideService.getPartida(post).subscribe({
      next: (res) => {
        const data = res.listarAsientosSIRSARPResponse?.asientos || {};

        const listAsientos: Asiento[] = Array.isArray(data.listAsientos)
          ? data.listAsientos
          : data.listAsientos
            ? [data.listAsientos]
            : [];

        const listFichas: Ficha[] = Array.isArray(data.listFichas)
          ? data.listFichas
          : data.listFichas
            ? [data.listFichas]
            : [];

        this.rowsPartidaData = [
          ...listAsientos.map(p => ({
            id: p.idImgAsiento,
            tipo: p.tipo,
            numPag: p.numPag,
            nroPagRef: p.listPag?.nroPagRef,
            pagina: p.listPag?.pagina,
            transaccion: data.transaccion,
            nroTotalPag: data.nroTotalPag,
          })),

          ...listFichas.flatMap(p => {
            const paginas = Array.isArray(p.listPag)
              ? p.listPag
              : p.listPag
                ? [p.listPag]
                : [];

            return paginas
              .filter((q): q is PaginaRef => q !== undefined && q !== null && 'nroPagRef' in q && 'pagina' in q)
              .map(q => ({
                id: p.idImgFicha,
                tipo: p.tipo,
                numPag: p.numPag,
                nroPagRef: q.nroPagRef,
                pagina: q.pagina,
                transaccion: data.transaccion,
                nroTotalPag: data.nroTotalPag,
              }));
          })

        ];

        const allFormatted = this.rowsPartidaData.map((item, index) => [
          index, // se usa para obtener el dato original en el botón
          item.id || '',
          item.tipo || '',
          item.numPag || '',
          item.nroPagRef || ''
        ]);

        this.gridService.render(
          this.DATATABLE_PARTIDA_ID,
          this.columnsPartida(),
          allFormatted,
          8
        );
      },
      error: (error) => {
        console.error('Error en getPartida:', error);
      }
    });
  }

  getPartidaImg(data: {
    id: number;
    tipo: string;
    numPag: number;
    nroPagRef?: number;
    pagina?: number;
    transaccion: number;
    nroTotalPag: number;
  }) {

    this.baseToImage = '';
    const post = {
      transaccion: data.transaccion,
      idImg: data.id,
      tipo: data.tipo,
      nroTotalPag: data.nroTotalPag,
      nroPagRef: data.nroPagRef,
      pagina: data.pagina
    };

    this.pideService.getPartidaImg(post).subscribe({
      next: (res) => {
        const imgResult = res.verAsientoSIRSARPResponse.img || '';
        this.baseToImage = imgResult;
        if (imgResult) {
          this.baseToImage = `data:image/jpeg;base64,${imgResult}`;
        }

      },
      error: (err) => {
        console.error(' Error al obtener imagen:', err);
      }
    });
  }

  getBienesPerNatural() {
    this.dataBienes.set([]);

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
        attributes: {

        },
        formatter: (cell: string) => {
          const statusClass = 'btn btn-primary';
          return h('button', {
            className: `badge ${statusClass} p-1 rounded`,
            'data-bs-toggle': 'modal',
            'data-bs-target': '#modalPartida',
            onclick: () => (window as any).abrirModalPartida(cell),
          },
            cell);
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
        const message = res.buscarTitularidadSIRSARPResponse.respuestaTitularidad?.respuestaTitularidad.mensaje;

        if (message === '' || message == undefined) {
          const personasRaw = res.buscarTitularidadSIRSARPResponse?.respuestaTitularidad?.respuestaTitularidad || {};
          const personas = Array.isArray(personasRaw) ? personasRaw : [personasRaw];

          if (
            personas.length === 0 ||
            this.isEmptyArrayOfEmptyObjects(personas)
          ) {
            this.sweetAlertService.error('Sin resultados', 'No se encontraron datos en la busqueda');
            this.dataBienes.set([]);
            return;
          }

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
          ]);

          this.dataBienes.set(formatted);
          this.sweetAlertService.success('RESULTADO', 'Busqueda satisfactoria');
        } else {
          this.dataBienes.set([]);
          this.sweetAlertService.error('ERROR', message);
        }
      }
    })
  }

  getBienesPerJuridica() {
    this.dataBienes.set([]);

    const post = {
      razonSocial: this.razSocial()
    }

    this.gridService.destroy(this.DATATABLE_ID);

    this.columns.set([
      {
        name: "N°Partida",
        formatter: (cell: string) => {
          const statusClass = 'btn btn-primary';
          return h('button', {
            className: `badge ${statusClass} p-1 rounded`,
            onclick: () => (window as any).abrirModalPartida(cell),
          },
            cell);
        }
      },
      { name: "Denominación" },
      { name: "Oficina" },
      { name: "Tipo" },
      { name: "Zona" },
    ]);

    this.pideService.getBienesPerJuridica(post).subscribe({
      next: (res) => {
        if (res.personaJuridica !== null) {
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
          this.sweetAlertService.success('RESULTADO', 'Busqueda satisfactoria');
        }else{
          this.sweetAlertService.info('', 'Sin resultados en la busqueda')
        }
      },
      error: (error) => {
        console.log('error: ', error);
        this.sweetAlertService.error('ERROR', 'Ocurrió un error');
      }
    })
  }

}
