import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { FacturaService } from '../../../core/services/factura.service';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-generar-masivo',
  template: `
    <div class="page-header">
      <h2>Generar Facturas Masivo</h2>
      <button mat-button routerLink="/facturacion"><mat-icon>arrow_back</mat-icon> Volver</button>
    </div>
    <mat-card style="max-width:480px">
      <mat-card-content>
        <p>Seleccione el período a facturar. Se generarán facturas para todas las lecturas
           registradas en ese período que aún no tengan factura.</p>
        <form [formGroup]="form" (ngSubmit)="generar()">
          <mat-form-field appearance="outline" class="full-width">
            <mat-label>Año</mat-label>
            <input matInput type="number" formControlName="anio" />
          </mat-form-field>
          <mat-form-field appearance="outline" class="full-width">
            <mat-label>Mes (1-12)</mat-label>
            <input matInput type="number" formControlName="mes" min="1" max="12" />
          </mat-form-field>
          <button mat-raised-button color="primary" type="submit"
                  [disabled]="form.invalid || procesando" class="full-width">
            <mat-icon>play_arrow</mat-icon>
            {{ procesando ? 'Procesando...' : 'Generar Facturas' }}
          </button>
        </form>
      </mat-card-content>
    </mat-card>
  `,
  styles: [`.page-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 24px; }
            .page-header h2 { margin: 0; }
            .full-width { width: 100%; margin-bottom: 12px; }`]
})
export class GenerarMasivoComponent implements OnInit {
  form!: FormGroup;
  procesando = false;

  constructor(
    private fb: FormBuilder,
    private service: FacturaService,
    private router: Router,
    private snack: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.form = this.fb.group({
      anio: [new Date().getFullYear(), [Validators.required, Validators.min(2000)]],
      mes:  [new Date().getMonth() + 1, [Validators.required, Validators.min(1), Validators.max(12)]]
    });
  }

  generar(): void {
    this.procesando = true;
    const { anio, mes } = this.form.value;
    this.service.generarMasivo(anio, mes).subscribe({
      next: (res) => {
        this.snack.open(`${res.facturasGeneradas} facturas generadas para ${anio}/${mes}`, 'OK', { duration: 4000 });
        this.router.navigate(['/facturacion']);
      },
      error: () => { this.procesando = false; }
    });
  }
}
