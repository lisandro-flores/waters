import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Alerta, EstadoAlerta } from '../models/models';

@Injectable({ providedIn: 'root' })
export class AlertaService {
  private url = `${environment.apiUrl}/alertas`;

  constructor(private http: HttpClient) {}

  listar(estado?: EstadoAlerta): Observable<Alerta[]> {
    let params = new HttpParams();
    if (estado) {
      params = params.set('estado', estado);
    }
    return this.http.get<Alerta[]>(this.url, { params });
  }

  resolver(id: number): Observable<Alerta> {
    return this.http.patch<Alerta>(`${this.url}/${id}/resolver`, {});
  }

  descartar(id: number): Observable<Alerta> {
    return this.http.patch<Alerta>(`${this.url}/${id}/descartar`, {});
  }
}
