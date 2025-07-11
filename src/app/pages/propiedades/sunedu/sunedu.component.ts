import { Component, effect, signal } from '@angular/core';
import { PideService } from '../../../services/pide.service';
import { Grid } from 'gridjs';
import { GridService } from '../../../services/grid.service';
import { SweetAlertService } from '../../../services/sweet-alert.service';
import { InputSearchComponent } from "../../../components/input-search/input-search.component";

@Component({
  selector: 'app-sunedu',
  standalone: true,
  imports: [InputSearchComponent],
  templateUrl: './sunedu.component.html',
  styleUrls: [
    "../../../../assets/libs/gridjs/theme/mermaid.min.css"
  ]
})
export default class SuneduComponent {

  DATATABLE_ID = 'table-card';

  columns = signal<string[]>([]);
  dataSunedu = signal<any[][]>([]);

  constructor(
    private pideService: PideService,
    private gridService: GridService,
    private sweetAlertService: SweetAlertService
  ) {
    effect(() => {
      const data = this.dataSunedu();
      const col = this.columns();
      if (data.length > 0) {
        this.gridService.render(this.DATATABLE_ID, col, data, 5)
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
            this.dataSunedu.set([]);
            this.gridService.destroy(this.DATATABLE_ID);
            this.sweetAlertService.error('ERROR', errorMessage);
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
          this.sweetAlertService.success('RESULTADO', 'Consulta satisfactoria');
        },
        error: (error) => {
          console.log('error: ', error);
          this.dataSunedu.set([]);
          this.gridService.destroy(this.DATATABLE_ID);
        }
      });
    } else {
      this.dataSunedu.set([]);
      this.gridService.destroy(this.DATATABLE_ID);
      this.sweetAlertService.info('', 'Por favor, ingresar mínimo 8 caracteres');
    }
  }
}
