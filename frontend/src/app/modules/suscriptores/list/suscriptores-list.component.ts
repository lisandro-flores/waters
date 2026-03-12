import { Component, OnInit } from '@angular/core';
import { SuscriptorService } from '../../../core/services/suscriptor.service';
import { ComunidadService } from '../../../core/services/comunidad.service';
import { Suscriptor, Comunidad, PageResponse } from '../../../core/models/models';

@Component({
  selector: 'app-suscriptores-list',
  standalone: false,
  template: `
    <div class="p-6 space-y-5">
      <!-- Header -->
      <div class="flex items-center justify-between">
        <div>
          <h1 class="text-2xl font-medium text-gray-900">Suscriptores</h1>
          <p class="text-sm text-gray-500 mt-0.5">{{totalElements}} suscriptores registrados</p>
        </div>
        <button (click)="showModal = 'create'" class="flex items-center gap-2 bg-sky-600 hover:bg-sky-700 text-white rounded-xl px-4 py-2.5 text-sm font-medium transition-colors shadow-sm">
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M5 12h14"/><path d="M12 5v14"/></svg>
          Nuevo suscriptor
        </button>
      </div>

      <!-- Stats mini -->
      <div class="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div class="bg-sky-50 text-sky-700 rounded-2xl p-4">
          <p class="text-2xl font-bold">{{totalElements}}</p>
          <p class="text-sm mt-0.5">Total</p>
        </div>
        <div class="bg-emerald-50 text-emerald-700 rounded-2xl p-4">
          <p class="text-2xl font-bold">{{countByEstado('ACTIVO')}}</p>
          <p class="text-sm mt-0.5">Activos</p>
        </div>
        <div class="bg-red-50 text-red-700 rounded-2xl p-4">
          <p class="text-2xl font-bold">{{countByEstado('SUSPENDIDO')}}</p>
          <p class="text-sm mt-0.5">Suspendidos</p>
        </div>
        <div class="bg-amber-50 text-amber-700 rounded-2xl p-4">
          <p class="text-2xl font-bold">{{countByEstado('CORTADO')}}</p>
          <p class="text-sm mt-0.5">Cortados</p>
        </div>
      </div>

      <!-- Filters -->
      <div class="bg-white rounded-2xl border border-gray-100 shadow-sm p-4">
        <div class="flex flex-col sm:flex-row gap-3">
          <div class="flex-1 flex items-center gap-2 bg-slate-50 rounded-xl px-3 py-2.5">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" class="text-gray-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>
            <input [(ngModel)]="search" (ngModelChange)="onSearch()" placeholder="Buscar por nombre o cuenta..."
                   class="bg-transparent text-sm outline-none flex-1" />
          </div>
        </div>
      </div>

      <!-- Table -->
      <div class="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div class="overflow-x-auto">
          <table class="w-full text-sm">
            <thead class="bg-slate-50 border-b border-gray-100">
              <tr class="text-left text-xs text-gray-400 uppercase tracking-wider">
                <th class="px-4 py-3">Cuenta</th>
                <th class="px-4 py-3">Nombre</th>
                <th class="px-4 py-3 hidden md:table-cell">Tipo</th>
                <th class="px-4 py-3">Estado</th>
                <th class="px-4 py-3 text-right">Acciones</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-gray-50">
              <tr *ngFor="let s of suscriptores" class="hover:bg-slate-50 transition-colors">
                <td class="px-4 py-3 text-gray-500 text-xs">{{s.numeroCuenta}}</td>
                <td class="px-4 py-3">
                  <div class="flex items-center gap-2.5">
                    <div class="w-8 h-8 rounded-lg bg-sky-100 text-sky-700 flex items-center justify-center text-sm flex-shrink-0 font-semibold">
                      {{s.nombre.charAt(0)}}
                    </div>
                    <div>
                      <p class="text-gray-800 font-medium">{{s.nombre}} {{s.apellido}}</p>
                      <p class="text-xs text-gray-400">{{s.email || s.telefono || '-'}}</p>
                    </div>
                  </div>
                </td>
                <td class="px-4 py-3 hidden md:table-cell">
                  <span [class]="getTipoCls(s.tipo)">{{s.tipo}}</span>
                </td>
                <td class="px-4 py-3">
                  <span [class]="getEstadoCls(s.estado)">{{s.estado}}</span>
                </td>
                <td class="px-4 py-3 text-right">
                  <div class="flex items-center justify-end gap-1">
                    <button (click)="viewDetail(s)" class="w-8 h-8 rounded-lg hover:bg-sky-50 text-gray-400 hover:text-sky-600 flex items-center justify-center transition-colors" title="Ver perfil">
                      <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M2.062 12.348a1 1 0 0 1 0-.696 10.75 10.75 0 0 1 19.876 0 1 1 0 0 1 0 .696 10.75 10.75 0 0 1-19.876 0"/><circle cx="12" cy="12" r="3"/></svg>
                    </button>
                    <button (click)="editSuscriptor(s)" class="w-8 h-8 rounded-lg hover:bg-amber-50 text-gray-400 hover:text-amber-600 flex items-center justify-center transition-colors" title="Editar">
                      <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z"/></svg>
                    </button>
                  </div>
                </td>
              </tr>
              <tr *ngIf="suscriptores.length === 0 && !loading">
                <td colspan="5" class="px-4 py-12 text-center text-gray-400">
                  <p>No se encontraron suscriptores</p>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        <div class="px-4 py-3 bg-slate-50 border-t border-gray-100 text-xs text-gray-400 flex items-center justify-between">
          <span>Mostrando {{suscriptores.length}} de {{totalElements}} suscriptores</span>
          <div class="flex gap-2" *ngIf="totalPages > 1">
            <button (click)="loadPage(currentPage - 1)" [disabled]="currentPage === 0"
                    class="px-3 py-1 rounded-lg border border-gray-200 hover:bg-white disabled:opacity-40">Anterior</button>
            <button (click)="loadPage(currentPage + 1)" [disabled]="currentPage >= totalPages - 1"
                    class="px-3 py-1 rounded-lg border border-gray-200 hover:bg-white disabled:opacity-40">Siguiente</button>
          </div>
        </div>
      </div>

      <!-- Create/Edit Modal -->
      <div *ngIf="showModal === 'create' || showModal === 'edit'" class="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4" (click)="showModal = null">
        <div class="bg-white rounded-2xl shadow-2xl w-full max-w-lg p-6" (click)="$event.stopPropagation()">
          <h2 class="text-xl font-medium text-gray-900 mb-5">{{showModal === 'edit' ? 'Editar Suscriptor' : 'Nuevo Suscriptor'}}</h2>
          <div class="grid grid-cols-2 gap-4">
            <div>
              <label class="block text-sm text-gray-700 mb-1 font-medium">Nombre</label>
              <input [(ngModel)]="form.nombre" class="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-sky-500" placeholder="Juan" />
            </div>
            <div>
              <label class="block text-sm text-gray-700 mb-1 font-medium">Apellido</label>
              <input [(ngModel)]="form.apellido" class="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-sky-500" placeholder="Pérez" />
            </div>
            <div class="col-span-2">
              <label class="block text-sm text-gray-700 mb-1 font-medium">Dirección</label>
              <input [(ngModel)]="form.direccion" class="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-sky-500" placeholder="Calle Principal 123" />
            </div>
            <div>
              <label class="block text-sm text-gray-700 mb-1 font-medium">Teléfono</label>
              <input [(ngModel)]="form.telefono" class="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-sky-500" placeholder="0991-234-567" />
            </div>
            <div>
              <label class="block text-sm text-gray-700 mb-1 font-medium">Correo</label>
              <input [(ngModel)]="form.email" class="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-sky-500" placeholder="correo@email.com" />
            </div>
            <div>
              <label class="block text-sm text-gray-700 mb-1 font-medium">Tipo</label>
              <select [(ngModel)]="form.tipo" class="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-sky-500 bg-white">
                <option value="DOMICILIAR">Domiciliar</option>
                <option value="COMERCIAL">Comercial</option>
                <option value="INDUSTRIAL">Industrial</option>
                <option value="INSTITUCIONAL">Institucional</option>
              </select>
            </div>
            <div>
              <label class="block text-sm text-gray-700 mb-1 font-medium">Comunidad</label>
              <select [(ngModel)]="form.comunidadId" class="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-sky-500 bg-white">
                <option *ngFor="let c of comunidades" [ngValue]="c.id">{{c.nombre}}</option>
              </select>
            </div>
          </div>
          <div class="flex gap-3 mt-6">
            <button (click)="showModal = null" class="flex-1 border border-gray-200 rounded-xl py-2.5 text-sm text-gray-600 hover:bg-gray-50 transition-colors">Cancelar</button>
            <button (click)="saveSuscriptor()" class="flex-1 bg-sky-600 hover:bg-sky-700 text-white rounded-xl py-2.5 text-sm font-medium transition-colors">
              {{showModal === 'edit' ? 'Guardar cambios' : 'Registrar'}}
            </button>
          </div>
        </div>
      </div>

      <!-- Detail Modal -->
      <div *ngIf="showModal === 'view' && selectedSuscriptor" class="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4" (click)="showModal = null">
        <div class="bg-white rounded-2xl shadow-2xl w-full max-w-lg" (click)="$event.stopPropagation()">
          <div class="bg-gradient-to-r from-sky-600 to-blue-700 rounded-t-2xl p-6 text-white">
            <div class="flex items-center gap-4">
              <div class="w-16 h-16 rounded-2xl bg-white/20 flex items-center justify-center text-2xl font-bold">
                {{selectedSuscriptor.nombre.charAt(0)}}
              </div>
              <div>
                <h2 class="text-white text-xl font-medium">{{selectedSuscriptor.nombre}} {{selectedSuscriptor.apellido}}</h2>
                <p class="text-sky-200 text-sm">{{selectedSuscriptor.numeroCuenta}} · {{selectedSuscriptor.email || '-'}}</p>
              </div>
            </div>
          </div>
          <div class="p-6 space-y-4">
            <div class="grid grid-cols-2 gap-4">
              <div class="bg-slate-50 rounded-xl p-3"><p class="text-xs text-gray-400">Cuenta</p><p class="text-sm text-gray-800 mt-0.5 font-medium">{{selectedSuscriptor.numeroCuenta}}</p></div>
              <div class="bg-slate-50 rounded-xl p-3"><p class="text-xs text-gray-400">Tipo</p><p class="text-sm text-gray-800 mt-0.5 font-medium">{{selectedSuscriptor.tipo}}</p></div>
              <div class="bg-slate-50 rounded-xl p-3"><p class="text-xs text-gray-400">Estado</p><p class="text-sm text-gray-800 mt-0.5 font-medium">{{selectedSuscriptor.estado}}</p></div>
              <div class="bg-slate-50 rounded-xl p-3"><p class="text-xs text-gray-400">Teléfono</p><p class="text-sm text-gray-800 mt-0.5 font-medium">{{selectedSuscriptor.telefono || '-'}}</p></div>
              <div class="col-span-2 bg-slate-50 rounded-xl p-3"><p class="text-xs text-gray-400">Dirección</p><p class="text-sm text-gray-800 mt-0.5 font-medium">{{selectedSuscriptor.direccion || '-'}}</p></div>
            </div>
            <button (click)="showModal = null" class="w-full bg-sky-600 hover:bg-sky-700 text-white rounded-xl py-2.5 text-sm font-medium transition-colors mt-2">Cerrar</button>
          </div>
        </div>
      </div>
    </div>
  `
})
export class SuscriptoresListComponent implements OnInit {
  suscriptores: Suscriptor[] = [];
  comunidades: Comunidad[] = [];
  totalElements = 0;
  totalPages = 0;
  currentPage = 0;
  loading = true;
  search = '';
  showModal: 'create' | 'edit' | 'view' | null = null;
  selectedSuscriptor: Suscriptor | null = null;
  form: Partial<Suscriptor> = { nombre: '', apellido: '', direccion: '', telefono: '', email: '', tipo: 'DOMICILIAR', comunidadId: 1 };

