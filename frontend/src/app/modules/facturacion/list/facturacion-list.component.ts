import { Component, OnInit } from '@angular/core';
import { FacturaService } from '../../../core/services/factura.service';
import { Factura } from '../../../core/models/models';

@Component({
  selector: 'app-facturacion-list',
  standalone: false,
  template: `
    <div class="p-6 space-y-5">
      <div class="flex items-center justify-between">
        <div>
          <h1 class="text-2xl font-medium text-gray-900">Facturación</h1>
          <p class="text-sm text-gray-500 mt-0.5">Gestión de facturas por servicio de agua potable</p>
        </div>
        <div class="flex items-center gap-3">
          <button (click)="showGenMasivo = true" class="flex items-center gap-2 border border-sky-600 text-sky-600 hover:bg-sky-50 rounded-xl px-4 py-2.5 text-sm font-medium transition-colors">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M16 16v6"/><path d="M16 22h6"/><path d="M21 10V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l2-1.14"/></svg>
            Generar Masivo
          </button>
        </div>
      </div>

      <!-- Stats -->
      <div class="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div class="bg-sky-50 rounded-2xl p-4">
          <p class="text-xs text-gray-400">Total Facturas</p>
          <p class="text-lg font-semibold text-gray-900 mt-0.5">{{facturas.length}}</p>
        </div>
        <div class="bg-amber-50 rounded-2xl p-4">
          <p class="text-xs text-gray-400">Pendientes</p>
          <p class="text-lg font-semibold text-amber-600 mt-0.5">{{pendientes}}</p>
        </div>
        <div class="bg-emerald-50 rounded-2xl p-4">
          <p class="text-xs text-gray-400">Pagadas</p>
          <p class="text-lg font-semibold text-emerald-600 mt-0.5">{{pagadas}}</p>
        </div>
        <div class="bg-red-50 rounded-2xl p-4">
          <p class="text-xs text-gray-400">Anuladas</p>
          <p class="text-lg font-semibold text-red-600 mt-0.5">{{anuladas}}</p>
        </div>
      </div>

      <!-- Filters -->
      <div class="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 flex flex-wrap items-center gap-3">
        <div class="flex-1 min-w-[200px]">
          <input type="text" [(ngModel)]="searchTerm" placeholder="Buscar por número o suscriptor..." class="w-full bg-slate-50 border-0 rounded-xl px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-sky-500" />
        </div>
        <select [(ngModel)]="estadoFilter" class="bg-slate-50 border-0 rounded-xl px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-sky-500">
          <option value="">Todos</option>
          <option value="PENDIENTE">Pendiente</option>
          <option value="PAGADA">Pagada</option>
          <option value="ANULADA">Anulada</option>
          <option value="VENCIDA">Vencida</option>
        </select>
      </div>

      <!-- Table -->
      <div class="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <table class="w-full text-sm">
          <thead class="bg-slate-50 text-gray-500 text-xs uppercase">
            <tr>
              <th class="px-4 py-3 text-left font-medium">Nº Factura</th>
              <th class="px-4 py-3 text-left font-medium">Suscriptor</th>
              <th class="px-4 py-3 text-left font-medium">Período</th>
              <th class="px-4 py-3 text-left font-medium">Total</th>
              <th class="px-4 py-3 text-left font-medium">Vencimiento</th>
              <th class="px-4 py-3 text-left font-medium">Estado</th>
              <th class="px-4 py-3 text-left font-medium">Acciones</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-50">
            <tr *ngFor="let f of filtered" class="hover:bg-slate-50/50 transition-colors">
              <td class="px-4 py-3 font-medium text-gray-900">{{f.numeroFactura}}</td>
              <td class="px-4 py-3 text-gray-600">{{f.suscriptorNombre || 'N/A'}}</td>
              <td class="px-4 py-3 text-gray-600">{{f.mes}}/{{f.anio}}</td>
              <td class="px-4 py-3 text-gray-900 font-semibold">\${{f.totalPagar?.toFixed(2)}}</td>
              <td class="px-4 py-3 text-gray-500">{{f.fechaVencimiento | date:'dd/MM/yyyy'}}</td>
              <td class="px-4 py-3">
                <span [class]="estadoClass(f.estado)">{{f.estado}}</span>
              </td>
              <td class="px-4 py-3">
                <div class="flex items-center gap-1">
                  <button *ngIf="f.estado === 'PENDIENTE'" (click)="anularFactura(f)" class="w-7 h-7 rounded-lg hover:bg-red-50 text-gray-400 hover:text-red-600 flex items-center justify-center">
                    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
        <div *ngIf="filtered.length === 0" class="p-8 text-center text-gray-400 text-sm">No se encontraron facturas</div>
      </div>

      <!-- Modal Generar Masivo -->
      <div *ngIf="showGenMasivo" class="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4" (click)="showGenMasivo = false">
        <div class="bg-white rounded-2xl shadow-2xl w-full max-w-md p-6" (click)="$event.stopPropagation()">
          <h2 class="text-xl font-medium text-gray-900 mb-5">Facturación Masiva</h2>
          <div class="space-y-4">
            <div class="grid grid-cols-2 gap-4">
              <div>
                <label class="block text-sm text-gray-700 mb-1 font-medium">Año</label>
                <input type="number" [(ngModel)]="genAnio" class="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-sky-500" />
              </div>
              <div>
                <label class="block text-sm text-gray-700 mb-1 font-medium">Mes</label>
                <select [(ngModel)]="genMes" class="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-sky-500 bg-white">
                  <option *ngFor="let m of meses; let i = index" [ngValue]="i+1">{{m}}</option>
                </select>
              </div>
            </div>
          </div>
          <div *ngIf="genResult" class="mt-3 px-3 py-2 bg-emerald-50 text-emerald-700 text-sm rounded-xl">{{genResult}}</div>
          <div *ngIf="genError" class="mt-3 px-3 py-2 bg-red-50 text-red-600 text-sm rounded-xl">{{genError}}</div>
          <div class="flex gap-3 mt-6">
            <button (click)="showGenMasivo = false" class="flex-1 border border-gray-200 rounded-xl py-2.5 text-sm text-gray-600 hover:bg-gray-50 transition-colors">Cancelar</button>
            <button (click)="generarMasivo()" [disabled]="generating" class="flex-1 bg-sky-600 hover:bg-sky-700 text-white rounded-xl py-2.5 text-sm font-medium transition-colors disabled:opacity-50">
              {{generating ? 'Generando...' : 'Generar'}}
            </button>
          </div>
        </div>
      </div>
    </div>
  `
})
export class FacturacionListComponent implements OnInit {
  facturas: Factura[] = [];
  searchTerm = '';
  estadoFilter = '';
  loading = true;

