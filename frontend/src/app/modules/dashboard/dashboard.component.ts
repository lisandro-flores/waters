import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ReporteService } from '../../core/services/reporte.service';
import { AlertaService } from '../../core/services/alerta.service';
import { DashboardData, Alerta } from '../../core/models/models';
import { AuthService } from '../../core/auth/auth.service';

interface KpiCard {
  label: string;
  value: any;
  icon: string;
  color: string;
  route: string;
  prefix?: string;
  suffix?: string;
}

interface QuickAction {
  label: string;
  icon: string;
  route: string;
  color: string;
}

@Component({
  selector: 'app-dashboard',
  template: `
    <div class="dashboard animate-in">
      <!-- Header -->
      <div class="dash-header">
        <div>
          <h2 class="page-title">Dashboard</h2>
          <p class="subtitle">{{ comunidadNombre }} · {{ hoy | date:'MMMM yyyy':'':'es' | titlecase }}</p>
        </div>
      </div>

      <!-- KPI Cards -->
      <div class="kpi-grid" *ngIf="!loading; else spinner">
        <mat-card *ngFor="let kpi of kpiCards" class="kpi-card"
                  [style.border-left-color]="kpi.color"
                  (click)="router.navigate([kpi.route])">
          <mat-card-content>
            <div class="kpi-content">
              <div class="kpi-info">
                <span class="kpi-label">{{ kpi.label }}</span>
                <span class="kpi-value">{{ kpi.prefix }}{{ kpi.value | number:'1.0-0' }}{{ kpi.suffix }}</span>
              </div>
              <div class="kpi-icon-wrap" [style.background]="kpi.color + '14'" [style.color]="kpi.color">
                <mat-icon>{{ kpi.icon }}</mat-icon>
              </div>
            </div>
          </mat-card-content>
        </mat-card>
      </div>

      <!-- Quick Actions -->
      <div class="section-label">Acciones rápidas</div>
      <div class="quick-actions">
        <button *ngFor="let action of quickActions" mat-stroked-button
                class="quick-action-btn"
                [style.--accent]="action.color"
                (click)="router.navigate([action.route])">
          <mat-icon>{{ action.icon }}</mat-icon>
          {{ action.label }}
        </button>
      </div>

      <!-- Alertas pendientes -->
      <div class="section-label" *ngIf="alertas.length > 0">
        Alertas pendientes
        <span class="badge-count">{{ alertas.length }}</span>
      </div>
      <mat-card class="alertas-card" *ngIf="alertas.length > 0">
        <mat-card-content class="alertas-content">
          <div *ngFor="let alerta of alertas; let last = last" class="alerta-row">
            <div class="alerta-icon-circle" [ngClass]="'severity-' + getSeverity(alerta.tipo)">
              <mat-icon>{{ getAlertaIcon(alerta.tipo) }}</mat-icon>
            </div>
            <div class="alerta-body">
              <span class="alerta-msg">{{ alerta.mensaje }}</span>
              <span class="alerta-time">{{ alerta.creadoEn | date:'dd/MM/yyyy HH:mm' }}</span>
            </div>
            <div class="alerta-actions">
              <button mat-icon-button matTooltip="Resolver" color="primary"
                      (click)="resolverAlerta(alerta)">
                <mat-icon>check_circle</mat-icon>
              </button>
              <button mat-icon-button matTooltip="Descartar"
                      (click)="descartarAlerta(alerta)">
                <mat-icon>close</mat-icon>
              </button>
            </div>
            <mat-divider *ngIf="!last"></mat-divider>
          </div>
        </mat-card-content>
      </mat-card>

      <!-- Empty alertas -->
      <mat-card class="alertas-card no-alertas" *ngIf="!loading && alertas.length === 0">
        <mat-card-content>
          <div class="empty-state">
            <mat-icon>verified</mat-icon>
            <p>Sin alertas pendientes. ¡Todo en orden!</p>
          </div>
        </mat-card-content>
      </mat-card>
    </div>

    <ng-template #spinner>
      <div class="spinner-center">
        <mat-spinner diameter="48"></mat-spinner>
      </div>
    </ng-template>
  `,
  styles: [`
    .dashboard { max-width: 1100px; }
    .dash-header { margin-bottom: 24px; }
    .page-title { margin: 0 0 4px; font-size: 24px; font-weight: 700; color: #1a2a3a; }
    .subtitle { color: #78909c; margin: 0; font-size: 14px; }

    /* ---- KPI Grid ---- */
    .kpi-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(210px, 1fr));
      gap: 16px; margin-bottom: 28px;
    }
    .kpi-card {
      cursor: pointer;
      border-left: 4px solid transparent;
      transition: transform 200ms ease, box-shadow 200ms ease;
    }
    .kpi-card:hover {
      transform: translateY(-3px);
      box-shadow: var(--shadow-lg, 0 8px 24px rgba(0,0,0,0.12));
    }
    .kpi-content { display: flex; justify-content: space-between; align-items: center; }
    .kpi-info { display: flex; flex-direction: column; gap: 2px; }
    .kpi-label { font-size: 12px; color: #90a4ae; font-weight: 500; text-transform: uppercase; letter-spacing: 0.4px; }
    .kpi-value { font-size: 28px; font-weight: 800; color: #263238; line-height: 1.1; }
    .kpi-icon-wrap {
      width: 48px; height: 48px; border-radius: 12px;
      display: flex; align-items: center; justify-content: center;
      flex-shrink: 0;
    }
    .kpi-icon-wrap mat-icon { font-size: 26px; width: 26px; height: 26px; }

    /* ---- Section labels ---- */
    .section-label {
      font-size: 13px; font-weight: 600; text-transform: uppercase;
      letter-spacing: 0.5px; color: #607d8b;
      margin-bottom: 12px; display: flex; align-items: center; gap: 8px;
    }
    .badge-count {
      background: #ff5252; color: white; font-size: 11px; font-weight: 700;
      padding: 1px 7px; border-radius: 10px; line-height: 1.4;
    }

    /* ---- Quick Actions ---- */
    .quick-actions { display: flex; flex-wrap: wrap; gap: 10px; margin-bottom: 28px; }
    .quick-action-btn {
      display: flex; align-items: center; gap: 6px;
      border-radius: 8px !important;
      font-size: 13px; font-weight: 500;
      transition: background 150ms ease, color 150ms ease;
    }
    .quick-action-btn:hover {
      background: var(--accent, #0078a9);
      color: white;
    }
    .quick-action-btn mat-icon { font-size: 18px; width: 18px; height: 18px; }

    /* ---- Alertas ---- */
    .alertas-card { margin-bottom: 24px; }
    .alertas-content { padding: 8px 0 !important; }
    .alerta-row {
      display: flex; align-items: center; gap: 14px;
      padding: 10px 16px; transition: background 150ms ease;
    }
    .alerta-row:hover { background: #fafbfc; }
    .alerta-icon-circle {
      width: 38px; height: 38px; border-radius: 50%;
      display: flex; align-items: center; justify-content: center;
      flex-shrink: 0;
    }
    .alerta-icon-circle mat-icon { font-size: 20px; width: 20px; height: 20px; }
    .severity-high   { background: #ffebee; color: #d32f2f; }
    .severity-medium { background: #fff3e0; color: #ef6c00; }
    .severity-low    { background: #e3f2fd; color: #1976d2; }
    .alerta-body { flex: 1; display: flex; flex-direction: column; gap: 2px; min-width: 0; }
    .alerta-msg { font-size: 14px; color: #37474f; }
    .alerta-time { font-size: 12px; color: #b0bec5; }
    .alerta-actions { display: flex; gap: 2px; flex-shrink: 0; }
    .no-alertas .empty-state mat-icon { color: #43a047; }
    .spinner-center { display: flex; justify-content: center; padding: 48px; }

    @media (max-width: 768px) {
      .kpi-grid { grid-template-columns: repeat(2, 1fr); gap: 10px; }
      .quick-actions { gap: 8px; }
      .alerta-actions { flex-direction: column; }
    }
    @media (max-width: 480px) {
      .kpi-grid { grid-template-columns: 1fr; }
    }
  `]
})
export class DashboardComponent implements OnInit {
  data: DashboardData | null = null;
  alertas: Alerta[] = [];
  loading = true;
  hoy = new Date();
  comunidadNombre = '';
  kpiCards: KpiCard[] = [];

