import { Component, OnInit } from '@angular/core';
import { MedidorService } from '../../../core/services/medidor.service';
import { SuscriptorService } from '../../../core/services/suscriptor.service';
import { Medidor, Suscriptor } from '../../../core/models/models';

@Component({
  selector: 'app-medidores-list',
  standalone: false,
  template: `
    <div class="p-6 space-y-5">
      <div class="flex items-center justify-between">
        <div>
          <h1 class="text-2xl font-medium text-gray-900">Medidores</h1>
          <p class="text-sm text-gray-500 mt-0.5">{{medidores.length}} medidores registrados</p>
        </div>
        <button (click)="showModal = 'create'" class="flex items-center gap-2 bg-sky-600 hover:bg-sky-700 text-white rounded-xl px-4 py-2.5 text-sm font-medium transition-colors shadow-sm">
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M5 12h14"/><path d="M12 5v14"/></svg>
          Nuevo medidor
        </button>
      </div>

      <!-- Stats -->
      <div class="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div class="bg-sky-50 text-sky-700 rounded-2xl p-4"><p class="text-2xl font-bold">{{medidores.length}}</p><p class="text-sm mt-0.5">Total</p></div>
        <div class="bg-emerald-50 text-emerald-700 rounded-2xl p-4"><p class="text-2xl font-bold">{{countEstado('ACTIVO')}}</p><p class="text-sm mt-0.5">Activos</p></div>
        <div class="bg-amber-50 text-amber-700 rounded-2xl p-4"><p class="text-2xl font-bold">{{countEstado('SUSPENDIDO')}}</p><p class="text-sm mt-0.5">Suspendidos</p></div>
        <div class="bg-red-50 text-red-700 rounded-2xl p-4"><p class="text-2xl font-bold">{{countEstado('EN_REPARACION')}}</p><p class="text-sm mt-0.5">En reparación</p></div>
      </div>

      <!-- Filter -->
      <div class="bg-white rounded-2xl border border-gray-100 shadow-sm p-4">
        <div class="flex flex-col sm:flex-row gap-3">
          <div class="flex-1 flex items-center gap-2 bg-slate-50 rounded-xl px-3 py-2.5">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" class="text-gray-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>
            <input [(ngModel)]="search" placeholder="Buscar por serie..."
                   class="bg-transparent text-sm outline-none flex-1" />
          </div>
          <select [(ngModel)]="estadoFilter" (ngModelChange)="loadData()" class="border border-gray-200 rounded-xl px-3 py-2.5 text-sm outline-none bg-white">
            <option value="">Todos</option>
            <option value="ACTIVO">Activo</option>
            <option value="SUSPENDIDO">Suspendido</option>
            <option value="RETIRADO">Retirado</option>
            <option value="EN_REPARACION">En reparación</option>
          </select>
        </div>
      </div>

      <!-- Table -->
      <div class="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div class="overflow-x-auto">
          <table class="w-full text-sm">
            <thead class="bg-slate-50 border-b border-gray-100">
              <tr class="text-left text-xs text-gray-400 uppercase tracking-wider">
                <th class="px-4 py-3">N° Serie</th>
                <th class="px-4 py-3">Suscriptor</th>
                <th class="px-4 py-3 hidden md:table-cell">Marca</th>
                <th class="px-4 py-3 hidden lg:table-cell">Lectura Inicial</th>
                <th class="px-4 py-3">Estado</th>
                <th class="px-4 py-3 text-right">Acciones</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-gray-50">
              <tr *ngFor="let m of filteredMedidores" class="hover:bg-slate-50 transition-colors">
                <td class="px-4 py-3 text-gray-600 font-mono text-xs">{{m.numeroSerie}}</td>
                <td class="px-4 py-3 text-gray-800 font-medium">{{m.suscriptorNombre || '-'}}</td>
                <td class="px-4 py-3 hidden md:table-cell text-gray-600">{{m.marca || '-'}}</td>
                <td class="px-4 py-3 hidden lg:table-cell text-gray-600">{{m.lecturaInicial}}</td>
                <td class="px-4 py-3">
                  <span [class]="getEstadoCls(m.estado)">{{m.estado}}</span>
                </td>
                <td class="px-4 py-3 text-right">
                  <div class="flex items-center justify-end gap-1">
                    <button (click)="editMedidor(m)" class="w-8 h-8 rounded-lg hover:bg-amber-50 text-gray-400 hover:text-amber-600 flex items-center justify-center transition-colors" title="Editar">
                      <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z"/></svg>
                    </button>
                  </div>
                </td>
              </tr>
              <tr *ngIf="filteredMedidores.length === 0 && !loading">
                <td colspan="6" class="px-4 py-12 text-center text-gray-400">No se encontraron medidores</td>
              </tr>
            </tbody>
          </table>
        </div>
        <div class="px-4 py-3 bg-slate-50 border-t border-gray-100 text-xs text-gray-400">
          Mostrando {{filteredMedidores.length}} medidores
        </div>
      </div>

      <!-- Create/Edit Modal -->
      <div *ngIf="showModal" class="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4" (click)="showModal = null">
        <div class="bg-white rounded-2xl shadow-2xl w-full max-w-lg p-6" (click)="$event.stopPropagation()">
          <h2 class="text-xl font-medium text-gray-900 mb-5">{{showModal === 'edit' ? 'Editar Medidor' : 'Nuevo Medidor'}}</h2>
          <div class="grid grid-cols-2 gap-4">
            <div class="col-span-2">
              <label class="block text-sm text-gray-700 mb-1 font-medium">N° Serie</label>
              <input [(ngModel)]="form.numeroSerie" class="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-sky-500" placeholder="MED-2024-001" />
            </div>
            <div>
              <label class="block text-sm text-gray-700 mb-1 font-medium">Marca</label>
              <input [(ngModel)]="form.marca" class="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-sky-500" />
            </div>
            <div>
              <label class="block text-sm text-gray-700 mb-1 font-medium">Diámetro</label>
              <input [(ngModel)]="form.diametro" class="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-sky-500" />
            </div>
            <div>
              <label class="block text-sm text-gray-700 mb-1 font-medium">Lectura inicial</label>
              <input type="number" [(ngModel)]="form.lecturaInicial" class="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-sky-500" />
            </div>
            <div>
              <label class="block text-sm text-gray-700 mb-1 font-medium">Suscriptor ID</label>
              <input type="number" [(ngModel)]="form.suscriptorId" class="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-sky-500" />
            </div>
          </div>
          <div class="flex gap-3 mt-6">
            <button (click)="showModal = null" class="flex-1 border border-gray-200 rounded-xl py-2.5 text-sm text-gray-600 hover:bg-gray-50 transition-colors">Cancelar</button>
            <button (click)="saveMedidor()" class="flex-1 bg-sky-600 hover:bg-sky-700 text-white rounded-xl py-2.5 text-sm font-medium transition-colors">
              {{showModal === 'edit' ? 'Guardar' : 'Registrar'}}
            </button>
          </div>
        </div>
      </div>
    </div>
  `
})
export class MedidoresListComponent implements OnInit {
  medidores: Medidor[] = [];
  search = '';
  estadoFilter = '';
  loading = true;
  showModal: 'create' | 'edit' | null = null;
  selectedMedidor: Medidor | null = null;
  form: Partial<Medidor> = { numeroSerie: '', marca: '', diametro: '', lecturaInicial: 0, suscriptorId: 0 };