  constructor(
    private suscriptorService: SuscriptorService,
    private comunidadService: ComunidadService
  ) {}

  ngOnInit() {
    this.loadData();
    this.comunidadService.listar().subscribe(c => this.comunidades = c);
  }

  loadData() {
    this.loading = true;
    this.suscriptorService.listar(this.currentPage, 20, this.search).subscribe({
      next: (res: PageResponse<Suscriptor>) => {
        this.suscriptores = res.content;
        this.totalElements = res.totalElements;
        this.totalPages = res.totalPages;
        this.loading = false;
      },
      error: () => this.loading = false
    });
  }

  loadPage(page: number) {
    this.currentPage = page;
    this.loadData();
  }

  onSearch() {
    this.currentPage = 0;
    this.loadData();
  }

  countByEstado(estado: string): number {
    return this.suscriptores.filter(s => s.estado === estado).length;
  }

  getEstadoCls(estado: string): string {
    const map: Record<string, string> = {
      'ACTIVO': 'px-2.5 py-1 rounded-full text-xs font-medium bg-emerald-100 text-emerald-700',
      'SUSPENDIDO': 'px-2.5 py-1 rounded-full text-xs font-medium bg-amber-100 text-amber-700',
      'CORTADO': 'px-2.5 py-1 rounded-full text-xs font-medium bg-red-100 text-red-700',
      'RETIRADO': 'px-2.5 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-600',
    };
    return map[estado] || map['ACTIVO'];
  }