  quickActions: QuickAction[] = [
    { label: 'Registrar Lectura',  icon: 'edit_note',    route: '/lecturas',      color: '#0288d1' },
    { label: 'Nuevo Suscriptor',   icon: 'person_add',   route: '/suscriptores',  color: '#388e3c' },
    { label: 'Ver Facturación',    icon: 'receipt_long',  route: '/facturacion',   color: '#7b1fa2' },
    { label: 'Registrar Pago',    icon: 'payments',      route: '/pagos',         color: '#ef6c00' },
  ];

  constructor(
    private reporteService: ReporteService,
    private alertaService: AlertaService,
    private authService: AuthService,
    public router: Router
  ) {}

  ngOnInit(): void {
    this.comunidadNombre = this.authService.getCurrentUser()?.comunidadNombre || '';
    this.cargarDatos();
  }

  cargarDatos(): void {
    this.reporteService.getDashboard().subscribe({
      next: (data) => {
        this.data = data;
        this.buildKpiCards(data);
        this.loading = false;
      },
      error: () => { this.loading = false; }
    });

    this.reporteService.getAlertasPendientes().subscribe({
      next: (alertas) => this.alertas = alertas.slice(0, 5),
      error: () => {}
    });
  }

  buildKpiCards(data: DashboardData): void {
    this.kpiCards = [
      { label: 'Suscriptores Activos', value: data.totalSuscriptores,    icon: 'people',       color: '#1976d2', route: '/suscriptores' },
      { label: 'Facturado (mes)',       value: data.facturadoMesActual,   icon: 'receipt_long', color: '#388e3c', route: '/facturacion', prefix: '$' },
      { label: 'Recaudado (mes)',       value: data.recaudadoMesActual,   icon: 'payments',     color: '#0288d1', route: '/pagos', prefix: '$' },
      { label: 'Ctas. Pendientes',      value: data.cuentasPendientes,    icon: 'pending',      color: '#f57c00', route: '/facturacion' },
      { label: 'Ctas. Morosas',         value: data.cuentasMorosas,       icon: 'warning',      color: '#d32f2f', route: '/reportes' }
    ];
  }

