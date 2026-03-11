import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../../core/auth/auth.service';
import { ComunidadService } from '../../core/services/comunidad.service';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-configuracion',
  template: `
    <h2>Configuración</h2>
    <mat-tab-group>
      <!-- Datos de la comunidad -->
      <mat-tab label="Datos de la Comunidad">
        <div class="tab-content">
          <mat-card style="max-width:640px">
            <mat-card-header>
              <mat-card-title>{{ comunidadNombre }}</mat-card-title>
            </mat-card-header>
            <mat-card-content>
              <form [formGroup]="comunidadForm" (ngSubmit)="guardarComunidad()">
                <div class="form-grid">
                  <mat-form-field appearance="outline" class="span-2">
                    <mat-label>Nombre de la Junta/Comunidad</mat-label>
                    <input matInput formControlName="nombre" />
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
                    <mat-label>Email</mat-label>
                    <input matInput type="email" formControlName="email" />
                  </mat-form-field>
                  <mat-form-field appearance="outline">
                    <mat-label>RUC / NIT</mat-label>
                    <input matInput formControlName="ruc" />
                  </mat-form-field>
                </div>
                <div class="form-actions">
                  <button mat-raised-button color="primary" type="submit">
                    <mat-icon>save</mat-icon> Guardar Cambios
                  </button>
                </div>
              </form>
            </mat-card-content>
          </mat-card>
        </div>
      </mat-tab>

      <!-- Usuarios -->
      <mat-tab label="Usuarios del Sistema">
        <div class="tab-content">
          <p style="color:#999">
            <!-- TODO: Gestión de usuarios de la comunidad (crear, editar, activar/desactivar) -->
            Módulo de gestión de usuarios del sistema pendiente de implementación.
          </p>
        </div>
      </mat-tab>

      <!-- Numeración de documentos -->
      <mat-tab label="Numeración">
        <div class="tab-content">
          <mat-card style="max-width:400px">
            <mat-card-content>
              <p>Configure la numeración de facturas y otros documentos del sistema.</p>
              <!-- TODO: secuencias de numeración por comunidad -->
            </mat-card-content>
          </mat-card>
        </div>
      </mat-tab>
    </mat-tab-group>
  `,
  styles: [`
    .tab-content { padding: 24px 0; }
    .form-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 0 16px; }
    .span-2 { grid-column: span 2; }
    .form-actions { display: flex; justify-content: flex-end; gap: 12px; margin-top: 8px; }
  `]
})
export class ConfiguracionComponent implements OnInit {
  comunidadForm!: FormGroup;
  comunidadNombre = '';

  comunidadId?: number;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private comunidadService: ComunidadService,
    private snack: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.comunidadNombre = this.authService.getCurrentUser()?.comunidadNombre || '';
    this.comunidadForm = this.fb.group({
      nombre:    [this.comunidadNombre, Validators.required],
      direccion: [''],
      telefono:  [''],
      email:     ['', Validators.email],
      ruc:       ['']
    });

    // Load actual community data from backend
    this.comunidadService.getMiComunidad().subscribe({
      next: (c) => {
        this.comunidadId = c.id;
        this.comunidadForm.patchValue({
          nombre: c.nombre,
          direccion: c.direccion || '',
          telefono: c.telefono || '',
          email: c.email || ''
        });
        this.comunidadNombre = c.nombre;
      }
    });
  }

  guardarComunidad(): void {
    if (!this.comunidadId) return;
    this.comunidadService.actualizar(this.comunidadId, this.comunidadForm.value).subscribe({
      next: () => {
        this.snack.open('Configuración guardada', 'OK', { duration: 3000 });
      },
      error: () => {
        this.snack.open('Error al guardar', 'Cerrar', { duration: 4000 });
      }
    });
  }
}
