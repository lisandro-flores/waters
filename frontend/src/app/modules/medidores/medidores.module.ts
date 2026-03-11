import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatChipsModule } from '@angular/material/chips';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

import { MedidoresListComponent } from './list/medidores-list.component';
import { MedidorFormComponent } from './form/medidor-form.component';

const routes: Routes = [
  { path: '', component: MedidoresListComponent },
  { path: 'nuevo', component: MedidorFormComponent },
  { path: ':id/editar', component: MedidorFormComponent }
];

@NgModule({
  declarations: [MedidoresListComponent, MedidorFormComponent],
  imports: [
    CommonModule, ReactiveFormsModule,
    RouterModule.forChild(routes),
    MatTableModule, MatButtonModule, MatIconModule, MatCardModule,
    MatFormFieldModule, MatInputModule, MatSelectModule, MatChipsModule, MatTooltipModule, MatSnackBarModule,
    MatProgressSpinnerModule
  ]
})
export class MedidoresModule {}
