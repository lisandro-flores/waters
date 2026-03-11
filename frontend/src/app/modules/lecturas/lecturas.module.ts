import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatTableModule } from '@angular/material/table';
import { MatSelectModule } from '@angular/material/select';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

import { LecturasListComponent } from './list/lecturas-list.component';
import { LecturaFormComponent } from './form/lectura-form.component';

const routes: Routes = [
  { path: '', component: LecturasListComponent },
  { path: 'nueva', component: LecturaFormComponent }
];

@NgModule({
  declarations: [LecturasListComponent, LecturaFormComponent],
  imports: [
    CommonModule, ReactiveFormsModule,
    RouterModule.forChild(routes),
    MatCardModule, MatButtonModule, MatIconModule,
    MatFormFieldModule, MatInputModule, MatTableModule, MatSelectModule,
    MatProgressSpinnerModule
  ]
})
export class LecturasModule {}
