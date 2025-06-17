import { inject, Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { map, Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { Reniec } from '../interfaces/pide.interface';

@Injectable({
  providedIn: 'root'
})
export class PideService {

  private http = inject(HttpClient);

  constructor() { }

  // getReniec(data: any) {
  //   return this.http
  //     .post(`${environment.apiBackend}/pide/sel-reniec`, data)
  //     .pipe(
  //       map((data) => {
  //         return data;
  //       })
  //     );
  // }

  getReniec(data: any): Observable<any> {
    return this.http.post(`${environment.apiBackend}/pide/sel-reniec`, data);
  }
  getCarnetExtranjeria(data: any): Observable<any> {
    return this.http.post(`${environment.apiBackend}/pide/sel-cextranjeria`, data);
  }

  // getReniec(): Observable<Reniec> {
  //   return this.http.get<Reniec>(`${environment.apiBackend}/sel-reniec/`, {
  //     params: {
  //       nuDniConsulta: '74848949',
  //       nuDniUsuario: '25767128',
  //       nuRucUsuario: '20131377062',
  //       password: 'MPL@2025',
  //       out: 'json'
  //     }
  //   });
  // }
}
