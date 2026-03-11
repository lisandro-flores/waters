import { Component, OnInit } from '@angular/core';
import { TarifaService } from '../../../core/services/tarifa.service';
import { Tarifa } from '../../../core/models/models';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-tarifas-list',
  template: `
    <div class="page-header">
      <div><h2>Tarifas</h2></div>
      <button mat-raised-button color="primary" routerLink="nueva">
        <mat-icon>add</mat-icon> Nueva Tarifa
      </button>
    </div>

    <div class="spinner-container" *ngIf="cargando">
      <mat-spinner diameter="40"></mat-spinner>
      <p>Cargando tarifas...</p>
    </div>

    <div class="tarifas-grid" *ngIf="!cargando">
      <mat-card *ngFor="let t of tarifas" class="tarifa-card animate-in">
        <mat-card-header>
          <mat-card-title>{{t.nombre}}</mat-card-title>
          <mat-card-subtitle>{{t.tipoSuscriptor}} - Cuota: {{t.cuotaFija | currency}}</mat-card-subtitle>
        </mat-card-header>
        <mat-card-content>
          <div class="tarifa-meta">
            <div class="meta-item">
              <span class="meta-label">Mora</span>
              <strong>{{t.porcentajeMora}}%</strong>
            </div>
            <div class="meta-item">
              <span class="meta-label">Gracia</span>
              <strong>{{t.diasGracia}} dias</strong>
            </div>
          </div>
          <mat-divider></mat-divider>
          <table mat-table [dataSource]="t.rangos" class="rangos-table" *ngIf="t.rangos?.length">
            <ng-container matColumnDef="rangoDesde">
              <th mat-header-cell *matHeaderCellDef>Desde m3</th>
              <td mat-cell *matCellDef="let r">{{r.rangoDesde}}</td>
            </ng-container>
            <ng-container matColumnDef="rangoHasta">
              <th mat-header-cell *matHeaderCellDef>Hasta m3</th>
              <td mat-cell *matCellDef="let r">{{r.rangoHasta}}</td>
            </ng-container>
            <ng-container matColumnDef="precioPorM3">
              <th mat-header-cell *matHeaderCellDef>Precio por m3</th>
              <td mat-cell *matCellDef="let r">{{r.precioPorM3}}</td>
            </ng-container>
            <tr mat-header-row *matHeaderRowDef="rangoCols"></tr>
            <tr mat-row *matRowDef="let row; columns: rangoCols;"></tr>
          </table>
          <p *ngIf="!t.rangos?.length" class="no-rangos">Sin rangos definidos</p>
        </mat-card-content>
        <mat-card-actions align="end">
          <button mat-button [routerLink]="[t.id, 'editar']" color="primary">
            <mat-icon>edit</mat-icon> Editar
          </button>
          <button mat-button color="warn" (click)="eliminar(t)">
            <mat-icon>delete</mat-icon> Desactivar
          </button>
        </mat-card-actions>
      </mat-card>
    </div>

    <mat-card *ngIf="!cargando && tarifas.length === 0" class="empty-card">
      <mat-card-content>
        <div class="empty-state">
          <mat-icon>price_change</mat-icon>
          <p>No hay tarifas configuradas</p>
          <small>Cree una nueva tarifa para comenzar</small>
        </div>
      </mat-card-content>
    </mat-card>
  `,
  styles: [`
    .page-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 24px; }
    .page-header h2 { margin: 0; }
    .spinner-container { display: flex; flex-direction: column; align-items: center; justify-content: center; padding: 48px 24px; gap: 16px; }
    .spinner-container p { color: #78909c; font-size: 14px; }
    .tarifas-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(350px, 1fr)); gap: 16px; }
    .tarifa-card { border-left: 4px solid #0078a9; transition: transform 200ms ease, box-shadow 200ms ease; }
    .tarifa-card:hover { transform: translateY(-2px); box-shadow: 0 8px 24px rgba(0,0,0,0.12); }
    mat-card-title { margin-bottom: 4px; }
    mat-card-subtitle { color: #90a4ae; }
    .tarifa-meta { display: flex; gap: 16px; padding-bottom: 12px; }
    .meta-item { display: flex; flex-direction: column; }
    .meta-label { font-size: 11px; color: #90a4ae; font-weight: 500; text-transform: uppercase; letter-spacing: 0.4px; }
    .rangos-table { width: 100%; margin-top: 8px; }
    .no-rangos { color: #90a4ae; font-style: italic; font-size: 13px; margin: 8px 0 0; }
    .empty-state { display: flex; flex-direction: column; align-items: center; justify-content: center; padding: 48px 24px; color: #90a4ae; }
    .empty-state mat-icon { font-size: 56px; width: 56px; height: 56px; margin-bottom: 16px; opacity: 0.4; }
    .empty-state p { margin: 0; font-size: 16px; font-weight: 500; }
    .empty-state small { font-size: 12px; margin-top: 4px; }
    @media (max-width: 768px) { .tarifas-grid { grid-template-columns: 1fr; } }
  `]
})
export class TarifasListComponent implements OnInit {
  tarifas: Tarifa[] = [];
  cargando = false;
  rangoCols = ['rangoDesde', 'rangoHasta', 'precioPorM3'];

  constructor(private tarifaService: TarifaService, private snack: MatSnackBar) {}

  ngOnInit(): void { this.cargarTarifas(); }

  cargarTarifas(): void {
    this.cargando = true;
    this.tarifaService.listar().subscribe({
      next: (data) => { this.tarifas = data; this.cargando = false; },
      error: () => { this.cargando = false; }
    });
  }

  eliminar(t: Tarifa): void {
    if (confirm('Desactivar esta tarifa?')) {
      this.tarifaService.eliminar(t.id).subscribe({
        next: () => {
          this.snack.open('Tarifa desactivada', 'OK', { duration: 3000 });
          this.cargarTarifas();
        }
      });
    }
  }
}
