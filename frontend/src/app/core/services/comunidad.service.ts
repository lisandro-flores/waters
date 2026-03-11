import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Comunidad } from '../models/models';

@Injectable({ providedIn: 'root' })
export class ComunidadService {
  private url = `${environment.apiUrl}/comunidades`;

  constructor(private http: HttpClient) {}

  getMiComunidad(): Observable<Comunidad> {
    return this.http.get<Comunidad>(`${this.url}/mi-comunidad`);
  }

  listar(): Observable<Comunidad[]> {
    return this.http.get<Comunidad[]>(this.url);
  }

  getById(id: number): Observable<Comunidad> {
    return this.http.get<Comunidad>(`${this.url}/${id}`);
  }

  crear(comunidad: Partial<Comunidad>): Observable<Comunidad> {
    return this.http.post<Comunidad>(this.url, comunidad);
  }

  actualizar(id: number, comunidad: Partial<Comunidad>): Observable<Comunidad> {
    return this.http.put<Comunidad>(`${this.url}/${id}`, comunidad);
  }
}
