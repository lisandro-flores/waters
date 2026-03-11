import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTableModule } from '@angular/material/table';
import { MatTabsModule } from '@angular/material/tabs';

import { ReportesComponent } from './reportes.component';

const routes: Routes = [
  { path: '', component: ReportesComponent }
];

@NgModule({
  declarations: [ReportesComponent],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    MatCardModule, MatButtonModule, MatIconModule, MatTableModule, MatTabsModule
  ]
})
export class ReportesModule {}
