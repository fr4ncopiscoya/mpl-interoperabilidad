import { Component, effect, signal } from '@angular/core';
import { PideService } from '../../../services/pide.service';
import { Grid } from 'gridjs';
import { GridService } from '../../../services/grid.service';

@Component({
  selector: 'app-sunedu',
  standalone: true,
  imports: [],
  templateUrl: './sunedu.component.html',
  styleUrls: [
    './sunedu.component.css',
    "../../../../assets/libs/gridjs/theme/mermaid.min.css"
  ]
})
export default class SuneduComponent {

  DATATABLE_ID = 'table-card';
  message: string = 'NO HAY RESULTADOS';

  columns = signal<string[]>([]);
  dataSunedu = signal<any[][]>([]);

  constructor(
    private pideService: PideService,
    private gridService: GridService
  ) {
    effect(() => {
      const data = this.dataSunedu();
      const col = this.columns();
      if (data.length > 0) {
        this.gridService.render(this.DATATABLE_ID, col, data)
        this.message = '';
      }
    });
  }

  getSunedu(query: string) {
    const post = {
      nroDocIdentidad: query
    };

    this.columns.set([
      "Ap.Paterno", "Ap.Materno", "Nombres",
      "Título", "Universidad", "País",
      "Resolución", "F.Emisión", "F.Resolución"
    ]);

    if (query.length > 7) {
      this.pideService.getSunedu(post).subscribe({
        next: (res) => {

          const persona = [].concat(res.opConsultarRNGTResponse?.listaGTPersona?.gtPersona || []);
          const codigo = res.opConsultarRNGTResponse?.respuesta?.cGenerico?.$;
          const errorMessage = res.opConsultarRNGTResponse?.respuesta?.dGenerica?.$;

          if (codigo !== '00000') {
            this.message = errorMessage
            this.dataSunedu.set([]);
            this.gridService.destroy(this.DATATABLE_ID);
            return
          }

          const formatted = persona.map((p: any) => [
            p.apellidoPaterno?.$ || '',
            p.apellidoMaterno?.$ || '',
            p.nombres?.$ || '',
            p.tituloProfesional?.$ || '',
            p.universidad?.$ || '',
            p.pais?.$ || '',
            p.resolucion?.$ || '',
            p.fechaEmision?.$ || '',
            p.fechaResolucion?.$ || ''
          ]);


          this.dataSunedu.set(formatted);
        },
        error: (error) => {
          console.log('error: ', error);
          this.message = error
          this.dataSunedu.set([]);
          this.gridService.destroy(this.DATATABLE_ID);
        }
      });
    } else {
      this.dataSunedu.set([]);
      this.gridService.destroy(this.DATATABLE_ID);
    }
  }
}
