import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Alerta, DashboardData } from '../models/models';

@Injectable({ providedIn: 'root' })
export class ReporteService {
  private url = `${environment.apiUrl}/reportes`;

  constructor(private http: HttpClient) {}

  getDashboard(): Observable<DashboardData> {
    return this.http.get<DashboardData>(`${this.url}/dashboard`);
  }

  getMorosidad(): Observable<any> {
    return this.http.get(`${this.url}/morosidad`);
  }

  getRecaudacionMensual(): Observable<Record<string, number>> {
    return this.http.get<Record<string, number>>(`${this.url}/recaudacion-mensual`);
  }

  getAlertasPendientes(): Observable<Alerta[]> {
    return this.http.get<Alerta[]>(`${environment.apiUrl}/alertas?estado=PENDIENTE`);
  }
}
