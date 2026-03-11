import { Component, OnInit } from '@angular/core';
import { FacturaService } from '../../../core/services/factura.service';
import { Factura } from '../../../core/models/models';

@Component({
  selector: 'app-facturacion-list',
  template: `
    <div class="page-header">
      <div><h2>Facturacion</h2></div>
      <button mat-raised-button color="primary" routerLink="generar-masivo">
        <mat-icon>receipt_long</mat-icon> Generar Masivo
      </button>
    </div>

    <div class="spinner-container" *ngIf="loading">
      <mat-spinner diameter="40"></mat-spinner>
      <p>Cargando facturas...</p>
    </div>

    <mat-card *ngIf="!loading" class="table-card">
      <mat-card-content class="table-content">
        <table mat-table [dataSource]="facturas" class="app-table">
          <ng-container matColumnDef="numero">
            <th mat-header-cell *matHeaderCellDef>Factura</th>
            <td mat-cell *matCellDef="let f">{{f.numeroFactura}}</td>
          </ng-container>
          <ng-container matColumnDef="suscriptor">
            <th mat-header-cell *matHeaderCellDef>Suscriptor</th>
            <td mat-cell *matCellDef="let f">{{f.suscriptorNombre}}</td>
          </ng-container>
          <ng-container matColumnDef="periodo">
            <th mat-header-cell *matHeaderCellDef>Periodo</th>
            <td mat-cell *matCellDef="let f">{{f.anio}}/{{f.mes}}</td>
          </ng-container>
          <ng-container matColumnDef="consumo">
            <th mat-header-cell *matHeaderCellDef>m3</th>
            <td mat-cell *matCellDef="let f">{{f.consumoM3}}</td>
          </ng-container>
          <ng-container matColumnDef="total">
            <th mat-header-cell *matHeaderCellDef>Total</th>
            <td mat-cell *matCellDef="let f"><strong>{{f.totalPagar | currency}}</strong></td>
          </ng-container>
          <ng-container matColumnDef="estado">
            <th mat-header-cell *matHeaderCellDef>Estado</th>
            <td mat-cell *matCellDef="let f">
              <mat-chip [class]="'chip-' + f.estado.toLowerCase()">{{f.estado}}</mat-chip>
            </td>
          </ng-container>
          <ng-container matColumnDef="vencimiento">
            <th mat-header-cell *matHeaderCellDef>Vence</th>
            <td mat-cell *matCellDef="let f">{{f.fechaVencimiento | date:'dd/MM/yyyy'}}</td>
          </ng-container>
          <tr mat-header-row *matHeaderRowDef="cols"></tr>
          <tr mat-row *matRowDef="let row; columns: cols;" class="row-hover"></tr>
          <tr class="mat-row" *matNoDataRow>
            <td class="mat-cell" colspan="7">
              <div class="empty-state">
                <mat-icon>receipt_long</mat-icon>
                <p>No se encontraron facturas</p>
              </div>
            </td>
          </tr>
        </table>

        <mat-paginator [length]="total" [pageSize]="20"
                       [pageSizeOptions]="[10,20,50]"
                       (page)="onPage($event)">
        </mat-paginator>
      </mat-card-content>
    </mat-card>
  `,
  styles: [`
    .page-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 24px; }
    .page-header h2 { margin: 0; }
    .spinner-container { display: flex; flex-direction: column; align-items: center; justify-content: center; padding: 48px 24px; gap: 16px; }
    .spinner-container p { color: #78909c; font-size: 14px; }
    .table-card { }
    .table-content { padding: 0 !important; }
    .app-table { width: 100%; }
    .row-hover:hover { background: #f4f6f9; }
    .empty-state { display: flex; flex-direction: column; align-items: center; justify-content: center; padding: 32px; color: #90a4ae; }
    .empty-state mat-icon { font-size: 48px; width: 48px; height: 48px; margin-bottom: 8px; opacity: 0.5; }
    .empty-state p { margin: 0; font-size: 14px; }
    .chip-pagada { background: #c8e6c9 !important; }
    .chip-pendiente { background: #fff9c4 !important; }
    .chip-vencida { background: #ffcdd2 !important; }
    .chip-pagada_parcial { background: #bbdefb !important; }
  `]
})
export class FacturacionListComponent implements OnInit {
  facturas: Factura[] = [];
  total = 0;
  cols = ['numero','suscriptor','periodo','consumo','total','estado','vencimiento'];
  loading = true;

  constructor(private service: FacturaService) {}

  ngOnInit(): void { this.cargar(); }

  cargar(page = 0): void {
    this.loading = true;
    this.service.listar(page).subscribe({
      next: (p) => {
        this.facturas = p.content;
        this.total = p.totalElements;
        this.loading = false;
      },
      error: () => { this.loading = false; }
    });
  }

  onPage(e: any): void { this.cargar(e.pageIndex); }
}
