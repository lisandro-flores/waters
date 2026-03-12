import { Component, OnInit } from '@angular/core';
import { PagoService } from '../../core/services/pago.service';
import { FacturaService } from '../../core/services/factura.service';
import { Factura, Pago } from '../../core/models/models';

@Component({
  selector: 'app-pagos',
  standalone: false,
  template: `
    <div class="p-6 space-y-5">
      <div class="flex items-center justify-between">
        <div>
          <h1 class="text-2xl font-medium text-gray-900">Pagos</h1>
          <p class="text-sm text-gray-500 mt-0.5">Registro y seguimiento de pagos de facturas</p>
        </div>
        <button (click)="openRegister()" class="flex items-center gap-2 bg-sky-600 hover:bg-sky-700 text-white rounded-xl px-4 py-2.5 text-sm font-medium transition-colors shadow-sm">
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M5 12h14"/><path d="M12 5v14"/></svg>
          Registrar pago
        </button>
      </div>

      <!-- Stats -->
      <div class="grid grid-cols-2 sm:grid-cols-3 gap-3">
        <div class="bg-emerald-50 rounded-2xl p-4">
          <p class="text-xs text-gray-400">Total Recaudado</p>
          <p class="text-lg font-semibold text-emerald-700 mt-0.5">\${{totalRecaudado.toFixed(2)}}</p>
        </div>
        <div class="bg-sky-50 rounded-2xl p-4">
          <p class="text-xs text-gray-400">Pagos Registrados</p>
          <p class="text-lg font-semibold text-sky-700 mt-0.5">{{pagos.length}}</p>
        </div>
        <div class="bg-amber-50 rounded-2xl p-4">
          <p class="text-xs text-gray-400">Facturas Pendientes</p>
          <p class="text-lg font-semibold text-amber-700 mt-0.5">{{facturasPendientes.length}}</p>
        </div>
      </div>

      <!-- Search -->
      <div class="bg-white rounded-2xl border border-gray-100 shadow-sm p-4">
        <input type="text" [(ngModel)]="searchTerm" placeholder="Buscar por número de factura o suscriptor..." class="w-full bg-slate-50 border-0 rounded-xl px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-sky-500" />
      </div>

      <!-- Pending invoices -->
      <div *ngIf="facturasPendientes.length > 0">
        <h2 class="text-sm font-semibold text-gray-700 mb-3 px-1">Facturas pendientes de pago</h2>
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          <div *ngFor="let f of filteredPendientes" class="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 hover:shadow-md transition-shadow">
            <div class="flex items-center justify-between mb-2">
              <span class="text-sm font-medium text-gray-900">{{f.numeroFactura}}</span>
              <span class="px-2.5 py-1 rounded-full text-xs font-medium bg-amber-100 text-amber-700">Pendiente</span>
            </div>
            <p class="text-xs text-gray-500">{{f.suscriptorNombre || 'N/A'}}</p>
            <p class="text-xs text-gray-500">Vence: {{f.fechaVencimiento | date:'dd/MM/yyyy'}}</p>
            <div class="flex items-center justify-between mt-3">
              <span class="text-lg font-semibold text-gray-900">\${{f.totalPagar?.toFixed(2)}}</span>
              <button (click)="payFactura(f)" class="bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl px-4 py-2 text-xs font-medium transition-colors">Pagar</button>
            </div>
          </div>
        </div>
      </div>

      <!-- Payments table -->
      <div class="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div class="px-4 py-3 border-b border-gray-50">
          <h2 class="text-sm font-semibold text-gray-700">Historial de pagos</h2>
        </div>
        <table class="w-full text-sm">
          <thead class="bg-slate-50 text-gray-500 text-xs uppercase">
            <tr>
              <th class="px-4 py-3 text-left font-medium">Nº Recibo</th>
              <th class="px-4 py-3 text-left font-medium">Factura</th>
              <th class="px-4 py-3 text-left font-medium">Monto</th>
              <th class="px-4 py-3 text-left font-medium">Método</th>
              <th class="px-4 py-3 text-left font-medium">Fecha</th>
              <th class="px-4 py-3 text-left font-medium">Referencia</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-50">
            <tr *ngFor="let p of pagos" class="hover:bg-slate-50/50 transition-colors">
              <td class="px-4 py-3 font-medium text-gray-900">REC-{{p.id}}</td>
              <td class="px-4 py-3 text-gray-600">{{p.numeroFactura || p.facturaId}}</td>
              <td class="px-4 py-3 text-emerald-600 font-semibold">\${{p.monto?.toFixed(2)}}</td>
              <td class="px-4 py-3">
                <span class="px-2.5 py-1 rounded-full text-xs font-medium" [ngClass]="{
                  'bg-sky-100 text-sky-700': p.metodoPago === 'EFECTIVO',
                  'bg-violet-100 text-violet-700': p.metodoPago === 'TRANSFERENCIA',
                  'bg-teal-100 text-teal-700': p.metodoPago === 'DEPOSITO_BANCARIO'
                }">{{p.metodoPago}}</span>
              </td>
              <td class="px-4 py-3 text-gray-500">{{p.fechaPago | date:'dd/MM/yyyy'}}</td>
              <td class="px-4 py-3 text-gray-500">{{p.referencia || '-'}}</td>
            </tr>
          </tbody>
        </table>
        <div *ngIf="pagos.length === 0" class="p-8 text-center text-gray-400 text-sm">No hay pagos registrados</div>
      </div>

      <!-- Pay Modal -->
      <div *ngIf="showModal" class="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4" (click)="showModal = false">
        <div class="bg-white rounded-2xl shadow-2xl w-full max-w-md p-6" (click)="$event.stopPropagation()">
          <h2 class="text-xl font-medium text-gray-900 mb-5">Registrar Pago</h2>
          <div class="space-y-4">
            <div>
              <label class="block text-sm text-gray-700 mb-1 font-medium">Factura</label>
              <select [(ngModel)]="payForm.facturaId" class="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-sky-500 bg-white">
                <option [ngValue]="null">Seleccionar factura...</option>
                <option *ngFor="let f of facturasPendientes" [ngValue]="f.id">{{f.numeroFactura}} - \${{f.totalPagar?.toFixed(2)}}</option>
              </select>
            </div>
            <div>
              <label class="block text-sm text-gray-700 mb-1 font-medium">Monto</label>
              <input type="number" [(ngModel)]="payForm.monto" class="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-sky-500" />
            </div>
            <div>
              <label class="block text-sm text-gray-700 mb-1 font-medium">Método de pago</label>
              <select [(ngModel)]="payForm.metodoPago" class="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-sky-500 bg-white">
                <option value="EFECTIVO">Efectivo</option>
                <option value="TRANSFERENCIA">Transferencia</option>
                <option value="DEPOSITO_BANCARIO">Depósito Bancario</option>
              </select>
            </div>
            <div>
              <label class="block text-sm text-gray-700 mb-1 font-medium">Referencia</label>
              <input type="text" [(ngModel)]="payForm.referencia" placeholder="Nº transferencia, cheque, etc." class="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-sky-500" />
            </div>
          </div>
          <div class="flex gap-3 mt-6">
            <button (click)="showModal = false" class="flex-1 border border-gray-200 rounded-xl py-2.5 text-sm text-gray-600 hover:bg-gray-50 transition-colors">Cancelar</button>
            <button (click)="submitPago()" class="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl py-2.5 text-sm font-medium transition-colors">Registrar</button>
          </div>
        </div>
      </div>
    </div>
  `
})
export class PagosComponent implements OnInit {
  pagos: Pago[] = [];
  facturasPendientes: Factura[] = [];
  searchTerm = '';
  showModal = false;
  payForm: any = { facturaId: null, monto: 0, metodoPago: 'EFECTIVO', referencia: '' };

