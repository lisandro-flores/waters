import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { ComunidadesComponent } from './comunidades.component';

@NgModule({
  declarations: [ComunidadesComponent],
  imports: [
    CommonModule,
    FormsModule,
    RouterModule.forChild([{ path: '', component: ComunidadesComponent }])
  ]
})
export class ComunidadesModule {}
