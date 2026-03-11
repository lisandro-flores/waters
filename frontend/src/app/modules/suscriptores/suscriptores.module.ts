import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { MatChipsModule } from '@angular/material/chips';
import { MatDialogModule } from '@angular/material/dialog';
import { MatSelectModule } from '@angular/material/select';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatListModule } from '@angular/material/list';
import { MatDividerModule } from '@angular/material/divider';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

import { SuscriptoresListComponent } from './list/suscriptores-list.component';
import { SuscriptorFormComponent } from './form/suscriptor-form.component';
import { SuscriptorDetalleComponent } from './detalle/suscriptor-detalle.component';

const routes: Routes = [
  { path: '', component: SuscriptoresListComponent },
  { path: 'nuevo', component: SuscriptorFormComponent },
  { path: ':id', component: SuscriptorDetalleComponent },
  { path: ':id/editar', component: SuscriptorFormComponent }
];

@NgModule({
  declarations: [
    SuscriptoresListComponent,
    SuscriptorFormComponent,
    SuscriptorDetalleComponent
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterModule.forChild(routes),
    MatTableModule, MatPaginatorModule, MatInputModule,
    MatButtonModule, MatIconModule, MatCardModule,
    MatChipsModule, MatDialogModule, MatSelectModule,
    MatTooltipModule, MatListModule, MatDividerModule,
    MatProgressSpinnerModule
  ]
})
export class SuscriptoresModule {}
