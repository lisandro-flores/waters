import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';
import { MedidoresListComponent } from './list/medidores-list.component';

const routes: Routes = [{ path: '', component: MedidoresListComponent }];

@NgModule({
  declarations: [MedidoresListComponent],
  imports: [CommonModule, FormsModule, RouterModule.forChild(routes)]
})
export class MedidoresModule {}