  resolverAlerta(alerta: Alerta): void {
    this.alertaService.resolver(alerta.id!).subscribe({
      next: () => this.alertas = this.alertas.filter(a => a !== alerta),
      error: () => {}
    });
  }

  descartarAlerta(alerta: Alerta): void {
    this.alertaService.descartar(alerta.id!).subscribe({
      next: () => this.alertas = this.alertas.filter(a => a !== alerta),
      error: () => {}
    });
  }

  getSeverity(tipo: string): string {
    const high = ['MORA_VENCIDA', 'FUGA_POSIBLE', 'SUSCRIPTOR_SUSPENDIDO'];
    const medium = ['CONSUMO_ANOMALO', 'MEDIDOR_SIN_LECTURA'];
    if (high.includes(tipo)) return 'high';
    if (medium.includes(tipo)) return 'medium';
    return 'low';
  }

  getAlertaIcon(tipo: string): string {
    const icons: Record<string, string> = {
      CONSUMO_ANOMALO: 'trending_up',
      MORA_VENCIDA: 'alarm_off',
      MEDIDOR_SIN_LECTURA: 'speed',
      FUGA_POSIBLE: 'water_damage',
      SUSCRIPTOR_SUSPENDIDO: 'block',
      MANTENIMIENTO: 'build'
    };
    return icons[tipo] || 'warning';
  }
}
