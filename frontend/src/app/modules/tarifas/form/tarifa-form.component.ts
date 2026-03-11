import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { TarifaService } from '../../../core/services/tarifa.service';
import { MatSnackBar } from '@angular/material/snack-bar';

/**
 * Formulario de tarifa con sistema escalonado de rangos dinámicos.
 * Los rangos se agregan/eliminan mediante FormArray.
 */
@Component({
  selector: 'app-tarifa-form',
  template: `
    <div class="page-header">
      <h2>Nueva Tarifa</h2>
      <button mat-button routerLink="/tarifas"><mat-icon>arrow_back</mat-icon> Volver</button>
    </div>
    <mat-card>
      <mat-card-content>
        <form [formGroup]="form" (ngSubmit)="guardar()">
          <div class="form-grid">
            <mat-form-field appearance="outline" class="span-2">
              <mat-label>Nombre de la Tarifa</mat-label>
              <input matInput formControlName="nombre" />
            </mat-form-field>
            <mat-form-field appearance="outline">
              <mat-label>Tipo de Suscriptor</mat-label>
              <mat-select formControlName="tipoSuscriptor">
                <mat-option value="DOMICILIAR">Domiciliar</mat-option>
                <mat-option value="COMERCIAL">Comercial</mat-option>
                <mat-option value="INDUSTRIAL">Industrial</mat-option>
                <mat-option value="INSTITUCIONAL">Institucional</mat-option>
              </mat-select>
            </mat-form-field>
            <mat-form-field appearance="outline">
              <mat-label>Cuota Fija Mensual ($)</mat-label>
              <input matInput type="number" formControlName="cuotaFija" step="0.01" />
            </mat-form-field>
            <mat-form-field appearance="outline">
              <mat-label>Porcentaje de Mora (%)</mat-label>
              <input matInput type="number" formControlName="porcentajeMora" step="0.01" />
            </mat-form-field>
            <mat-form-field appearance="outline">
              <mat-label>Días de Gracia</mat-label>
              <input matInput type="number" formControlName="diasGracia" />
            </mat-form-field>
            <mat-form-field appearance="outline">
              <mat-label>Vigencia Desde</mat-label>
              <input matInput type="date" formControlName="vigenciaDesde" />
            </mat-form-field>
            <mat-form-field appearance="outline">
              <mat-label>Vigencia Hasta (vacío = indefinida)</mat-label>
              <input matInput type="date" formControlName="vigenciaHasta" />
            </mat-form-field>
          </div>

          <mat-divider class="my-divider"></mat-divider>
          <h3>Rangos de Consumo (Tarifa Escalonada)</h3>

          <div formArrayName="rangos">
            <div *ngFor="let rango of rangos.controls; let i = index"
                 [formGroupName]="i" class="rango-row">
              <mat-form-field appearance="outline">
                <mat-label>Desde m³</mat-label>
                <input matInput type="number" formControlName="rangoDesde" />
              </mat-form-field>
              <mat-form-field appearance="outline">
                <mat-label>Hasta m³ (vacío = sin límite)</mat-label>
                <input matInput type="number" formControlName="rangoHasta" />
              </mat-form-field>
              <mat-form-field appearance="outline">
                <mat-label>$/m³</mat-label>
                <input matInput type="number" formControlName="precioPorM3" step="0.0001" />
              </mat-form-field>
              <button mat-icon-button color="warn" type="button"
                      (click)="eliminarRango(i)" matTooltip="Eliminar rango">
                <mat-icon>delete</mat-icon>
              </button>
            </div>
          </div>
          <button mat-stroked-button color="primary" type="button" (click)="agregarRango()">
            <mat-icon>add</mat-icon> Agregar Rango
          </button>

          <div class="form-actions">
            <button mat-button type="button" routerLink="/tarifas">Cancelar</button>
            <button mat-raised-button color="primary" type="submit" [disabled]="form.invalid">
              <mat-icon>save</mat-icon> Guardar Tarifa
            </button>
          </div>
        </form>
      </mat-card-content>
    </mat-card>
  `,
  styles: [`
    .page-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 24px; }
    .page-header h2 { margin: 0; }
    .form-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 0 16px; }
    .span-2 { grid-column: span 2; }
    .my-divider { margin: 16px 0; }
    .rango-row { display: flex; gap: 12px; align-items: center; margin-bottom: 0; }
    .form-actions { display: flex; justify-content: flex-end; gap: 12px; margin-top: 24px; }
  `]
})
export class TarifaFormComponent implements OnInit {
  form!: FormGroup;
  editando = false;
  tarifaId?: number;

  get rangos(): FormArray { return this.form.get('rangos') as FormArray; }

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private route: ActivatedRoute,
    private tarifaService: TarifaService,
    private snack: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.form = this.fb.group({
      nombre:           ['', Validators.required],
      tipoSuscriptor:   ['DOMICILIAR', Validators.required],
      cuotaFija:        [0, [Validators.required, Validators.min(0)]],
      porcentajeMora:   [2, [Validators.required, Validators.min(0)]],
      diasGracia:       [15, [Validators.required, Validators.min(0)]],
      vigenciaDesde:    [''],
      vigenciaHasta:    [''],
      rangos:           this.fb.array([])
    });

    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.editando = true;
      this.tarifaId = +id;
      this.tarifaService.getById(this.tarifaId).subscribe(tarifa => {
        this.form.patchValue(tarifa);
        tarifa.rangos?.forEach(r => {
          this.rangos.push(this.fb.group({
            rangoDesde: [r.rangoDesde, Validators.required],
            rangoHasta: [r.rangoHasta],
            precioPorM3: [r.precioPorM3, [Validators.required, Validators.min(0)]]
          }));
        });
      });
    } else {
      this.agregarRango();
    }
  }

  agregarRango(): void {
    this.rangos.push(this.fb.group({
      rangoDesde:   [this.rangos.length === 0 ? 0 : null, Validators.required],
      rangoHasta:   [null],
      precioPorM3:  [null, [Validators.required, Validators.min(0)]]
    }));
  }

  eliminarRango(i: number): void {
    this.rangos.removeAt(i);
  }

  guardar(): void {
    const data = this.form.value;
    const op = this.editando
      ? this.tarifaService.actualizar(this.tarifaId!, data)
      : this.tarifaService.crear(data);

    op.subscribe({
      next: () => {
        this.snack.open(this.editando ? 'Tarifa actualizada' : 'Tarifa creada', 'OK', { duration: 3000 });
        this.router.navigate(['/tarifas']);
      },
      error: () => {
        this.snack.open('Error al guardar la tarifa', 'Cerrar', { duration: 4000 });
      }
    });
  }
}