  showGenMasivo = false;
  genAnio = new Date().getFullYear();
  genMes = new Date().getMonth() + 1;
  generating = false;
  genResult = '';
  genError = '';
  meses = ['Enero','Febrero','Marzo','Abril','Mayo','Junio','Julio','Agosto','Septiembre','Octubre','Noviembre','Diciembre'];

  constructor(private facturaService: FacturaService) {}
  ngOnInit() { this.loadData(); }

  loadData() {
    this.loading = true;
    this.facturaService.listar().subscribe({
      next: (r: any) => {
        this.facturas = r.content || r;
        this.loading = false;
      },
      error: () => this.loading = false
    });
  }

  get pendientes() { return this.facturas.filter(f => f.estado === 'PENDIENTE').length; }
  get pagadas() { return this.facturas.filter(f => f.estado === 'PAGADA').length; }
  get anuladas() { return this.facturas.filter(f => f.estado === 'ANULADA').length; }

  get filtered(): Factura[] {
    return this.facturas.filter(f => {
      const matchSearch = !this.searchTerm ||
        (f.numeroFactura || '').toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        (f.suscriptorNombre || '').toLowerCase().includes(this.searchTerm.toLowerCase());
      const matchEstado = !this.estadoFilter || f.estado === this.estadoFilter;
      return matchSearch && matchEstado;
    });
  }

  estadoClass(estado: string): string {
    const base = 'px-2.5 py-1 rounded-full text-xs font-medium ';
    switch (estado) {
      case 'PENDIENTE': return base + 'bg-amber-100 text-amber-700';
      case 'PAGADA': return base + 'bg-emerald-100 text-emerald-700';
      case 'ANULADA': return base + 'bg-red-100 text-red-700';
      case 'VENCIDA': return base + 'bg-orange-100 text-orange-700';
      default: return base + 'bg-gray-100 text-gray-600';
    }
  }

  anularFactura(f: Factura) {
    if (confirm('¿Anular factura ' + f.numeroFactura + '?')) {
      this.facturaService.anular(f.id).subscribe({ next: () => this.loadData() });
    }
  }

  generarMasivo() {
    this.generating = true;
    this.genResult = '';
    this.genError = '';
    this.facturaService.generarMasivo(this.genAnio, this.genMes).subscribe({
      next: (r: any) => {
        this.genResult = `Se generaron ${r.length || r.generadas || 'las'} facturas correctamente`;
        this.generating = false;
        this.loadData();
      },
      error: (e: any) => {
        this.genError = e.error?.message || 'Error al generar facturas';
        this.generating = false;
      }
    });
  }
}
