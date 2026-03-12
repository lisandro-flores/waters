import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { FacturacionListComponent } from './list/facturacion-list.component';

@NgModule({
  declarations: [FacturacionListComponent],
  imports: [
    CommonModule,
    FormsModule,
    RouterModule.forChild([{ path: '', component: FacturacionListComponent }])
  ]
})
export class FacturacionModule {}
