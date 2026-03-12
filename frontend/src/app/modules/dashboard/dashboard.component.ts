import { Component, OnInit, ElementRef, ViewChild, AfterViewInit } from '@angular/core';
import { ReporteService } from '../../core/services/reporte.service';
import { DashboardData } from '../../core/models/models';
import { Chart, registerables } from 'chart.js';

Chart.register(...registerables);

@Component({
  selector: 'app-dashboard',
  standalone: false,
  template: `
    <div class="p-6 space-y-6">
      <!-- Page title -->
      <div class="flex items-center justify-between">
        <div>
          <h1 class="text-2xl font-medium text-gray-900">Dashboard</h1>
          <p class="text-sm text-gray-500 mt-0.5">Resumen ejecutivo — {{currentMonth}}</p>
        </div>
        <div class="flex items-center gap-2 bg-sky-50 text-sky-700 rounded-xl px-4 py-2 text-sm">
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 22a7 7 0 0 0 7-7c0-2-1-3.9-3-5.5s-3.5-4-4-6.5c-.5 2.5-2 4.9-4 6.5C6 11.1 5 13 5 15a7 7 0 0 0 7 7z"/></svg>
          <span class="font-medium">Sistema operativo</span>
        </div>
      </div>

      <!-- KPI Cards -->
      <div class="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        <div *ngFor="let card of statCards" class="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
          <div class="flex items-start justify-between">
            <div>
              <p class="text-sm text-gray-500">{{card.label}}</p>
              <p class="text-3xl mt-1 font-bold" [class]="card.textColor">{{card.value}}</p>
              <p class="text-xs text-gray-400 mt-2">{{card.sub}}</p>
            </div>
            <div [class]="card.bgLight + ' ' + card.textColor + ' w-12 h-12 rounded-xl flex items-center justify-center'">
              <span [innerHTML]="card.iconSvg"></span>
            </div>
          </div>
        </div>
      </div>

      <!-- Charts row -->
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <!-- Consumption Area Chart -->
        <div class="lg:col-span-2 bg-white rounded-2xl p-5 border border-gray-100 shadow-sm">
          <div class="flex items-center justify-between mb-4">
            <div>
              <h3 class="text-lg font-medium text-gray-900">Consumo Mensual</h3>
              <p class="text-sm text-gray-400">Últimos 6 meses (m³)</p>
            </div>
            <span class="text-xs bg-sky-50 text-sky-600 px-3 py-1 rounded-full font-medium">m³</span>
          </div>
          <canvas #consumptionChart height="220"></canvas>
        </div>

        <!-- Pie chart -->
        <div class="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm">
          <div class="mb-4">
            <h3 class="text-lg font-medium text-gray-900">Estado de Facturas</h3>
            <p class="text-sm text-gray-400">Período actual</p>
          </div>
          <canvas #invoiceChart height="160"></canvas>
          <div class="space-y-2 mt-4">
            <div *ngFor="let d of pieData" class="flex items-center justify-between">
              <div class="flex items-center gap-2">
                <div class="w-3 h-3 rounded-full" [style.backgroundColor]="d.color"></div>
                <span class="text-sm text-gray-600">{{d.name}}</span>
              </div>
              <span class="text-sm font-semibold" [style.color]="d.color">{{d.value}}</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Revenue Bar Chart -->
      <div class="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm">
        <div class="flex items-center justify-between mb-4">
          <div>
            <h3 class="text-lg font-medium text-gray-900">Facturación vs Recaudación</h3>
            <p class="text-sm text-gray-400">Últimos 6 meses (USD)</p>
          </div>
        </div>
        <canvas #revenueChart height="200"></canvas>
      </div>

      <!-- Bottom row -->
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <!-- Quick stats -->
        <div class="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm">
          <h3 class="text-lg font-medium text-gray-900 mb-4">Resumen Rápido</h3>
          <div class="space-y-3">
            <div class="flex items-center justify-between p-3 bg-slate-50 rounded-xl">
              <span class="text-sm text-gray-600">Total suscriptores</span>
              <span class="text-sm font-semibold text-gray-900">{{data?.totalSuscriptores || 0}}</span>
            </div>
            <div class="flex items-center justify-between p-3 bg-slate-50 rounded-xl">
              <span class="text-sm text-gray-600">Facturado mes actual</span>
              <span class="text-sm font-semibold text-indigo-600">\${{data?.facturadoMesActual || 0}}</span>
            </div>
            <div class="flex items-center justify-between p-3 bg-slate-50 rounded-xl">
              <span class="text-sm text-gray-600">Recaudado mes actual</span>
              <span class="text-sm font-semibold text-emerald-600">\${{data?.recaudadoMesActual || 0}}</span>
            </div>
            <div class="flex items-center justify-between p-3 bg-slate-50 rounded-xl">
              <span class="text-sm text-gray-600">Cuentas pendientes</span>
              <span class="text-sm font-semibold text-amber-600">{{data?.cuentasPendientes || 0}}</span>
            </div>
            <div class="flex items-center justify-between p-3 bg-slate-50 rounded-xl">
              <span class="text-sm text-gray-600">Cuentas morosas</span>
              <span class="text-sm font-semibold text-red-600">{{data?.cuentasMorosas || 0}}</span>
            </div>
          </div>
        </div>

        <!-- Recent activity -->
        <div class="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm">
          <div class="flex items-center justify-between mb-4">
            <h3 class="text-lg font-medium text-gray-900">Actividad Reciente</h3>
          </div>
          <div class="space-y-3" *ngIf="!loading">
            <div class="flex items-start gap-3 p-3 border-l-4 border-l-sky-500 bg-sky-50 rounded-r-xl">
              <div>
                <p class="text-sm text-gray-800 font-medium">Sistema iniciado correctamente</p>
                <p class="text-xs text-gray-400 mt-1">Dashboard cargado con datos del servidor</p>
              </div>
            </div>
            <div class="flex items-start gap-3 p-3 border-l-4 border-l-emerald-500 bg-emerald-50 rounded-r-xl">
              <div>
                <p class="text-sm text-gray-800 font-medium">Datos sincronizados</p>
                <p class="text-xs text-gray-400 mt-1">Información actualizada en tiempo real</p>
              </div>
            </div>
          </div>
          <div *ngIf="loading" class="space-y-3">
            <div class="skeleton h-16 w-full rounded-xl"></div>
            <div class="skeleton h-16 w-full rounded-xl"></div>
          </div>
        </div>
      </div>
    </div>
  `
})
export class DashboardComponent implements OnInit, AfterViewInit {
  @ViewChild('consumptionChart') consumptionRef!: ElementRef<HTMLCanvasElement>;
  @ViewChild('invoiceChart') invoiceRef!: ElementRef<HTMLCanvasElement>;
  @ViewChild('revenueChart') revenueRef!: ElementRef<HTMLCanvasElement>;

