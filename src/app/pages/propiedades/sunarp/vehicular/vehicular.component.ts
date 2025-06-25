import { Component, computed, signal } from '@angular/core';
import { ResultMessageComponent } from '../../../../components/result-message/result-message.component';
import { ResultMessageService } from '../../../../services/result-message.service';
import { PideService } from '../../../../services/pide.service';

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
  imports: [ResultMessageComponent],
  templateUrl: './vehicular.component.html',
  styleUrl: './vehicular.component.css'
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
    private resultMessage: ResultMessageService,
    private pideService: PideService
  ) { }

  getRegistroVehicular(query: string) {
    const post = { placa: query.toUpperCase() };

    this.pideService.getRegistroVehicular(post).subscribe({
      next: (res) => {
        const vehiculo = res.verDetalleRPVExtraResponse.vehiculo;
        if(vehiculo.placa !== null){
          this.dataVehiculo.set(vehiculo);
          this.resultMessage.setResult('Consulta exitosa', 'success');
        }else{
          this.resultMessage.setResult('Placa no encontrada', 'danger');
          this.dataVehiculo.set(null);
        }
      },
      error: () => {
        this.resultMessage.setResult('Error en la consulta', 'danger');
        this.dataVehiculo.set(null);
      }
    });
  }
}
