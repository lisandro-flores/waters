import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Lectura } from '../models/models';

@Injectable({ providedIn: 'root' })
export class LecturaService {
  private url = `${environment.apiUrl}/lecturas`;

  constructor(private http: HttpClient) {}

  getPorMedidor(medidorId: number): Observable<Lectura[]> {
    return this.http.get<Lectura[]>(`${this.url}/medidor/${medidorId}`);
  }

  getPorPeriodo(anio: number, mes: number): Observable<Lectura[]> {
    const params = new HttpParams().set('anio', anio).set('mes', mes);
    return this.http.get<Lectura[]>(`${this.url}/periodo`, { params });
  }

  registrar(lectura: Partial<Lectura>): Observable<Lectura> {
    return this.http.post<Lectura>(this.url, lectura);
  }
}
