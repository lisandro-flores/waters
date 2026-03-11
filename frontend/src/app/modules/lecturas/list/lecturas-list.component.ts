import { Component, OnInit } from '@angular/core';
import { LecturaService } from '../../../core/services/lectura.service';
import { Lectura } from '../../../core/models/models';

@Component({
  selector: 'app-lecturas-list',
  template: `
    <div class="page-header">
      <div>
        <h2>Lecturas de Medidores</h2>
      </div>
      <button mat-raised-button color="primary" routerLink="nueva">
        <mat-icon>edit_note</mat-icon> Registrar Lectura
      </button>
    </div>

    <!-- Filter Card -->
    <mat-card class="filter-card">
      <mat-card-content class="filter-content">
        <mat-form-field appearance="outline">
          <mat-label>Año</mat-label>
          <mat-select [(value)]="anioSel" (selectionChange)="cargar()">
            <mat-option *ngFor="let a of anios" [value]="a">{{ a }}</mat-option>
          </mat-select>
        </mat-form-field>
        <mat-form-field appearance="outline">
          <mat-label>Mes</mat-label>
          <mat-select [(value)]="mesSel" (selectionChange)="cargar()">
            <mat-option *ngFor="let m of meses; let i = index" [value]="i + 1">{{ m }}</mat-option>
          </mat-select>
        </mat-form-field>
      </mat-card-content>
    </mat-card>

    <!-- Loading spinner -->
    <div class="spinner-container" *ngIf="loading">
      <mat-spinner diameter="40"></mat-spinner>
      <p>Cargando lecturas...</p>
    </div>

    <!-- Table -->
    <mat-card *ngIf="!loading" class="table-card">
      <mat-card-content class="table-content">
        <table mat-table [dataSource]="lecturas" class="app-table">
          <ng-container matColumnDef="medidor">
            <th mat-header-cell *matHeaderCellDef>Medidor</th>
            <td mat-cell *matCellDef="let l">{{ l.medidorSerie }}</td>
          </ng-container>
          <ng-container matColumnDef="anterior">
            <th mat-header-cell *matHeaderCellDef>Lectura Anterior</th>
            <td mat-cell *matCellDef="let l">{{ l.lecturaAnterior | number:'1.1-1' }}</td>
          </ng-container>
          <ng-container matColumnDef="actual">
            <th mat-header-cell *matHeaderCellDef>Lectura Actual</th>
            <td mat-cell *matCellDef="let l">{{ l.lecturaActual | number:'1.1-1' }}</td>
          </ng-container>
          <ng-container matColumnDef="consumo">
            <th mat-header-cell *matHeaderCellDef>Consumo m³</th>
            <td mat-cell *matCellDef="let l"><strong>{{ l.consumoM3 | number:'1.1-1' }}</strong></td>
          </ng-container>
          <ng-container matColumnDef="fecha">
            <th mat-header-cell *matHeaderCellDef>Fecha Lectura</th>
            <td mat-cell *matCellDef="let l">{{ l.fechaLectura | date:'dd/MM/yyyy' }}</td>
          </ng-container>
          <tr mat-header-row *matHeaderRowDef="cols"></tr>
          <tr mat-row *matRowDef="let row; columns: cols;" class="row-hover"></tr>
          <tr class="mat-row" *matNoDataRow>
            <td class="mat-cell" colspan="5">
              <div class="empty-state">
                <mat-icon>edit_note</mat-icon>
                <p>Sin lecturas para el período seleccionado</p>
              </div>
            </td>
          </tr>
        </table>
      </mat-card-content>
    </mat-card>
  `,
  styles: [`
    .page-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 24px; }
    .page-header h2 { margin: 0; }
    .filter-card { margin-bottom: 16px; }
    .filter-content { display: flex; gap: 16px; flex-wrap: wrap; padding: 8px !important; }
    .filter-content mat-form-field { min-width: 140px; }
    .spinner-container { display: flex; flex-direction: column; align-items: center; justify-content: center; padding: 48px 24px; gap: 16px; }
    .spinner-container p { color: #78909c; font-size: 14px; }
    .table-card { }
    .table-content { padding: 0 !important; }
    .app-table { width: 100%; }
    .row-hover:hover { background: #f4f6f9; }
    .empty-state { display: flex; flex-direction: column; align-items: center; justify-content: center; padding: 32px; color: #90a4ae; }
    .empty-state mat-icon { font-size: 48px; width: 48px; height: 48px; margin-bottom: 8px; opacity: 0.5; }
    .empty-state p { margin: 0; font-size: 14px; }
  `]
})
export class LecturasListComponent implements OnInit {
  lecturas: Lectura[] = [];
  cols = ['medidor', 'anterior', 'actual', 'consumo', 'fecha'];
  anioSel = new Date().getFullYear();
  mesSel = new Date().getMonth() + 1;
  anios = [2026, 2025, 2024];
  meses = ['Enero','Febrero','Marzo','Abril','Mayo','Junio',
           'Julio','Agosto','Septiembre','Octubre','Noviembre','Diciembre'];
  loading = true;

  constructor(private service: LecturaService) {}

  ngOnInit(): void { 
    this.cargar(); 
  }

  cargar(): void {
    this.loading = true;
    this.service.getPorPeriodo(this.anioSel, this.mesSel)
      .subscribe({
        next: (l) => { this.lecturas = l; this.loading = false; },
        error: () => { this.loading = false; }
      });
  }
}
