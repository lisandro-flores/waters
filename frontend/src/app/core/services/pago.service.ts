import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Pago, MetodoPago } from '../models/models';

@Injectable({ providedIn: 'root' })
export class PagoService {
  private url = `${environment.apiUrl}/pagos`;

  constructor(private http: HttpClient) {}

  registrar(payload: {
    facturaId: number;
    monto: number;
    metodoPago: MetodoPago;
    referencia?: string;
  }): Observable<Pago> {
    return this.http.post<Pago>(this.url, payload);
  }

  getPorFactura(facturaId: number): Observable<Pago[]> {
    return this.http.get<Pago[]>(`${this.url}/factura/${facturaId}`);
  }

  listar(): Observable<Pago[]> {
    return this.http.get<Pago[]>(this.url);
  }
}