  getTipoCls(tipo: string): string {
    const map: Record<string, string> = {
      'DOMICILIAR': 'px-2.5 py-1 rounded-full text-xs font-medium bg-sky-100 text-sky-700',
      'COMERCIAL': 'px-2.5 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-700',
      'INDUSTRIAL': 'px-2.5 py-1 rounded-full text-xs font-medium bg-amber-100 text-amber-700',
      'INSTITUCIONAL': 'px-2.5 py-1 rounded-full text-xs font-medium bg-indigo-100 text-indigo-700',
    };
    return map[tipo] || map['DOMICILIAR'];
  }

  viewDetail(s: Suscriptor) {
    this.selectedSuscriptor = s;
    this.showModal = 'view';
  }

  editSuscriptor(s: Suscriptor) {
    this.selectedSuscriptor = s;
    this.form = { ...s };
    this.showModal = 'edit';
  }

  saveSuscriptor() {
    if (this.showModal === 'edit' && this.selectedSuscriptor) {
      this.suscriptorService.actualizar(this.selectedSuscriptor.id, this.form).subscribe({
        next: () => { this.showModal = null; this.loadData(); },
        error: () => {}
      });
    } else {
      this.suscriptorService.crear(this.form).subscribe({
        next: () => { this.showModal = null; this.loadData(); },
        error: () => {}
      });
    }
  }
}
