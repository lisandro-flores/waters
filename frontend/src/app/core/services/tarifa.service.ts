import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Tarifa } from '../models/models';

@Injectable({ providedIn: 'root' })
export class TarifaService {
  private url = `${environment.apiUrl}/tarifas`;

  constructor(private http: HttpClient) {}

  listar(): Observable<Tarifa[]> {
    return this.http.get<Tarifa[]>(this.url);
  }

  getById(id: number): Observable<Tarifa> {
    return this.http.get<Tarifa>(`${this.url}/${id}`);
  }

  crear(tarifa: Partial<Tarifa>): Observable<Tarifa> {
    return this.http.post<Tarifa>(this.url, tarifa);
  }

  actualizar(id: number, tarifa: Partial<Tarifa>): Observable<Tarifa> {
    return this.http.put<Tarifa>(`${this.url}/${id}`, tarifa);
  }

  eliminar(id: number): Observable<void> {
    return this.http.delete<void>(`${this.url}/${id}`);
  }
}
