import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { AlertasComponent } from './alertas.component';

@NgModule({
  declarations: [AlertasComponent],
  imports: [
    CommonModule,
    FormsModule,
    RouterModule.forChild([{ path: '', component: AlertasComponent }])
  ]
})
export class AlertasModule {}
