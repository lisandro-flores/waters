import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { RoleGuard } from '../../core/guards/role.guard';

import { LayoutComponent } from './layout.component';

const routes: Routes = [
  {
    path: '',
    component: LayoutComponent,
    children: [
      {
        path: 'dashboard',
        loadChildren: () => import('../dashboard/dashboard.module').then(m => m.DashboardModule)
      },
      {
        path: 'suscriptores',
        loadChildren: () => import('../suscriptores/suscriptores.module').then(m => m.SuscriptoresModule)
      },
      {
        path: 'medidores',
        loadChildren: () => import('../medidores/medidores.module').then(m => m.MedidoresModule)
      },
      {
        path: 'lecturas',
        loadChildren: () => import('../lecturas/lecturas.module').then(m => m.LecturasModule)
      },
      {
        path: 'facturacion',
        canActivate: [RoleGuard],
        data: { roles: ['ADMIN', 'CAJERO', 'SUPER_ADMIN'] },
        loadChildren: () => import('../facturacion/facturacion.module').then(m => m.FacturacionModule)
      },
      {
        path: 'pagos',
        canActivate: [RoleGuard],
        data: { roles: ['ADMIN', 'CAJERO', 'SUPER_ADMIN'] },
        loadChildren: () => import('../pagos/pagos.module').then(m => m.PagosModule)
      },
      {
        path: 'tarifas',
        canActivate: [RoleGuard],
        data: { roles: ['ADMIN', 'SUPER_ADMIN'] },
        loadChildren: () => import('../tarifas/tarifas.module').then(m => m.TarifasModule)
      },
      {
        path: 'comunidades',
        loadChildren: () => import('../comunidades/comunidades.module').then(m => m.ComunidadesModule)
      },
      {
        path: 'alertas',
        loadChildren: () => import('../alertas/alertas.module').then(m => m.AlertasModule)
      },
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' }
    ]
  }
];

@NgModule({
  declarations: [LayoutComponent],
  imports: [
    CommonModule,
    RouterModule.forChild(routes)
  ]
})
export class LayoutModule {}
