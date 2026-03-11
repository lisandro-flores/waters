import { Component, OnInit } from '@angular/core';
import { ReporteService } from '../../core/services/reporte.service';

@Component({
  selector: 'app-reportes',
  template: `
    <h2>Reportes</h2>
    <mat-tab-group>
      <!-- Morosidad -->
      <mat-tab label="Morosidad">
        <div class="tab-content">
          <div *ngIf="morosidad" class="summary-row">
            <mat-card class="summary-card">
              <strong>Facturas Morosas</strong>
              <span class="big-number">{{ morosidad.totalFacturasMorosas }}</span>
            </mat-card>
            <mat-card class="summary-card warn">
              <strong>Total Deuda</strong>
              <span class="big-number">\${{ morosidad.totalDeuda | number:'1.2-2' }}</span>
            </mat-card>
          </div>
          <mat-card>
            <mat-card-content>
              <table mat-table [dataSource]="morosidad?.facturas || []" class="full-width">
                <ng-container matColumnDef="numero">
                  <th mat-header-cell *matHeaderCellDef>Factura</th>
                  <td mat-cell *matCellDef="let f">{{ f.numeroFactura }}</td>
                </ng-container>
                <ng-container matColumnDef="suscriptor">
                  <th mat-header-cell *matHeaderCellDef>Suscriptor</th>
                  <td mat-cell *matCellDef="let f">{{ f.suscriptorNombre }}</td>
                </ng-container>
                <ng-container matColumnDef="vencimiento">
                  <th mat-header-cell *matHeaderCellDef>Venció</th>
                  <td mat-cell *matCellDef="let f">{{ f.fechaVencimiento | date:'dd/MM/yyyy' }}</td>
                </ng-container>
                <ng-container matColumnDef="total">
                  <th mat-header-cell *matHeaderCellDef>Total</th>
                  <td mat-cell *matCellDef="let f">\${{ f.totalPagar | number:'1.2-2' }}</td>
                </ng-container>
                <tr mat-header-row *matHeaderRowDef="morosidadCols"></tr>
                <tr mat-row *matRowDef="let row; columns: morosidadCols;"></tr>
              </table>
            </mat-card-content>
          </mat-card>
        </div>
      </mat-tab>

      <!-- Recaudación mensual -->
      <mat-tab label="Recaudación Mensual">
        <div class="tab-content">
          <mat-card>
            <mat-card-header>
              <mat-card-title>Recaudación últimos 12 meses</mat-card-title>
            </mat-card-header>
            <mat-card-content>
              <table mat-table [dataSource]="recaudacionRows" class="full-width">
                <ng-container matColumnDef="periodo">
                  <th mat-header-cell *matHeaderCellDef>Período</th>
                  <td mat-cell *matCellDef="let r">{{ r.periodo }}</td>
                </ng-container>
                <ng-container matColumnDef="monto">
                  <th mat-header-cell *matHeaderCellDef>Recaudado</th>
                  <td mat-cell *matCellDef="let r"><strong>\${{ r.monto | number:'1.2-2' }}</strong></td>
                </ng-container>
                <tr mat-header-row *matHeaderRowDef="recaudacionCols"></tr>
                <tr mat-row *matRowDef="let row; columns: recaudacionCols;"></tr>
              </table>
              <!-- TODO: agregar gráfica con ng2-charts/chart.js -->
            </mat-card-content>
          </mat-card>
        </div>
      </mat-tab>
    </mat-tab-group>
  `,
  styles: [`
    .tab-content { padding: 24px 0; }
    .summary-row { display: flex; gap: 16px; margin-bottom: 16px; }
    .summary-card { flex: 1; display: flex; flex-direction: column; align-items: center; padding: 16px; }
    .summary-card.warn { background: #fff3e0; }
    .big-number { font-size: 28px; font-weight: 700; margin-top: 8px; color: #1976d2; }
    .summary-card.warn .big-number { color: #e65100; }
    .full-width { width: 100%; }
  `]
})
export class ReportesComponent implements OnInit {
  morosidad: any;
  recaudacionRows: { periodo: string; monto: number }[] = [];
  morosidadCols = ['numero','suscriptor','vencimiento','total'];
  recaudacionCols = ['periodo','monto'];

  constructor(private service: ReporteService) {}

  ngOnInit(): void {
    this.service.getMorosidad().subscribe(d => this.morosidad = d);
    this.service.getRecaudacionMensual().subscribe(m => {
      this.recaudacionRows = Object.entries(m).map(([periodo, monto]) => ({ periodo, monto: +monto }));
    });
  }
}
