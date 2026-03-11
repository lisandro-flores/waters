import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Medidor } from '../models/models';

@Injectable({ providedIn: 'root' })
export class MedidorService {
  private url = `${environment.apiUrl}/medidores`;

  constructor(private http: HttpClient) {}

  listar(estado?: string): Observable<Medidor[]> {
    let params = new HttpParams();
    if (estado) {
      params = params.set('estado', estado);
    }
    return this.http.get<Medidor[]>(this.url, { params });
  }

  getPorSuscriptor(suscriptorId: number): Observable<Medidor[]> {
    return this.http.get<Medidor[]>(`${this.url}/suscriptor/${suscriptorId}`);
  }

  getById(id: number): Observable<Medidor> {
    return this.http.get<Medidor>(`${this.url}/${id}`);
  }

  crear(medidor: Partial<Medidor>): Observable<Medidor> {
    return this.http.post<Medidor>(this.url, medidor);
  }

  actualizar(id: number, medidor: Partial<Medidor>): Observable<Medidor> {
    return this.http.put<Medidor>(`${this.url}/${id}`, medidor);
  }

  darDeBaja(id: number): Observable<Medidor> {
    return this.http.patch<Medidor>(`${this.url}/${id}/baja`, {});
  }
}
