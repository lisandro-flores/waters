import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Factura, PageResponse } from '../models/models';

@Injectable({ providedIn: 'root' })
export class FacturaService {
  private url = `${environment.apiUrl}/facturacion`;
  private facturaUrl = `${environment.apiUrl}/facturas`;

  constructor(private http: HttpClient) {}

  generarFactura(lecturaId: number): Observable<Factura> {
    return this.http.post<Factura>(`${this.url}/generar/${lecturaId}`, {});
  }

  generarMasivo(anio: number, mes: number): Observable<{ facturasGeneradas: number }> {
    const params = new HttpParams().set('anio', anio).set('mes', mes);
    return this.http.post<any>(`${this.url}/generar-masivo`, {}, { params });
  }

  listar(page = 0, size = 20): Observable<PageResponse<Factura>> {
    const params = new HttpParams().set('page', page).set('size', size);
    return this.http.get<PageResponse<Factura>>(this.facturaUrl, { params });
  }

  getPorSuscriptor(suscriptorId: number): Observable<Factura[]> {
    return this.http.get<Factura[]>(`${this.facturaUrl}/suscriptor/${suscriptorId}`);
  }

  anular(id: number): Observable<void> {
    return this.http.patch<void>(`${this.facturaUrl}/${id}/anular`, {});
  }
}
