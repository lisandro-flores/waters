import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { PageResponse, Suscriptor } from '../models/models';

@Injectable({ providedIn: 'root' })
export class SuscriptorService {
  private url = `${environment.apiUrl}/suscriptores`;

  constructor(private http: HttpClient) {}

  listar(page = 0, size = 20, q = ''): Observable<PageResponse<Suscriptor>> {
    let params = new HttpParams().set('page', page).set('size', size);
    if (q) params = params.set('q', q);
    return this.http.get<PageResponse<Suscriptor>>(this.url, { params });
  }

  getById(id: number): Observable<Suscriptor> {
    return this.http.get<Suscriptor>(`${this.url}/${id}`);
  }

  crear(suscriptor: Partial<Suscriptor>): Observable<Suscriptor> {
    return this.http.post<Suscriptor>(this.url, suscriptor);
  }

  actualizar(id: number, suscriptor: Partial<Suscriptor>): Observable<Suscriptor> {
    return this.http.put<Suscriptor>(`${this.url}/${id}`, suscriptor);
  }
}
