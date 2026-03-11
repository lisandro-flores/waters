import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { LecturaService } from '../../../core/services/lectura.service';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-lectura-form',
  template: `
    <div class="page-header">
      <h2>Registrar Lectura</h2>
      <button mat-button routerLink="/lecturas"><mat-icon>arrow_back</mat-icon> Volver</button>
    </div>
    <mat-card>
      <mat-card-content>
        <form [formGroup]="form" (ngSubmit)="guardar()">
          <div class="form-grid">
            <mat-form-field appearance="outline">
              <mat-label>ID de Medidor</mat-label>
              <input matInput type="number" formControlName="medidorId" />
              <!-- TODO: reemplazar con buscador por número de serie -->
            </mat-form-field>
            <mat-form-field appearance="outline">
              <mat-label>Lectura Anterior (m³)</mat-label>
              <input matInput type="number" formControlName="lecturaAnterior" />
            </mat-form-field>
            <mat-form-field appearance="outline">
              <mat-label>Lectura Actual (m³)</mat-label>
              <input matInput type="number" formControlName="lecturaActual" />
            </mat-form-field>
            <mat-form-field appearance="outline">
              <mat-label>Fecha de Lectura</mat-label>
              <input matInput type="date" formControlName="fechaLectura" />
            </mat-form-field>
            <mat-form-field appearance="outline" class="span-2">
              <mat-label>Observaciones</mat-label>
              <textarea matInput formControlName="observaciones" rows="3"></textarea>
            </mat-form-field>
          </div>

          <!-- Consumo calculado en tiempo real -->
          <div class="consumo-preview" *ngIf="consumoCalculado >= 0">
            Consumo calculado: <strong>{{ consumoCalculado | number:'1.1-1' }} m³</strong>
          </div>

          <div class="form-actions">
            <button mat-button type="button" routerLink="/lecturas">Cancelar</button>
            <button mat-raised-button color="primary" type="submit" [disabled]="form.invalid">
              <mat-icon>save</mat-icon> Registrar
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
    .consumo-preview { background: #e3f2fd; padding: 12px 16px; border-radius: 6px; margin-bottom: 16px; }
    .form-actions { display: flex; justify-content: flex-end; gap: 12px; margin-top: 8px; }
  `]
})
export class LecturaFormComponent implements OnInit {
  form!: FormGroup;

  get consumoCalculado(): number {
    const actual = this.form?.get('lecturaActual')?.value || 0;
    const anterior = this.form?.get('lecturaAnterior')?.value || 0;
    return actual - anterior;
  }

  constructor(
    private fb: FormBuilder,
    private service: LecturaService,
    private router: Router,
    private snack: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.form = this.fb.group({
      medidorId:      [null, Validators.required],
      lecturaAnterior:[0, [Validators.required, Validators.min(0)]],
      lecturaActual:  [null, [Validators.required, Validators.min(0)]],
      fechaLectura:   [new Date().toISOString().split('T')[0], Validators.required],
      observaciones:  ['']
    });
  }

  guardar(): void {
    const val = this.form.value;
    const payload = { ...val, consumoM3: this.consumoCalculado };
    this.service.registrar(payload).subscribe({
      next: () => {
        this.snack.open('Lectura registrada correctamente', 'OK', { duration: 3000 });
        this.router.navigate(['/lecturas']);
      }
    });
  }
}
