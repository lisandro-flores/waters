import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { SuscriptorService } from '../../../core/services/suscriptor.service';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-suscriptor-form',
  template: `
    <div class="page-header">
      <h2>{{ isEdit ? 'Editar' : 'Nuevo' }} Suscriptor</h2>
      <button mat-button routerLink="/suscriptores">
        <mat-icon>arrow_back</mat-icon> Volver
      </button>
    </div>

    <mat-card>
      <mat-card-content>
        <form [formGroup]="form" (ngSubmit)="guardar()">
          <div class="form-grid">
            <mat-form-field appearance="outline">
              <mat-label>Número de Cuenta</mat-label>
              <input matInput formControlName="numeroCuenta" />
            </mat-form-field>

            <mat-form-field appearance="outline">
              <mat-label>Identificación (DUI/Cédula)</mat-label>
              <input matInput formControlName="identificacion" />
            </mat-form-field>

            <mat-form-field appearance="outline">
              <mat-label>Nombre</mat-label>
              <input matInput formControlName="nombre" />
            </mat-form-field>

            <mat-form-field appearance="outline">
              <mat-label>Apellido</mat-label>
              <input matInput formControlName="apellido" />
            </mat-form-field>

            <mat-form-field appearance="outline" class="span-2">
              <mat-label>Dirección</mat-label>
              <input matInput formControlName="direccion" />
            </mat-form-field>

            <mat-form-field appearance="outline">
              <mat-label>Teléfono</mat-label>
              <input matInput formControlName="telefono" />
            </mat-form-field>

            <mat-form-field appearance="outline">
              <mat-label>Correo electrónico</mat-label>
              <input matInput type="email" formControlName="email" />
            </mat-form-field>

            <mat-form-field appearance="outline">
              <mat-label>Tipo de Suscriptor</mat-label>
              <mat-select formControlName="tipo">
                <mat-option value="DOMICILIAR">Domiciliar</mat-option>
                <mat-option value="COMERCIAL">Comercial</mat-option>
                <mat-option value="INDUSTRIAL">Industrial</mat-option>
                <mat-option value="INSTITUCIONAL">Institucional</mat-option>
              </mat-select>
            </mat-form-field>

            <mat-form-field appearance="outline">
              <mat-label>Estado</mat-label>
              <mat-select formControlName="estado">
                <mat-option value="ACTIVO">Activo</mat-option>
                <mat-option value="SUSPENDIDO">Suspendido</mat-option>
                <mat-option value="CORTADO">Cortado</mat-option>
                <mat-option value="RETIRADO">Retirado</mat-option>
              </mat-select>
            </mat-form-field>
          </div>

          <div class="form-actions">
            <button mat-button type="button" routerLink="/suscriptores">Cancelar</button>
            <button mat-raised-button color="primary" type="submit"
                    [disabled]="form.invalid || saving">
              <mat-icon>save</mat-icon> {{ saving ? 'Guardando...' : 'Guardar' }}
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
    .form-actions { display: flex; justify-content: flex-end; gap: 12px; margin-top: 16px; }
    @media (max-width: 600px) { .form-grid { grid-template-columns: 1fr; } .span-2 { grid-column: 1; } }
  `]
})
export class SuscriptorFormComponent implements OnInit {
  form!: FormGroup;
  isEdit = false;
  saving = false;
  suscriptorId?: number;

  constructor(
    private fb: FormBuilder,
    private service: SuscriptorService,
    private route: ActivatedRoute,
    private router: Router,
    private snack: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.form = this.fb.group({
      numeroCuenta:   ['', Validators.required],
      nombre:         ['', Validators.required],
      apellido:       ['', Validators.required],
      identificacion: [''],
      direccion:      [''],
      telefono:       [''],
      email:          ['', Validators.email],
      tipo:           ['DOMICILIAR', Validators.required],
      estado:         ['ACTIVO', Validators.required]
    });

    this.suscriptorId = this.route.snapshot.params['id'];
    if (this.suscriptorId) {
      this.isEdit = true;
      this.service.getById(this.suscriptorId).subscribe(s => this.form.patchValue(s));
    }
  }

  guardar(): void {
    if (this.form.invalid) return;
    this.saving = true;
    const obs = this.isEdit
      ? this.service.actualizar(this.suscriptorId!, this.form.value)
      : this.service.crear(this.form.value);

    obs.subscribe({
      next: () => {
        this.snack.open('Suscriptor guardado correctamente', 'OK', { duration: 3000 });
        this.router.navigate(['/suscriptores']);
      },
      error: () => { this.saving = false; }
    });
  }
}
