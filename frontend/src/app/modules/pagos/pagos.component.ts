import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { PagoService } from '../../core/services/pago.service';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-pagos',
  template: `
    <h2>Registro de Pagos</h2>

    <!-- Búsqueda de factura pending -->
    <mat-card style="max-width:560px; margin-bottom:24px">
      <mat-card-header>
        <mat-card-title>Registrar Pago</mat-card-title>
      </mat-card-header>
      <mat-card-content>
        <form [formGroup]="form" (ngSubmit)="pagar()">
          <mat-form-field appearance="outline" class="full-width">
            <mat-label>ID de Factura</mat-label>
            <input matInput type="number" formControlName="facturaId" />
            <!-- TODO: búsqueda por número de factura o cuenta -->
          </mat-form-field>

          <mat-form-field appearance="outline" class="full-width">
            <mat-label>Monto a pagar ($)</mat-label>
            <input matInput type="number" formControlName="monto" step="0.01" />
          </mat-form-field>

          <mat-form-field appearance="outline" class="full-width">
            <mat-label>Método de Pago</mat-label>
            <mat-select formControlName="metodoPago">
              <mat-option value="EFECTIVO">Efectivo</mat-option>
              <mat-option value="TRANSFERENCIA">Transferencia Bancaria</mat-option>
              <mat-option value="DEPOSITO_BANCARIO">Depósito Bancario</mat-option>
              <mat-option value="TARJETA_DEBITO">Tarjeta Débito</mat-option>
              <mat-option value="TARJETA_CREDITO">Tarjeta Crédito</mat-option>
              <mat-option value="PAGO_MOVIL">Pago Móvil</mat-option>
            </mat-select>
          </mat-form-field>

          <mat-form-field appearance="outline" class="full-width">
            <mat-label>Número de Referencia / Recibo</mat-label>
            <input matInput formControlName="referencia" />
          </mat-form-field>

          <button mat-raised-button color="primary" type="submit"
                  [disabled]="form.invalid || guardando" class="full-width">
            <mat-icon>payments</mat-icon>
            {{ guardando ? 'Registrando...' : 'Registrar Pago' }}
          </button>
        </form>
      </mat-card-content>
    </mat-card>
  `,
  styles: [`.full-width { width: 100%; margin-bottom: 12px; }`]
})
export class PagosComponent implements OnInit {
  form!: FormGroup;
  guardando = false;

  constructor(
    private fb: FormBuilder,
    private service: PagoService,
    private snack: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.form = this.fb.group({
      facturaId:   [null, Validators.required],
      monto:       [null, [Validators.required, Validators.min(0.01)]],
      metodoPago:  ['EFECTIVO', Validators.required],
      referencia:  ['']
    });
  }

  pagar(): void {
    this.guardando = true;
    this.service.registrar(this.form.value).subscribe({
      next: () => {
        this.snack.open('Pago registrado correctamente', 'OK', { duration: 3000 });
        this.form.reset({ metodoPago: 'EFECTIVO' });
        this.guardando = false;
      },
      error: () => { this.guardando = false; }
    });
  }
}
