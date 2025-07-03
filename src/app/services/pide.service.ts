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

  loginAuth(data:any){
    return this.http.post(`${environment.apiBackend}/pide/login`, data);
  }
  // ===== ADMIN ===== 
  getAllUsers(data: any): Observable<any> {
    return this.http.post(`${environment.apiBackend}/pide/sel-users`, data);
  }


  // ===== IDENTIFICACIÓN =====
  getReniec(data: any): Observable<any> {
    return this.http.post(`${environment.apiBackend}/pide/sel-reniec`, data);
  }
  getCarnetExtranjeria(data: any): Observable<any> {
    return this.http.post(`${environment.apiBackend}/pide/sel-cextranjeria`, data);
  }

  // ===== SUNARP =====
  getPartida(data: any): Observable<any> {
    return this.http.post(`${environment.apiBackend}/pide/sel-partida`, data);
  }
  getPartidaImg(data: any): Observable<any> {
    return this.http.post(`${environment.apiBackend}/pide/sel-partidaimg`, data);
  }
  getRegistroVehicular(data: any): Observable<any> {
    return this.http.post(`${environment.apiBackend}/pide/sel-rvehicular`, data);
  }
  getBienesPerNatural(data: any): Observable<any> {
    return this.http.post(`${environment.apiBackend}/pide/sel-bienespernatural`, data);
  }
  getBienesPerJuridica(data: any): Observable<any> {
    return this.http.post(`${environment.apiBackend}/pide/sel-bienesperjuridica`, data);
  }

  // ===== SUNEDU =====
  getSunedu(data: any): Observable<any> {
    return this.http.post(`${environment.apiBackend}/pide/sel-sunedu`, data);
  }


  // ===== ANTECEDENTES =====
  getAPolicialNumDoc(data: any): Observable<any> {
    return this.http.post(`${environment.apiBackend}/pide/sel-antpol-numdoc`, data);
  }
  getAPolicialNomPatMat(data: any): Observable<any> {
    return this.http.post(`${environment.apiBackend}/pide/sel-antpol-nompatmat`, data);
  }
  getAPolicialNomPat(data: any): Observable<any> {
    return this.http.post(`${environment.apiBackend}/pide/sel-antpol-nompat`, data);
  }
  getAPolicialCodPer(data: any): Observable<any> {
    return this.http.post(`${environment.apiBackend}/pide/sel-antpol-codper`, data);
  }

}
