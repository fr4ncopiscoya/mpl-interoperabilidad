import { Component, effect, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PideService } from '../../../services/pide.service';
import { GridService } from '../../../services/grid.service';

@Component({
  selector: 'app-policiales',
  imports: [CommonModule],
  templateUrl: './policiales.component.html',
  styleUrl: './policiales.component.css'
})
export default class PolicialesComponent {

  //Parametros para el grid table
  DATATABLE_ID = 'table-card';
  columns = signal<string[]>([]);

  // Llena tanto antecedentes policiales, penales, judiciales
  dataAntecedentes = signal<any[][]>([]);

  //Tipo de documento para consultar
  tipoDocumento = signal<string>('D');

  //Parametros para pasar por POST
  docIdentidad = signal<string>('');
  apePaterno = signal<string>('');
  apeMaterno = signal<string>('');
  nombre = signal<string>('');
  codigo = signal<string>('');

  constructor(
    private pideService: PideService,
    private gridService: GridService
  ) {
    effect(() => {
      const data = this.dataAntecedentes();
      const columns = this.columns();

      if (data.length > 0) {
        this.gridService.render(this.DATATABLE_ID, columns, data, 5);
      }

    })
  }

  resetFields() {
    this.docIdentidad.set('');
    this.apePaterno.set('');
    this.apeMaterno.set('');
    this.nombre.set('');
    this.codigo.set('');
    this.gridService.destroy(this.DATATABLE_ID);
  }

  changeTipoConsulta(value: string) {
    this.resetFields();
    this.tipoDocumento.set(value);
  }

  searchAntecedentes(value: string) {
    switch (value) {
      case 'D':
        this.getAPolicialNumDoc()
        break;
      case 'N':
        this.getAPolicialNomPatMat()
        break;
      case 'P':
        this.getAPolicialNomPat()
        break;
      case 'C':
        this.getAPolicialCodPer()
        break;

      default:
        break;
    }
  }

  getAPolicialNumDoc() {
    const post = {
      nroDoc: this.docIdentidad()
    }

    this.pideService.getAPolicialNumDoc(post).subscribe({
      next: (res) => {
        // const data = res.consultarPersonaNomPatResponse.RespuestaPersona
        console.log('data: ', res);
      },
      error: (error) => {
        console.log('error: ', error);

      }
    })

  }
  getAPolicialNomPatMat() {
    const post = {
      nombre: this.nombre(),
      paterno: this.apePaterno(),
      materno: this.apeMaterno()
    }

    this.columns.set([
      "Tip.Doc","N°Doc", "Nombres", "Ap.Paterno",
      "Ap.Materno", "Cod.Persona", "Contextura",
      "Doble Identidad", "Nacimiento", "Homonimia",
      "Padre", "Madre", "Sexo", "Talla"
    ])

    this.pideService.getAPolicialNomPatMat(post).subscribe({
      next: (res) => {

        const dataRaw = res.consultarPersonaNomPatMatResponse?.RespuestaPersona || {};
        const data = Array.isArray(dataRaw) ? dataRaw : [dataRaw];

        console.log('data? ', data);


        const formatted = data.map((p: any) => [
          p.tipoDocumento || '',  
          p.nroDocumento || '',
          p.nombres || '',
          p.apellidoPaterno || '',
          p.apellidoMaterno || '',
          p.codigoPersona || '',
          p.contextura || '',
          p.dobleIdentidad || '',
          p.fechaNacimiento || '',
          p.homonimia || '',
          p.nombrePadre || '',
          p.nombreMadre || '',
          p.sexo || '',
          p.talla || '',
        ])

        console.log('forrmatted? ', formatted);


        this.dataAntecedentes.set(formatted);

      },
      error: (error) => {
        console.log('error: ', error);
        this.gridService.destroy(this.DATATABLE_ID);
      }
    })

  }
  getAPolicialNomPat() {
    const post = {
      nombre: this.nombre(),
      paterno: this.apePaterno(),
    }

    this.columns.set([
      "Tip.Doc", "N°Doc", "Nombres", "Ap.Paterno",
      "Ap.Materno", "Cod.Persona", "Contextura",
      "Doble Identidad", "Nacimiento", "Homonimia",
      "Padre", "Madre", "Sexo", "Talla"
    ])


    this.pideService.getAPolicialNomPat(post).subscribe({
      next: (res) => {
        const dataRaw = res.consultarPersonaNomPatResponse?.RespuestaPersona || {};
        const data = Array.isArray(dataRaw) ? dataRaw : [dataRaw];

        const formatted = data.map((p: any) => [
          p.tipoDocumento || '',
          p.nroDocumento || '',
          p.nombres || '',
          p.apellidoPaterno || '',
          p.apellidoMaterno || '',
          p.codigoPersona || '',
          p.contextura || '',
          p.dobleIdentidad || '',
          p.fechaNacimiento || '',
          p.homonimia || '',
          p.nombrePadre || '',
          p.nombreMadre || '',
          p.sexo || '',
          p.talla || '',
        ])

        this.dataAntecedentes.set(formatted);

        console.log('data: ', data);
      },
      error: (error) => {
        console.log('error: ', error);
        this.gridService.destroy(this.DATATABLE_ID);
      }
    })
  }
  getAPolicialCodPer() {
    const post = {
      codigoPersona: this.codigo()
    }

    this.pideService.getAPolicialCodPer(post).subscribe({
      next: (res) => {
        console.log('res: ', res);
      },
      error: (error) => {
        console.log('error: ', error);

      }
    })

  }


}
