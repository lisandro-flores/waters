import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';
import { LecturasListComponent } from './list/lecturas-list.component';

const routes: Routes = [{ path: '', component: LecturasListComponent }];

@NgModule({
  declarations: [LecturasListComponent],
  imports: [CommonModule, FormsModule, RouterModule.forChild(routes)]
})
export class LecturasModule {}
