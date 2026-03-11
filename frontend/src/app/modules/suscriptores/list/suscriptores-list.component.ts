import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { SuscriptorService } from '../../../core/services/suscriptor.service';
import { Suscriptor } from '../../../core/models/models';

@Component({
  selector: 'app-suscriptores-list',
  template: `
    <div class="page-header">
      <div>
        <h2>Suscriptores</h2>
      </div>
      <button mat-raised-button color="primary" routerLink="nuevo">
        <mat-icon>person_add</mat-icon> Nuevo Suscriptor
      </button>
    </div>

    <mat-card class="search-card">
      <mat-card-content>
        <mat-form-field appearance="outline" class="search-field">
          <mat-label>Buscar por nombre, apellido o cuenta</mat-label>
          <input matInput (keyup.enter)="buscar($event)" #searchInput />
          <mat-icon matSuffix>search</mat-icon>
        </mat-form-field>
      </mat-card-content>
    </mat-card>

    <!-- Loading spinner -->
    <div class="spinner-container" *ngIf="loading">
      <mat-spinner diameter="40"></mat-spinner>
      <p>Cargando suscriptores...</p>
    </div>

    <!-- Table -->
    <mat-card *ngIf="!loading" class="table-card">
      <mat-card-content class="table-content">
        <table mat-table [dataSource]="dataSource" class="app-table">
          <ng-container matColumnDef="numeroCuenta">
            <th mat-header-cell *matHeaderCellDef>Cuenta</th>
            <td mat-cell *matCellDef="let s">{{ s.numeroCuenta }}</td>
          </ng-container>

          <ng-container matColumnDef="nombre">
            <th mat-header-cell *matHeaderCellDef>Nombre</th>
            <td mat-cell *matCellDef="let s">{{ s.nombre }} {{ s.apellido }}</td>
          </ng-container>

          <ng-container matColumnDef="tipo">
            <th mat-header-cell *matHeaderCellDef>Tipo</th>
            <td mat-cell *matCellDef="let s">
              <mat-chip [class]="'chip-' + s.tipo.toLowerCase()">{{ s.tipo }}</mat-chip>
            </td>
          </ng-container>

          <ng-container matColumnDef="estado">
            <th mat-header-cell *matHeaderCellDef>Estado</th>
            <td mat-cell *matCellDef="let s">
              <mat-chip [class]="'chip-' + s.estado.toLowerCase()">{{ s.estado }}</mat-chip>
            </td>
          </ng-container>

          <ng-container matColumnDef="telefono">
            <th mat-header-cell *matHeaderCellDef>Teléfono</th>
            <td mat-cell *matCellDef="let s">{{ s.telefono || '-' }}</td>
          </ng-container>

          <ng-container matColumnDef="acciones">
            <th mat-header-cell *matHeaderCellDef>Acciones</th>
            <td mat-cell *matCellDef="let s">
              <button mat-icon-button [routerLink]="[s.id]" matTooltip="Ver detalle">
                <mat-icon>visibility</mat-icon>
              </button>
              <button mat-icon-button [routerLink]="[s.id, 'editar']" matTooltip="Editar">
                <mat-icon>edit</mat-icon>
              </button>
            </td>
          </ng-container>

          <tr mat-header-row *matHeaderRowDef="displayedColumns"></tr>
          <tr mat-row *matRowDef="let row; columns: displayedColumns;" class="row-hover"></tr>
          <tr class="mat-row" *matNoDataRow>
            <td class="mat-cell" colspan="6">
              <div class="empty-state">
                <mat-icon>person_search</mat-icon>
                <p>No se encontraron suscriptores</p>
              </div>
            </td>
          </tr>
        </table>

        <mat-paginator [length]="totalElements" [pageSize]="pageSize"
                       [pageSizeOptions]="[10, 20, 50]"
                       (page)="onPageChange($event)">
        </mat-paginator>
      </mat-card-content>
    </mat-card>
  `,
  styles: [`
    .page-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 24px; }
    .page-header h2 { margin: 0; }
    .search-card { margin-bottom: 16px; }
    .search-field { width: 100%; }
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
export class SuscriptoresListComponent implements OnInit {
  displayedColumns = ['numeroCuenta', 'nombre', 'tipo', 'estado', 'telefono', 'acciones'];
  dataSource = new MatTableDataSource<Suscriptor>();
  totalElements = 0;
  pageSize = 20;
  pageIndex = 0;
  searchQuery = '';
  loading = true;

  constructor(private suscriptorService: SuscriptorService) {}

  ngOnInit(): void {
    this.cargar();
  }

  cargar(): void {
    this.loading = true;
    this.suscriptorService.listar(this.pageIndex, this.pageSize, this.searchQuery)
      .subscribe({
        next: (page) => {
          this.dataSource.data = page.content;
          this.totalElements = page.totalElements;
          this.loading = false;
        },
        error: () => { this.loading = false; }
      });
  }

  buscar(event: Event): void {
    this.searchQuery = (event.target as HTMLInputElement).value;
    this.pageIndex = 0;
    this.cargar();
  }

  onPageChange(evt: PageEvent): void {
    this.pageIndex = evt.pageIndex;
    this.pageSize = evt.pageSize;
    this.cargar();
  }
}
