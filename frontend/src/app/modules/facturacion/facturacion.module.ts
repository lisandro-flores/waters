import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTableModule } from '@angular/material/table';
import { MatChipsModule } from '@angular/material/chips';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatDialogModule } from '@angular/material/dialog';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { ReactiveFormsModule } from '@angular/forms';

import { FacturacionListComponent } from './list/facturacion-list.component';
import { GenerarMasivoComponent } from './generar-masivo/generar-masivo.component';

const routes: Routes = [
  { path: '', component: FacturacionListComponent },
  { path: 'generar-masivo', component: GenerarMasivoComponent }
];

@NgModule({
  declarations: [FacturacionListComponent, GenerarMasivoComponent],
  imports: [
    CommonModule, ReactiveFormsModule,
    RouterModule.forChild(routes),
    MatCardModule, MatButtonModule, MatIconModule, MatTableModule,
    MatChipsModule, MatPaginatorModule, MatFormFieldModule, MatInputModule, MatDialogModule,
    MatProgressSpinnerModule
  ]
})
export class FacturacionModule {}
