import { Component, OnInit } from '@angular/core';
import { MedidorService } from '../../../core/services/medidor.service';
import { Medidor, EstadoMedidor } from '../../../core/models/models';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-medidores-list',
  template: `
    <div class="page-header">
      <div>
        <h2>Medidores</h2>
      </div>
      <button mat-raised-button color="primary" routerLink="nuevo">
        <mat-icon>add</mat-icon> Nuevo Medidor
      </button>
    </div>

    <mat-card class="filter-card">
      <mat-card-content class="filter-content">
        <mat-form-field appearance="outline" class="filtro-estado">
          <mat-label>Filtrar por estado</mat-label>
          <mat-select [(value)]="filtroEstado" (selectionChange)="cargarMedidores()">
            <mat-option value="">Todos</mat-option>
            <mat-option value="ACTIVO">Activo</mat-option>
            <mat-option value="SUSPENDIDO">Suspendido</mat-option>
            <mat-option value="RETIRADO">Retirado</mat-option>
            <mat-option value="EN_REPARACION">En reparación</mat-option>
          </mat-select>
        </mat-form-field>
      </mat-card-content>
    </mat-card>

    <!-- Loading spinner -->
    <div class="spinner-container" *ngIf="cargando">
      <mat-spinner diameter="40"></mat-spinner>
      <p>Cargando medidores...</p>
    </div>

    <!-- Table -->
    <mat-card *ngIf="!cargando && medidores.length > 0" class="table-card">
      <mat-card-content class="table-content">
        <table mat-table [dataSource]="medidores" class="app-table">
          <ng-container matColumnDef="numeroSerie">
            <th mat-header-cell *matHeaderCellDef>N° Serie</th>
            <td mat-cell *matCellDef="let m">{{ m.numeroSerie }}</td>
          </ng-container>

          <ng-container matColumnDef="marca">
            <th mat-header-cell *matHeaderCellDef>Marca</th>
            <td mat-cell *matCellDef="let m">{{ m.marca || '—' }}</td>
          </ng-container>

          <ng-container matColumnDef="suscriptor">
            <th mat-header-cell *matHeaderCellDef>Suscriptor</th>
            <td mat-cell *matCellDef="let m">{{ m.suscriptor?.nombre }} {{ m.suscriptor?.apellido }}</td>
          </ng-container>

          <ng-container matColumnDef="lecturaInicial">
            <th mat-header-cell *matHeaderCellDef>Lectura Inicial</th>
            <td mat-cell *matCellDef="let m">{{ m.lecturaInicial }}</td>
          </ng-container>

          <ng-container matColumnDef="estado">
            <th mat-header-cell *matHeaderCellDef>Estado</th>
            <td mat-cell *matCellDef="let m">
              <mat-chip [class]="'chip-' + m.estado?.toLowerCase()">{{ m.estado }}</mat-chip>
            </td>
          </ng-container>

          <ng-container matColumnDef="acciones">
            <th mat-header-cell *matHeaderCellDef>Acciones</th>
            <td mat-cell *matCellDef="let m">
              <button mat-icon-button matTooltip="Editar" [routerLink]="[m.id, 'editar']">
                <mat-icon>edit</mat-icon>
              </button>
              <button mat-icon-button matTooltip="Dar de baja" color="warn"
                      *ngIf="m.estado === 'ACTIVO'" (click)="darDeBaja(m)">
                <mat-icon>block</mat-icon>
              </button>
            </td>
          </ng-container>

          <tr mat-header-row *matHeaderRowDef="displayedColumns"></tr>
          <tr mat-row *matRowDef="let row; columns: displayedColumns;" class="row-hover"></tr>
        </table>
      </mat-card-content>
    </mat-card>

    <!-- Empty state -->
    <mat-card *ngIf="!cargando && medidores.length === 0" class="empty-card">
      <mat-card-content>
        <div class="empty-state">
          <mat-icon>speed</mat-icon>
          <p>No se encontraron medidores</p>
        </div>
      </mat-card-content>
    </mat-card>
  `,
  styles: [`
    .page-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 24px; }
    .page-header h2 { margin: 0; }
    .filter-card { margin-bottom: 16px; }
    .filter-content { display: flex; gap: 16px; flex-wrap: wrap; padding: 8px !important; }
    .filtro-estado { min-width: 200px; }
    .spinner-container { display: flex; flex-direction: column; align-items: center; justify-content: center; padding: 48px 24px; gap: 16px; }
    .spinner-container p { color: #78909c; font-size: 14px; }
    .table-card { }
    .table-content { padding: 0 !important; }
    .app-table { width: 100%; }
    .row-hover:hover { background: #f4f6f9; }
    .empty-card { }
    .empty-state { display: flex; flex-direction: column; align-items: center; justify-content: center; padding: 48px 24px; color: #90a4ae; }
    .empty-state mat-icon { font-size: 56px; width: 56px; height: 56px; margin-bottom: 16px; opacity: 0.4; }
    .empty-state p { margin: 0; font-size: 14px; }
    .chip-activo { background-color: #c8e6c9 !important; }
    .chip-suspendido { background-color: #fff9c4 !important; }
    .chip-retirado { background-color: #ffcdd2 !important; }
    .chip-en_reparacion { background-color: #b3e5fc !important; }
  `]
})
export class MedidoresListComponent implements OnInit {
  medidores: Medidor[] = [];
  filtroEstado = '';
  cargando = false;
  displayedColumns = ['numeroSerie', 'marca', 'suscriptor', 'lecturaInicial', 'estado', 'acciones'];

  constructor(
    private medidorService: MedidorService,
    private snack: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.cargarMedidores();
  }

  cargarMedidores(): void {
    this.cargando = true;
    const estado = this.filtroEstado || undefined;
    this.medidorService.listar(estado).subscribe({
      next: (data) => { this.medidores = data; this.cargando = false; },
      error: () => { this.cargando = false; }
    });
  }

  darDeBaja(medidor: Medidor): void {
    // TODO: Replace with MatDialog.open() for better UX
    if (confirm(`¿Dar de baja el medidor ${medidor.numeroSerie}?`)) {
      this.medidorService.darDeBaja(medidor.id).subscribe({
        next: () => {
          this.snack.open('Medidor dado de baja', 'OK', { duration: 3000 });
          this.cargarMedidores();
        }
      });
    }
  }
}
