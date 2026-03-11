import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTableModule } from '@angular/material/table';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatDividerModule } from '@angular/material/divider';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

import { TarifasListComponent } from './list/tarifas-list.component';
import { TarifaFormComponent } from './form/tarifa-form.component';

const routes: Routes = [
  { path: '', component: TarifasListComponent },
  { path: 'nueva', component: TarifaFormComponent },
  { path: ':id/editar', component: TarifaFormComponent }
];

@NgModule({
  declarations: [TarifasListComponent, TarifaFormComponent],
  imports: [
    CommonModule, ReactiveFormsModule,
    RouterModule.forChild(routes),
    MatCardModule, MatButtonModule, MatIconModule, MatTableModule,
    MatFormFieldModule, MatInputModule, MatSelectModule, MatDividerModule, MatSnackBarModule,
    MatProgressSpinnerModule
  ]
})
export class TarifasModule {}
