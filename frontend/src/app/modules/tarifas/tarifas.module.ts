import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { TarifasListComponent } from './list/tarifas-list.component';

@NgModule({
  declarations: [TarifasListComponent],
  imports: [
    CommonModule,
    FormsModule,
    RouterModule.forChild([{ path: '', component: TarifasListComponent }])
  ]
})
export class TarifasModule {}
