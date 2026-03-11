import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { SuscriptorService } from '../../../core/services/suscriptor.service';
import { MedidorService } from '../../../core/services/medidor.service';
import { FacturaService } from '../../../core/services/factura.service';
import { Suscriptor, Medidor, Factura } from '../../../core/models/models';

@Component({
  selector: 'app-suscriptor-detalle',
  template: `
    <div *ngIf="suscriptor">
      <div class="page-header">
        <h2>{{ suscriptor.nombre }} {{ suscriptor.apellido }}</h2>
        <div>
          <button mat-button routerLink="/suscriptores">
            <mat-icon>arrow_back</mat-icon> Volver
          </button>
          <button mat-raised-button color="primary"
                  [routerLink]="['/suscriptores', suscriptor.id, 'editar']">
            <mat-icon>edit</mat-icon> Editar
          </button>
        </div>
      </div>

      <!-- Datos personales -->
      <mat-card class="info-card">
        <mat-card-header>
          <mat-icon mat-card-avatar>person</mat-icon>
          <mat-card-title>Cuenta: {{ suscriptor.numeroCuenta }}</mat-card-title>
          <mat-card-subtitle>{{ suscriptor.tipo }} · {{ suscriptor.estado }}</mat-card-subtitle>
        </mat-card-header>
        <mat-card-content>
          <div class="info-grid">
            <div><strong>Identificación:</strong> {{ suscriptor.identificacion || '-' }}</div>
            <div><strong>Dirección:</strong> {{ suscriptor.direccion || '-' }}</div>
            <div><strong>Teléfono:</strong> {{ suscriptor.telefono || '-' }}</div>
            <div><strong>Email:</strong> {{ suscriptor.email || '-' }}</div>
          </div>
        </mat-card-content>
      </mat-card>

      <!-- Medidores -->
      <mat-card class="info-card">
        <mat-card-header>
          <mat-icon mat-card-avatar>speed</mat-icon>
          <mat-card-title>Medidores</mat-card-title>
          <button mat-icon-button color="primary" matTooltip="Agregar medidor">
            <mat-icon>add</mat-icon>
          </button>
        </mat-card-header>
        <mat-card-content>
          <mat-list>
            <mat-list-item *ngFor="let m of medidores">
              <mat-icon matListItemIcon>speed</mat-icon>
              <span matListItemTitle>Serie: {{ m.numeroSerie }}</span>
              <span matListItemLine>{{ m.marca }} · {{ m.diametro }} · {{ m.estado }}</span>
            </mat-list-item>
            <p *ngIf="medidores.length === 0" class="no-data">Sin medidores registrados</p>
          </mat-list>
        </mat-card-content>
      </mat-card>

      <!-- Historial de facturas -->
      <mat-card class="info-card">
        <mat-card-header>
          <mat-icon mat-card-avatar>receipt_long</mat-icon>
          <mat-card-title>Historial de Facturas</mat-card-title>
        </mat-card-header>
        <mat-card-content>
          <table mat-table [dataSource]="facturas" class="full-width">
            <ng-container matColumnDef="numero">
              <th mat-header-cell *matHeaderCellDef>Factura</th>
              <td mat-cell *matCellDef="let f">{{ f.numeroFactura }}</td>
            </ng-container>
            <ng-container matColumnDef="periodo">
              <th mat-header-cell *matHeaderCellDef>Período</th>
              <td mat-cell *matCellDef="let f">{{ f.anio }}/{{ f.mes | number:'2.0-0' }}</td>
            </ng-container>
            <ng-container matColumnDef="consumo">
              <th mat-header-cell *matHeaderCellDef>m³</th>
              <td mat-cell *matCellDef="let f">{{ f.consumoM3 | number:'1.1-1' }}</td>
            </ng-container>
            <ng-container matColumnDef="total">
              <th mat-header-cell *matHeaderCellDef>Total</th>
              <td mat-cell *matCellDef="let f">\${{ f.totalPagar | number:'1.2-2' }}</td>
            </ng-container>
            <ng-container matColumnDef="estado">
              <th mat-header-cell *matHeaderCellDef>Estado</th>
              <td mat-cell *matCellDef="let f">
                <mat-chip [class]="'chip-' + f.estado.toLowerCase()">{{ f.estado }}</mat-chip>
              </td>
            </ng-container>
            <tr mat-header-row *matHeaderRowDef="facturaColumns"></tr>
            <tr mat-row *matRowDef="let row; columns: facturaColumns;"></tr>
          </table>
        </mat-card-content>
      </mat-card>
    </div>
  `,
  styles: [`
    .page-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 24px; }
    .page-header h2 { margin: 0; }
    .info-card { margin-bottom: 16px; }
    .info-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 8px 24px; padding: 8px 0; }
    .full-width { width: 100%; }
    .no-data { color: #999; text-align: center; padding: 16px; }
    .chip-pagada { background: #c8e6c9 !important; }
    .chip-pendiente { background: #fff9c4 !important; }
    .chip-vencida { background: #ffcdd2 !important; }
  `]
})
export class SuscriptorDetalleComponent implements OnInit {
  suscriptor?: Suscriptor;
  medidores: Medidor[] = [];
  facturas: Factura[] = [];
  facturaColumns = ['numero', 'periodo', 'consumo', 'total', 'estado'];

  constructor(
    private route: ActivatedRoute,
    private suscriptorService: SuscriptorService,
    private medidorService: MedidorService,
    private facturaService: FacturaService
  ) {}

  ngOnInit(): void {
    const id = +this.route.snapshot.params['id'];
    this.suscriptorService.getById(id).subscribe(s => this.suscriptor = s);
    this.medidorService.getPorSuscriptor(id).subscribe(m => this.medidores = m);
    this.facturaService.getPorSuscriptor(id).subscribe(f => this.facturas = f);
  }
}
