import { Component, OnInit } from '@angular/core';
import { TarifaService } from '../../../core/services/tarifa.service';
import { Tarifa, TarifaRango } from '../../../core/models/models';

@Component({
  selector: 'app-tarifas-list',
  standalone: false,
  template: `
    <div class="p-6 space-y-5">
      <div class="flex items-center justify-between">
        <div>
          <h1 class="text-2xl font-medium text-gray-900">Tarifas</h1>
          <p class="text-sm text-gray-500 mt-0.5">Configuración de tarifas por tipo de suscriptor</p>
        </div>
        <button (click)="openCreate()" class="flex items-center gap-2 bg-sky-600 hover:bg-sky-700 text-white rounded-xl px-4 py-2.5 text-sm font-medium transition-colors shadow-sm">
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M5 12h14"/><path d="M12 5v14"/></svg>
          Nueva tarifa
        </button>
      </div>

      <!-- Tariff cards -->
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div *ngFor="let t of tarifas" class="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 hover:shadow-md transition-shadow">
          <div class="flex items-start justify-between mb-3">
            <div>
              <h3 class="text-gray-900 font-medium">{{t.nombre}}</h3>
              <p class="text-xs text-gray-400 mt-0.5">{{t.tipoSuscriptor}}</p>
            </div>
            <div class="flex items-center gap-2">
              <span *ngIf="t.activo" class="px-2.5 py-1 rounded-full text-xs font-medium bg-emerald-100 text-emerald-700">Activa</span>
              <span *ngIf="!t.activo" class="px-2.5 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-600">Inactiva</span>
              <button (click)="openEdit(t)" class="w-8 h-8 rounded-lg hover:bg-amber-50 text-gray-400 hover:text-amber-600 flex items-center justify-center transition-colors">
                <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z"/></svg>
              </button>
            </div>
          </div>
          <div class="grid grid-cols-3 gap-3 mb-3">
            <div class="bg-slate-50 rounded-xl p-3">
              <p class="text-xs text-gray-400">Cuota Fija</p>
              <p class="text-sm text-gray-900 font-semibold mt-0.5">\${{t.cuotaFija}}</p>
            </div>
            <div class="bg-slate-50 rounded-xl p-3">
              <p class="text-xs text-gray-400">Mora</p>
              <p class="text-sm text-gray-900 font-semibold mt-0.5">{{t.porcentajeMora}}%</p>
            </div>
            <div class="bg-slate-50 rounded-xl p-3">
              <p class="text-xs text-gray-400">Días gracia</p>
              <p class="text-sm text-gray-900 font-semibold mt-0.5">{{t.diasGracia}}</p>
            </div>
          </div>
          <div *ngIf="t.rangos && t.rangos.length">
            <p class="text-xs text-gray-400 mb-2">Rangos de consumo</p>
            <div class="space-y-1">
              <div *ngFor="let r of t.rangos" class="flex items-center justify-between text-xs text-gray-600 bg-slate-50 rounded-lg px-3 py-2">
                <span>{{r.rangoDesde}} - {{r.rangoHasta || '∞'}} m³</span>
                <span class="font-semibold text-sky-600">\${{r.precioPorM3}}/m³</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div *ngIf="tarifas.length === 0 && !loading" class="bg-white rounded-2xl border border-gray-100 shadow-sm p-12 text-center">
        <p class="text-gray-400">No hay tarifas configuradas</p>
      </div>

      <!-- Modal -->
      <div *ngIf="showModal" class="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4" (click)="showModal = false">
        <div class="bg-white rounded-2xl shadow-2xl w-full max-w-lg p-6 max-h-[90vh] overflow-y-auto" (click)="$event.stopPropagation()">
          <h2 class="text-xl font-medium text-gray-900 mb-5">{{editing ? 'Editar Tarifa' : 'Nueva Tarifa'}}</h2>
          <div class="space-y-4">
            <div>
              <label class="block text-sm text-gray-700 mb-1 font-medium">Nombre</label>
              <input [(ngModel)]="form.nombre" class="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-sky-500" />
            </div>
            <div class="grid grid-cols-2 gap-4">
              <div>
                <label class="block text-sm text-gray-700 mb-1 font-medium">Tipo suscriptor</label>
                <select [(ngModel)]="form.tipoSuscriptor" class="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-sky-500 bg-white">
                  <option value="DOMICILIAR">Domiciliar</option>
                  <option value="COMERCIAL">Comercial</option>
                  <option value="INDUSTRIAL">Industrial</option>
                  <option value="INSTITUCIONAL">Institucional</option>
                </select>
              </div>
              <div>
                <label class="block text-sm text-gray-700 mb-1 font-medium">Cuota fija</label>
                <input type="number" [(ngModel)]="form.cuotaFija" class="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-sky-500" />
              </div>
              <div>
                <label class="block text-sm text-gray-700 mb-1 font-medium">% Mora</label>
                <input type="number" [(ngModel)]="form.porcentajeMora" class="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-sky-500" />
              </div>
              <div>
                <label class="block text-sm text-gray-700 mb-1 font-medium">Días gracia</label>
                <input type="number" [(ngModel)]="form.diasGracia" class="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-sky-500" />
              </div>
            </div>
            <!-- Ranges -->
            <div>
              <div class="flex items-center justify-between mb-2">
                <label class="text-sm text-gray-700 font-medium">Rangos de consumo</label>
                <button (click)="addRango()" class="text-xs text-sky-600 hover:text-sky-700 font-medium">+ Agregar rango</button>
              </div>
              <div *ngFor="let r of formRangos; let i = index" class="flex items-center gap-2 mb-2">
                <input type="number" [(ngModel)]="r.rangoDesde" placeholder="Desde" class="flex-1 border border-gray-200 rounded-xl px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-sky-500" />
                <input type="number" [(ngModel)]="r.rangoHasta" placeholder="Hasta" class="flex-1 border border-gray-200 rounded-xl px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-sky-500" />
                <input type="number" [(ngModel)]="r.precioPorM3" placeholder="$/m³" class="flex-1 border border-gray-200 rounded-xl px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-sky-500" />
                <button (click)="removeRango(i)" class="text-red-400 hover:text-red-600">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
                </button>
              </div>
            </div>
          </div>
          <div class="flex gap-3 mt-6">
            <button (click)="showModal = false" class="flex-1 border border-gray-200 rounded-xl py-2.5 text-sm text-gray-600 hover:bg-gray-50 transition-colors">Cancelar</button>
            <button (click)="saveTarifa()" class="flex-1 bg-sky-600 hover:bg-sky-700 text-white rounded-xl py-2.5 text-sm font-medium transition-colors">Guardar</button>
          </div>
        </div>
      </div>
    </div>
  `
})
export class TarifasListComponent implements OnInit {
  tarifas: Tarifa[] = [];
  loading = true;
  showModal = false;
  editing = false;
  selectedId = 0;
  form: Partial<Tarifa> = { nombre: '', tipoSuscriptor: 'DOMICILIAR', cuotaFija: 0, porcentajeMora: 0, diasGracia: 0, activo: true };
  formRangos: TarifaRango[] = [];