  data: DashboardData | null = null;
  loading = true;
  currentMonth = '';

  pieData = [
    { name: 'Pagadas', value: 10, color: '#10b981' },
    { name: 'Pendientes', value: 8, color: '#f59e0b' },
    { name: 'Vencidas', value: 2, color: '#ef4444' },
  ];

  statCards = [
    { label: 'Total Suscriptores', value: '0', sub: 'Registrados en el sistema', textColor: 'text-sky-600', bgLight: 'bg-sky-50',
      iconSvg: '<svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>' },
    { label: 'Facturado Mes', value: '$0', sub: 'Mes actual', textColor: 'text-indigo-600', bgLight: 'bg-indigo-50',
      iconSvg: '<svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="12" x2="12" y1="2" y2="22"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>' },
    { label: 'Recaudado Mes', value: '$0', sub: 'Cobros realizados', textColor: 'text-emerald-600', bgLight: 'bg-emerald-50',
      iconSvg: '<svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect width="20" height="14" x="2" y="5" rx="2"/><line x1="2" x2="22" y1="10" y2="10"/></svg>' },
    { label: 'Cuentas Morosas', value: '0', sub: 'Requieren atención', textColor: 'text-red-600', bgLight: 'bg-red-50',
      iconSvg: '<svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9"/><path d="M10.3 21a1.94 1.94 0 0 0 3.4 0"/></svg>' },
  ];