  constructor(private pagoService: PagoService, private facturaService: FacturaService) {}
  ngOnInit() { this.loadData(); }

  loadData() {
    this.facturaService.listar().subscribe({
      next: (r: any) => {
        const all: Factura[] = r.content || r;
        this.facturasPendientes = all.filter(f => f.estado === 'PENDIENTE');
      }
    });
    this.pagoService.listar().subscribe({
      next: (p: Pago[]) => this.pagos = p,
      error: () => {}
    });
  }

  get totalRecaudado(): number { return this.pagos.reduce((s, p) => s + (p.monto || 0), 0); }

  get filteredPendientes(): Factura[] {
    if (!this.searchTerm) return this.facturasPendientes;
    const t = this.searchTerm.toLowerCase();
    return this.facturasPendientes.filter(f =>
      (f.numeroFactura || '').toLowerCase().includes(t) ||
      (f.suscriptorNombre || '').toLowerCase().includes(t)
    );
  }

  openRegister() { this.payForm = { facturaId: null, monto: 0, metodoPago: 'EFECTIVO', referencia: '' }; this.showModal = true; }

  payFactura(f: Factura) {
    this.payForm = { facturaId: f.id, monto: f.totalPagar, metodoPago: 'EFECTIVO', referencia: '' };
    this.showModal = true;
  }

  submitPago() {
    if (!this.payForm.facturaId) return;
    this.pagoService.registrar(this.payForm).subscribe({
      next: () => { this.showModal = false; this.loadData(); }
    });
  }
}
