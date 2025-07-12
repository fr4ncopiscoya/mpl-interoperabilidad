import { Component, computed, signal } from '@angular/core';
import { PideService } from '../../../../services/pide.service';
import { SweetAlertService } from '../../../../services/sweet-alert.service';
import { InputSearchComponent } from "../../../../components/input-search/input-search.component";

export interface Propietario {
  nombre: string;
}

export interface Vehiculo {
  placa: string;
  serie: string;
  vin: string;
  nro_motor: string;
  color: string;
  marca: string;
  modelo: string;
  estado: string;
  sede: string;
  anoFabricacion: string;
  codCategoria: string;
  codTipoCarr: string;
  carroceria: string;
  propietarios: Propietario | Propietario[];
}

@Component({
  selector: 'app-vehicular',
  imports: [InputSearchComponent],
  templateUrl: './vehicular.component.html',
})
export default class VehicularComponent {

  dataVehiculo = signal<Vehiculo | null>(null);
  // Signal computada que procesa propietarios
  public propietarios = computed(() => {
    const vehiculo = this.dataVehiculo();

    if (!vehiculo || !vehiculo.propietarios) return [];

    if (Array.isArray(vehiculo.propietarios)) {
      return vehiculo.propietarios.map(p => p.nombre);
    } else {
      return [vehiculo.propietarios.nombre];
    }
  });


  constructor(
    private sweetAlertService: SweetAlertService,
    private pideService: PideService
  ) { }

  getRegistroVehicular(query: string) {
    const post = { placa: query.toUpperCase() };

    this.pideService.getRegistroVehicular(post).subscribe({
      next: (res) => {
        if (query.length < 6) {
          this.sweetAlertService.info('', 'Por favor ingrese mínimo 6 caracteres ')
        } else {
          const vehiculo = res.verDetalleRPVExtraResponse.vehiculo;
          if (vehiculo.placa !== null) {
            this.dataVehiculo.set(vehiculo);
            this.sweetAlertService.success('RESULTADO', 'Consulta realizada satisfactoriamente');
          } else {
            this.sweetAlertService.info('', 'Placa no encontrada');
            this.dataVehiculo.set(null);
          }
        }

      },
      error: () => {
        this.sweetAlertService.error('ERROR', 'Ocurrió un error');
        this.dataVehiculo.set(null);
      }
    });
  }
}
