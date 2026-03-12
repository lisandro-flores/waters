import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { PagosComponent } from './pagos.component';

@NgModule({
  declarations: [PagosComponent],
  imports: [
    CommonModule,
    FormsModule,
    RouterModule.forChild([{ path: '', component: PagosComponent }])
  ]
})
export class PagosModule {}
