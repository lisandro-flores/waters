import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { MedidorService } from '../../../core/services/medidor.service';
import { MatSnackBar } from '@angular/material/snack-bar';

/** Formulario para crear/editar un medidor */
@Component({
  selector: 'app-medidor-form',
  template: `
    <div class="page-header">
      <h2>{{ isEdit ? 'Editar' : 'Nuevo' }} Medidor</h2>
      <button mat-button routerLink="/medidores"><mat-icon>arrow_back</mat-icon> Volver</button>
    </div>
    <mat-card>
      <mat-card-content>
        <form [formGroup]="form" (ngSubmit)="guardar()">
          <div class="form-grid">
            <mat-form-field appearance="outline">
              <mat-label>Número de Serie</mat-label>
              <input matInput formControlName="numeroSerie" />
            </mat-form-field>
            <mat-form-field appearance="outline">
              <mat-label>Marca</mat-label>
              <input matInput formControlName="marca" />
            </mat-form-field>
            <mat-form-field appearance="outline">
              <mat-label>Diámetro</mat-label>
              <mat-select formControlName="diametro">
                <mat-option value='1/2"'>1/2"</mat-option>
                <mat-option value='3/4"'>3/4"</mat-option>
                <mat-option value='1"'>1"</mat-option>
                <mat-option value='2"'>2"</mat-option>
              </mat-select>
            </mat-form-field>
            <mat-form-field appearance="outline">
              <mat-label>Lectura Inicial (m³)</mat-label>
              <input matInput type="number" formControlName="lecturaInicial" />
            </mat-form-field>
            <mat-form-field appearance="outline">
              <mat-label>Estado</mat-label>
              <mat-select formControlName="estado">
                <mat-option value="ACTIVO">Activo</mat-option>
                <mat-option value="SUSPENDIDO">Suspendido</mat-option>
                <mat-option value="EN_REPARACION">En Reparación</mat-option>
                <mat-option value="RETIRADO">Retirado</mat-option>
              </mat-select>
            </mat-form-field>
            <mat-form-field appearance="outline">
              <mat-label>Suscriptor ID</mat-label>
              <input matInput type="number" formControlName="suscriptorId" />
              <!-- TODO: reemplazar con selector de suscriptor con autocompletar -->
            </mat-form-field>
          </div>
          <div class="form-actions">
            <button mat-button type="button" routerLink="/medidores">Cancelar</button>
            <button mat-raised-button color="primary" type="submit" [disabled]="form.invalid">
              <mat-icon>save</mat-icon> Guardar
            </button>
          </div>
        </form>
      </mat-card-content>
    </mat-card>
  `,
  styles: [`.page-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 24px; }
            .page-header h2 { margin: 0; }
            .form-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 0 16px; }
            .form-actions { display: flex; justify-content: flex-end; gap: 12px; margin-top: 16px; }`]
})
export class MedidorFormComponent implements OnInit {
  form!: FormGroup;
  isEdit = false;

  constructor(
    private fb: FormBuilder,
    private service: MedidorService,
    private route: ActivatedRoute,
    private router: Router,
    private snack: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.form = this.fb.group({
      numeroSerie:    ['', Validators.required],
      marca:          [''],
      diametro:       ['1/2"'],
      lecturaInicial: [0, Validators.min(0)],
      estado:         ['ACTIVO'],
      suscriptorId:   [null, Validators.required]
    });
    const id = this.route.snapshot.params['id'];
    if (id) {
      this.isEdit = true;
      this.service.getById(+id).subscribe(m => this.form.patchValue(m));
    }
  }

  guardar(): void {
    const obs = this.isEdit
      ? this.service.actualizar(+this.route.snapshot.params['id'], this.form.value)
      : this.service.crear(this.form.value);
    obs.subscribe({
      next: () => {
        this.snack.open('Medidor guardado', 'OK', { duration: 3000 });
        this.router.navigate(['/medidores']);
      }
    });
  }
}
