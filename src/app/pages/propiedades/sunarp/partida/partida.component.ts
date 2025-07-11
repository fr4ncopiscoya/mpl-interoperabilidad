import { Component, effect, inject, signal, ViewChild } from '@angular/core';
import { PideService } from '../../../../services/pide.service';
import { ModalComponent } from '../../../../components/modal/modal.component';
import { DomSanitizer } from '@angular/platform-browser';
import jsPDF from 'jspdf';
import { h } from 'gridjs';
import { GridService } from '../../../../services/grid.service';
import { CommonModule } from '@angular/common';
import { InputSearchComponent } from "../../../../components/input-search/input-search.component";

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
  selector: 'app-partida',
  imports: [ModalComponent, CommonModule, InputSearchComponent],
  templateUrl: './partida.component.html'
})
export default class PartidaComponent {

  @ViewChild('globalModal') globalModal!: ModalComponent;

  DATATABLE_PARTIDA_ID = 'table-card';

  numPartida: number | null = null;

  baseToImage: string = '';
  columnsPartida = signal<any[]>([]);

  dataPartida = signal<any[][]>([]);

  private pideService = inject(PideService);
  private gridService = inject(GridService);

  constructor(
  ) {
    effect(() => {
      this.baseToImage = '';
      const data = this.dataPartida();
      const columns = this.columnsPartida();

      if (data.length > 0) {
        this.gridService.render(this.DATATABLE_PARTIDA_ID, columns, data, 5);
      }

      // (window as any).abrirModalPartida = (partida: number) => {
      //   this.abrirModal(partida);
      // };
    }
    )
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

  // abrirModal(partida: number) {
  //   this.numPartida = partida;
  //   this.getPartida(this.numPartida);
  //   setTimeout(() => this.globalModal.open());
  // }

  rowsPartidaData: {
    id: number;
    tipo: string;
    numPag: number;
    nroPagRef?: number;
    pagina?: number;
    transaccion: number;
    nroTotalPag: number;
  }[] = [];

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

  getPartida(numero: any) {
    this.numPartida = numero;
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

}