  constructor(private tarifaService: TarifaService) {}
  ngOnInit() { this.loadData(); }

  loadData() {
    this.loading = true;
    this.tarifaService.listar().subscribe({
      next: (t) => { this.tarifas = t; this.loading = false; },
      error: () => this.loading = false
    });
  }

  openCreate() { this.editing = false; this.form = { nombre: '', tipoSuscriptor: 'DOMICILIAR', cuotaFija: 0, porcentajeMora: 0, diasGracia: 0, activo: true }; this.formRangos = []; this.showModal = true; }

  openEdit(t: Tarifa) {
    this.editing = true; this.selectedId = t.id;
    this.form = { nombre: t.nombre, tipoSuscriptor: t.tipoSuscriptor, cuotaFija: t.cuotaFija, porcentajeMora: t.porcentajeMora, diasGracia: t.diasGracia, activo: t.activo };
    this.formRangos = t.rangos ? t.rangos.map(r => ({ ...r })) : [];
    this.showModal = true;
  }

  addRango() { this.formRangos.push({ rangoDesde: 0, rangoHasta: undefined, precioPorM3: 0 }); }
  removeRango(i: number) { this.formRangos.splice(i, 1); }

  saveTarifa() {
    const payload = { ...this.form, rangos: this.formRangos };
    const obs = this.editing ? this.tarifaService.actualizar(this.selectedId, payload) : this.tarifaService.crear(payload);
    obs.subscribe({ next: () => { this.showModal = false; this.loadData(); } });
  }
}