  constructor(private medidorService: MedidorService) {}

  ngOnInit() { this.loadData(); }

  loadData() {
    this.loading = true;
    this.medidorService.listar(this.estadoFilter || undefined).subscribe({
      next: (m) => { this.medidores = m; this.loading = false; },
      error: () => this.loading = false
    });
  }

  get filteredMedidores(): Medidor[] {
    if (!this.search) return this.medidores;
    const q = this.search.toLowerCase();
    return this.medidores.filter(m => m.numeroSerie.toLowerCase().includes(q) || m.suscriptorNombre?.toLowerCase().includes(q));
  }

  countEstado(e: string): number { return this.medidores.filter(m => m.estado === e).length; }

  getEstadoCls(e: string): string {
    const map: Record<string, string> = {
      'ACTIVO': 'px-2.5 py-1 rounded-full text-xs font-medium bg-emerald-100 text-emerald-700',
      'SUSPENDIDO': 'px-2.5 py-1 rounded-full text-xs font-medium bg-amber-100 text-amber-700',
      'RETIRADO': 'px-2.5 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-600',
      'EN_REPARACION': 'px-2.5 py-1 rounded-full text-xs font-medium bg-sky-100 text-sky-700',
    };
    return map[e] || map['ACTIVO'];
  }

  editMedidor(m: Medidor) { this.selectedMedidor = m; this.form = { ...m }; this.showModal = 'edit'; }

  saveMedidor() {
    if (this.showModal === 'edit' && this.selectedMedidor) {
      this.medidorService.actualizar(this.selectedMedidor.id, this.form).subscribe({ next: () => { this.showModal = null; this.loadData(); } });
    } else {
      this.medidorService.crear(this.form).subscribe({ next: () => { this.showModal = null; this.loadData(); } });
    }
  }
}
