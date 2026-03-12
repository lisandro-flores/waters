import { Component, OnInit } from '@angular/core';
import { ComunidadService } from '../../core/services/comunidad.service';
import { Comunidad } from '../../core/models/models';

@Component({
  selector: 'app-comunidades',
  standalone: false,
  template: `
    <div class="p-6 space-y-5">
      <div class="flex items-center justify-between">
        <div>
          <h1 class="text-2xl font-medium text-gray-900">Comunidades</h1>
          <p class="text-sm text-gray-500 mt-0.5">Gestión de comunidades y juntas de agua</p>
        </div>
        <button (click)="openCreate()" class="flex items-center gap-2 bg-sky-600 hover:bg-sky-700 text-white rounded-xl px-4 py-2.5 text-sm font-medium transition-colors shadow-sm">
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M5 12h14"/><path d="M12 5v14"/></svg>
          Nueva comunidad
        </button>
      </div>

      <!-- Cards grid -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <div *ngFor="let c of comunidades" class="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 hover:shadow-md transition-shadow">
          <div class="flex items-start justify-between mb-3">
            <div class="w-10 h-10 rounded-xl bg-sky-100 flex items-center justify-center">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="text-sky-600"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>
            </div>
            <div class="flex items-center gap-2">
              <span *ngIf="c.activo" class="px-2.5 py-1 rounded-full text-xs font-medium bg-emerald-100 text-emerald-700">Activa</span>
              <span *ngIf="!c.activo" class="px-2.5 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-600">Inactiva</span>
              <button (click)="openEdit(c)" class="w-8 h-8 rounded-lg hover:bg-amber-50 text-gray-400 hover:text-amber-600 flex items-center justify-center transition-colors">
                <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z"/></svg>
              </button>
            </div>
          </div>
          <h3 class="text-gray-900 font-medium text-sm">{{c.nombre}}</h3>
          <div class="mt-2 space-y-1 text-xs text-gray-500">
            <p *ngIf="c.direccion">📍 {{c.direccion}}</p>
            <p *ngIf="c.telefono">📞 {{c.telefono}}</p>
            <p *ngIf="c.email">✉️ {{c.email}}</p>
            <p *ngIf="c.municipio || c.provincia">🏛️ {{c.municipio}}<span *ngIf="c.provincia">, {{c.provincia}}</span></p>
          </div>
        </div>
      </div>

      <div *ngIf="comunidades.length === 0 && !loading" class="bg-white rounded-2xl border border-gray-100 shadow-sm p-12 text-center">
        <p class="text-gray-400">No hay comunidades registradas</p>
      </div>

      <!-- Modal -->
      <div *ngIf="showModal" class="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4" (click)="showModal = false">
        <div class="bg-white rounded-2xl shadow-2xl w-full max-w-lg p-6" (click)="$event.stopPropagation()">
          <h2 class="text-xl font-medium text-gray-900 mb-5">{{editing ? 'Editar Comunidad' : 'Nueva Comunidad'}}</h2>
          <div class="space-y-4">
            <div>
              <label class="block text-sm text-gray-700 mb-1 font-medium">Nombre</label>
              <input [(ngModel)]="form.nombre" class="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-sky-500" />
            </div>
            <div>
              <label class="block text-sm text-gray-700 mb-1 font-medium">Dirección</label>
              <input [(ngModel)]="form.direccion" class="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-sky-500" />
            </div>
            <div class="grid grid-cols-2 gap-4">
              <div>
                <label class="block text-sm text-gray-700 mb-1 font-medium">Teléfono</label>
                <input [(ngModel)]="form.telefono" class="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-sky-500" />
              </div>
              <div>
                <label class="block text-sm text-gray-700 mb-1 font-medium">Email</label>
                <input type="email" [(ngModel)]="form.email" class="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-sky-500" />
              </div>
              <div>
                <label class="block text-sm text-gray-700 mb-1 font-medium">Provincia</label>
                <input [(ngModel)]="form.provincia" class="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-sky-500" />
              </div>
              <div>
                <label class="block text-sm text-gray-700 mb-1 font-medium">Municipio</label>
                <input [(ngModel)]="form.municipio" class="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-sky-500" />
              </div>
            </div>
          </div>
          <div class="flex gap-3 mt-6">
            <button (click)="showModal = false" class="flex-1 border border-gray-200 rounded-xl py-2.5 text-sm text-gray-600 hover:bg-gray-50 transition-colors">Cancelar</button>
            <button (click)="save()" class="flex-1 bg-sky-600 hover:bg-sky-700 text-white rounded-xl py-2.5 text-sm font-medium transition-colors">Guardar</button>
          </div>
        </div>
      </div>
    </div>
  `
})
export class ComunidadesComponent implements OnInit {
  comunidades: Comunidad[] = [];
  loading = true;
  showModal = false;
  editing = false;
  selectedId = 0;
  form: Partial<Comunidad> = { nombre: '', direccion: '', telefono: '', email: '', provincia: '', municipio: '' };

  constructor(private comunidadService: ComunidadService) {}
  ngOnInit() { this.loadData(); }

  loadData() {
    this.loading = true;
    this.comunidadService.listar().subscribe({
      next: (c) => { this.comunidades = c; this.loading = false; },
      error: () => this.loading = false
    });
  }

  openCreate() {
    this.editing = false;
    this.form = { nombre: '', direccion: '', telefono: '', email: '', provincia: '', municipio: '' };
    this.showModal = true;
  }

  openEdit(c: Comunidad) {
    this.editing = true;
    this.selectedId = c.id;
    this.form = { nombre: c.nombre, direccion: c.direccion, telefono: c.telefono, email: c.email, provincia: c.provincia, municipio: c.municipio };
    this.showModal = true;
  }

  save() {
    const obs = this.editing
      ? this.comunidadService.actualizar(this.selectedId, this.form)
      : this.comunidadService.crear(this.form);
    obs.subscribe({ next: () => { this.showModal = false; this.loadData(); } });
  }
}
