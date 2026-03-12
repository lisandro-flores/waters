import { Component, OnInit } from '@angular/core';
import { LecturaService } from '../../../core/services/lectura.service';
import { Lectura } from '../../../core/models/models';

@Component({
  selector: 'app-lecturas-list',
  standalone: false,
  template: `
    <div class="p-6 space-y-5">
      <div class="flex items-center justify-between">
        <div>
          <h1 class="text-2xl font-medium text-gray-900">Lecturas</h1>
          <p class="text-sm text-gray-500 mt-0.5">Registro y gestión de lecturas de medidores</p>
        </div>
        <button (click)="showForm = true" class="flex items-center gap-2 bg-sky-600 hover:bg-sky-700 text-white rounded-xl px-4 py-2.5 text-sm font-medium transition-colors shadow-sm">
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M5 12h14"/><path d="M12 5v14"/></svg>
          Nueva lectura
        </button>
      </div>

      <!-- Period filter -->
      <div class="bg-white rounded-2xl border border-gray-100 shadow-sm p-4">
        <div class="flex flex-col sm:flex-row gap-3 items-end">
          <div>
            <label class="block text-sm text-gray-700 mb-1 font-medium">Año</label>
            <input type="number" [(ngModel)]="anio" class="border border-gray-200 rounded-xl px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-sky-500 w-28" />
          </div>
          <div>
            <label class="block text-sm text-gray-700 mb-1 font-medium">Mes</label>
            <select [(ngModel)]="mes" class="border border-gray-200 rounded-xl px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-sky-500 bg-white w-36">
              <option *ngFor="let m of meses; let i = index" [ngValue]="i + 1">{{m}}</option>
            </select>
          </div>
          <button (click)="loadData()" class="bg-sky-600 hover:bg-sky-700 text-white rounded-xl px-4 py-2.5 text-sm font-medium transition-colors">
            Consultar
          </button>
        </div>
      </div>

      <!-- Table -->
      <div class="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div class="overflow-x-auto">
          <table class="w-full text-sm">
            <thead class="bg-slate-50 border-b border-gray-100">
              <tr class="text-left text-xs text-gray-400 uppercase tracking-wider">
                <th class="px-4 py-3">Medidor</th>
                <th class="px-4 py-3">Ant.</th>
                <th class="px-4 py-3">Actual</th>
                <th class="px-4 py-3">Consumo m³</th>
                <th class="px-4 py-3 hidden md:table-cell">Fecha</th>
                <th class="px-4 py-3">Estado</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-gray-50">
              <tr *ngFor="let l of lecturas" class="hover:bg-slate-50 transition-colors">
                <td class="px-4 py-3 text-gray-600 font-mono text-xs">{{l.medidorSerie || 'M-' + l.medidorId}}</td>
                <td class="px-4 py-3 text-gray-600">{{l.lecturaAnterior}}</td>
                <td class="px-4 py-3 text-gray-800 font-medium">{{l.lecturaActual}}</td>
                <td class="px-4 py-3">
                  <span class="text-sky-700 font-semibold">{{l.consumoM3}} m³</span>
                </td>
                <td class="px-4 py-3 hidden md:table-cell text-gray-500 text-xs">{{l.fechaLectura || '-'}}</td>
                <td class="px-4 py-3">
                  <span *ngIf="l.estimada" class="px-2.5 py-1 rounded-full text-xs font-medium bg-amber-100 text-amber-700">Estimada</span>
                  <span *ngIf="!l.estimada" class="px-2.5 py-1 rounded-full text-xs font-medium bg-emerald-100 text-emerald-700">Real</span>
                </td>
              </tr>
              <tr *ngIf="lecturas.length === 0 && !loading">
                <td colspan="6" class="px-4 py-12 text-center text-gray-400">No hay lecturas para este período</td>
              </tr>
            </tbody>
          </table>
        </div>
        <div class="px-4 py-3 bg-slate-50 border-t border-gray-100 text-xs text-gray-400">
          {{lecturas.length}} lecturas en el período
        </div>
      </div>

      <!-- New reading modal -->
      <div *ngIf="showForm" class="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4" (click)="showForm = false">
        <div class="bg-white rounded-2xl shadow-2xl w-full max-w-lg p-6" (click)="$event.stopPropagation()">
          <h2 class="text-xl font-medium text-gray-900 mb-5">Registrar Lectura</h2>
          <div class="grid grid-cols-2 gap-4">
            <div>
              <label class="block text-sm text-gray-700 mb-1 font-medium">ID Medidor</label>
              <input type="number" [(ngModel)]="newLectura.medidorId" class="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-sky-500" />
            </div>
            <div>
              <label class="block text-sm text-gray-700 mb-1 font-medium">Lectura Actual</label>
              <input type="number" [(ngModel)]="newLectura.lecturaActual" class="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-sky-500" />
            </div>
            <div>
              <label class="block text-sm text-gray-700 mb-1 font-medium">Año</label>
              <input type="number" [(ngModel)]="newLectura.anio" class="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-sky-500" />
            </div>
            <div>
              <label class="block text-sm text-gray-700 mb-1 font-medium">Mes</label>
              <input type="number" [(ngModel)]="newLectura.mes" min="1" max="12" class="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-sky-500" />
            </div>
            <div class="col-span-2">
              <label class="block text-sm text-gray-700 mb-1 font-medium">Observaciones</label>
              <input [(ngModel)]="newLectura.observaciones" class="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-sky-500" placeholder="Opcional..." />
            </div>
          </div>
          <div class="flex gap-3 mt-6">
            <button (click)="showForm = false" class="flex-1 border border-gray-200 rounded-xl py-2.5 text-sm text-gray-600 hover:bg-gray-50 transition-colors">Cancelar</button>
            <button (click)="registrarLectura()" class="flex-1 bg-sky-600 hover:bg-sky-700 text-white rounded-xl py-2.5 text-sm font-medium transition-colors">Registrar</button>
          </div>
        </div>
      </div>
    </div>
  `
})
export class LecturasListComponent implements OnInit {
  lecturas: Lectura[] = [];
  loading = false;
  showForm = false;
  anio = new Date().getFullYear();
  mes = new Date().getMonth() + 1;
  meses = ['Enero','Febrero','Marzo','Abril','Mayo','Junio','Julio','Agosto','Septiembre','Octubre','Noviembre','Diciembre'];
  newLectura: Partial<Lectura> = { medidorId: 0, lecturaActual: 0, anio: this.anio, mes: this.mes, observaciones: '' };

  constructor(private lecturaService: LecturaService) {}
  ngOnInit() { this.loadData(); }

  loadData() {
    this.loading = true;
    this.lecturaService.getPorPeriodo(this.anio, this.mes).subscribe({
      next: (l) => { this.lecturas = l; this.loading = false; },
      error: () => this.loading = false
    });
  }

  registrarLectura() {
    this.lecturaService.registrar(this.newLectura).subscribe({
      next: () => { this.showForm = false; this.loadData(); },
      error: () => {}
    });
  }
}