  monthlyLabels = ['Oct', 'Nov', 'Dic', 'Ene', 'Feb', 'Mar'];
  monthlyConsumption = [4200, 3800, 4500, 4100, 4800, 5200];
  monthlyInvoiced = [12000, 11500, 13000, 12500, 14000, 15000];
  monthlyPaid = [10000, 10500, 11000, 11500, 12000, 13000];

  constructor(private reporteService: ReporteService) {
    const now = new Date();
    this.currentMonth = now.toLocaleDateString('es', { month: 'long', year: 'numeric' });
    this.currentMonth = this.currentMonth.charAt(0).toUpperCase() + this.currentMonth.slice(1);
  }

  ngOnInit() {
    this.reporteService.getDashboard().subscribe({
      next: (d) => {
        this.data = d;
        this.statCards[0].value = d.totalSuscriptores.toLocaleString();
        this.statCards[1].value = `$${d.facturadoMesActual.toLocaleString()}`;
        this.statCards[2].value = `$${d.recaudadoMesActual.toLocaleString()}`;
        this.statCards[3].value = d.cuentasMorosas.toLocaleString();
        this.loading = false;
      },
      error: () => {
        this.loading = false;
      }
    });
  }

  ngAfterViewInit() {
    setTimeout(() => {
      this.createConsumptionChart();
      this.createInvoiceChart();
      this.createRevenueChart();
    }, 100);
  }

  private createConsumptionChart() {
    if (!this.consumptionRef) return;
    new Chart(this.consumptionRef.nativeElement, {
      type: 'line',
      data: {
        labels: this.monthlyLabels,
        datasets: [{
          label: 'Consumo (m³)',
          data: this.monthlyConsumption,
          borderColor: '#0ea5e9',
          backgroundColor: 'rgba(14, 165, 233, 0.1)',
          fill: true,
          tension: 0.4,
          borderWidth: 2.5,
          pointRadius: 4,
          pointBackgroundColor: '#0ea5e9',
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: { legend: { display: false } },
        scales: {
          x: { grid: { display: false }, ticks: { color: '#94a3b8', font: { size: 12 } } },
          y: { grid: { color: '#f1f5f9' }, ticks: { color: '#94a3b8', font: { size: 12 } } }
        }
      }
    });
  }

  private createInvoiceChart() {
    if (!this.invoiceRef) return;
    new Chart(this.invoiceRef.nativeElement, {
      type: 'doughnut',
      data: {
        labels: this.pieData.map(d => d.name),
        datasets: [{
          data: this.pieData.map(d => d.value),
          backgroundColor: this.pieData.map(d => d.color),
          borderWidth: 0,
          spacing: 3,
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        cutout: '60%',
        plugins: { legend: { display: false } }
      }
    });
  }

  private createRevenueChart() {
    if (!this.revenueRef) return;
    new Chart(this.revenueRef.nativeElement, {
      type: 'bar',
      data: {
        labels: this.monthlyLabels,
        datasets: [
          { label: 'Facturado', data: this.monthlyInvoiced, backgroundColor: '#bfdbfe', borderRadius: 6 },
          { label: 'Cobrado', data: this.monthlyPaid, backgroundColor: '#3b82f6', borderRadius: 6 }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: { legend: { labels: { usePointStyle: true, pointStyle: 'circle', padding: 16 } } },
        scales: {
          x: { grid: { display: false }, ticks: { color: '#94a3b8', font: { size: 12 } } },
          y: { grid: { color: '#f1f5f9' }, ticks: { color: '#94a3b8', font: { size: 12 }, callback: (v) => `$${v}` } }
        }
      }
    });
  }
}
