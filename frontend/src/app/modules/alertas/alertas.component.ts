import { Component, OnInit } from '@angular/core';
import { AlertaService } from '../../core/services/alerta.service';
import { Alerta } from '../../core/models/models';

@Component({
  selector: 'app-alertas',
  standalone: false,
  template: `
    <div class="p-6 space-y-5">
      <div class="flex items-center justify-between">
        <div>
          <h1 class="text-2xl font-medium text-gray-900">Alertas</h1>
          <p class="text-sm text-gray-500 mt-0.5">Monitoreo de alertas del sistema</p>
        </div>
        <div class="flex items-center gap-2">
          <select [(ngModel)]="estadoFilter" (ngModelChange)="loadData()" class="bg-white border border-gray-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-sky-500">
            <option value="">Todas</option>
            <option value="PENDIENTE">Pendientes</option>
            <option value="EN_GESTION">En gestión</option>
            <option value="RESUELTA">Resueltas</option>
            <option value="DESCARTADA">Descartadas</option>
          </select>
        </div>
      </div>

      <!-- Stats -->
      <div class="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div class="bg-red-50 rounded-2xl p-4">
          <p class="text-xs text-gray-400">Pendientes</p>
          <p class="text-lg font-semibold text-red-600 mt-0.5">{{pendientes}}</p>
        </div>
        <div class="bg-amber-50 rounded-2xl p-4">
          <p class="text-xs text-gray-400">Consumo Anómalo</p>
          <p class="text-lg font-semibold text-amber-600 mt-0.5">{{consumoAnomalo}}</p>
        </div>
        <div class="bg-orange-50 rounded-2xl p-4">
          <p class="text-xs text-gray-400">Fugas Posibles</p>
          <p class="text-lg font-semibold text-orange-600 mt-0.5">{{fugas}}</p>
        </div>
        <div class="bg-emerald-50 rounded-2xl p-4">
          <p class="text-xs text-gray-400">Resueltas</p>
          <p class="text-lg font-semibold text-emerald-600 mt-0.5">{{resueltas}}</p>
        </div>
      </div>

      <!-- Alert cards -->
      <div class="space-y-3">
        <div *ngFor="let a of alertas" class="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 hover:shadow-md transition-shadow">
          <div class="flex items-start gap-4">
            <div class="w-10 h-10 rounded-xl flex items-center justify-center shrink-0" [ngClass]="{
              'bg-red-100': a.tipo === 'FUGA_POSIBLE',
              'bg-amber-100': a.tipo === 'CONSUMO_ANOMALO',
              'bg-orange-100': a.tipo === 'MEDIDOR_SIN_LECTURA',
              'bg-sky-100': a.tipo !== 'FUGA_POSIBLE' && a.tipo !== 'CONSUMO_ANOMALO' && a.tipo !== 'MEDIDOR_SIN_LECTURA'
            }">
              <svg *ngIf="a.tipo === 'FUGA_POSIBLE'" xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="text-red-600"><path d="M12 9v4"/><path d="M10.363 3.591l-8.106 13.534a1.914 1.914 0 0 0 1.636 2.871h16.214a1.914 1.914 0 0 0 1.636-2.87L13.637 3.59a1.914 1.914 0 0 0-3.274 0z"/><path d="M12 17h.01"/></svg>
              <svg *ngIf="a.tipo === 'CONSUMO_ANOMALO'" xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="text-amber-600"><path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z"/><path d="M12 9v4"/><path d="M12 17h.01"/></svg>
              <svg *ngIf="a.tipo !== 'FUGA_POSIBLE' && a.tipo !== 'CONSUMO_ANOMALO'" xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="text-sky-600"><circle cx="12" cy="12" r="10"/><path d="M12 16v-4"/><path d="M12 8h.01"/></svg>
            </div>
            <div class="flex-1 min-w-0">
              <div class="flex items-center gap-2 mb-1">
                <span class="text-xs font-medium px-2 py-0.5 rounded-full" [ngClass]="{
                  'bg-red-100 text-red-700': a.tipo === 'FUGA_POSIBLE',
                  'bg-amber-100 text-amber-700': a.tipo === 'CONSUMO_ANOMALO',
                  'bg-orange-100 text-orange-700': a.tipo === 'MEDIDOR_SIN_LECTURA',
                  'bg-sky-100 text-sky-700': a.tipo !== 'FUGA_POSIBLE' && a.tipo !== 'CONSUMO_ANOMALO' && a.tipo !== 'MEDIDOR_SIN_LECTURA'
                }">{{a.tipo?.replace('_', ' ')}}</span>
                <span class="text-xs font-medium px-2 py-0.5 rounded-full" [ngClass]="{
                  'bg-red-100 text-red-700': a.estado === 'PENDIENTE',
                  'bg-emerald-100 text-emerald-700': a.estado === 'RESUELTA',
                  'bg-gray-100 text-gray-600': a.estado === 'DESCARTADA'
                }">{{a.estado}}</span>
              </div>
              <p class="text-sm text-gray-700">{{a.mensaje}}</p>
              <div class="flex items-center gap-4 mt-1 text-xs text-gray-400">
                <span *ngIf="a.suscriptorNombre">{{a.suscriptorNombre}}</span>
                <span>{{a.creadoEn | date:'dd/MM/yyyy HH:mm'}}</span>
              </div>
            </div>
            <div *ngIf="a.estado === 'PENDIENTE'" class="flex items-center gap-1 shrink-0">
              <button (click)="resolver(a)" class="w-8 h-8 rounded-lg hover:bg-emerald-50 text-gray-400 hover:text-emerald-600 flex items-center justify-center transition-colors" title="Resolver">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="20 6 9 17 4 12"/></svg>
              </button>
              <button (click)="descartar(a)" class="w-8 h-8 rounded-lg hover:bg-red-50 text-gray-400 hover:text-red-600 flex items-center justify-center transition-colors" title="Descartar">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
              </button>
            </div>
          </div>
        </div>
      </div>

      <div *ngIf="alertas.length === 0 && !loading" class="bg-white rounded-2xl border border-gray-100 shadow-sm p-12 text-center">
        <p class="text-gray-400">No hay alertas</p>
      </div>
    </div>
  `
})
export class AlertasComponent implements OnInit {
  alertas: Alerta[] = [];
  loading = true;
  estadoFilter = '';

  constructor(private alertaService: AlertaService) {}
  ngOnInit() { this.loadData(); }

  loadData() {
    this.loading = true;
    const estado: any = this.estadoFilter || undefined;
    this.alertaService.listar(estado).subscribe({
      next: (a) => { this.alertas = a; this.loading = false; },
      error: () => this.loading = false
    });
  }

  get pendientes() { return this.alertas.filter(a => a.estado === 'PENDIENTE').length; }
  get resueltas() { return this.alertas.filter(a => a.estado === 'RESUELTA').length; }
  get consumoAnomalo() { return this.alertas.filter(a => a.tipo === 'CONSUMO_ANOMALO' && a.estado === 'PENDIENTE').length; }
  get fugas() { return this.alertas.filter(a => a.tipo === 'FUGA_POSIBLE' && a.estado === 'PENDIENTE').length; }

  resolver(a: Alerta) {
    this.alertaService.resolver(a.id).subscribe({ next: () => this.loadData() });
  }
  descartar(a: Alerta) {
    this.alertaService.descartar(a.id).subscribe({ next: () => this.loadData() });
  }
}
