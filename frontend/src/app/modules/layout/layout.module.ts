import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { RoleGuard } from '../../core/guards/role.guard';

// Angular Material
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { MatButtonModule } from '@angular/material/button';
import { MatMenuModule } from '@angular/material/menu';
import { MatDividerModule } from '@angular/material/divider';
import { MatBadgeModule } from '@angular/material/badge';
import { MatTooltipModule } from '@angular/material/tooltip';

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
        path: 'reportes',
        loadChildren: () => import('../reportes/reportes.module').then(m => m.ReportesModule)
      },
      {
        path: 'tarifas',
        canActivate: [RoleGuard],
        data: { roles: ['ADMIN', 'SUPER_ADMIN'] },
        loadChildren: () => import('../tarifas/tarifas.module').then(m => m.TarifasModule)
      },
      {
        path: 'configuracion',
        canActivate: [RoleGuard],
        data: { roles: ['ADMIN', 'SUPER_ADMIN'] },
        loadChildren: () => import('../configuracion/configuracion.module').then(m => m.ConfiguracionModule)
      },
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' }
    ]
  }
];

@NgModule({
  declarations: [LayoutComponent],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    MatSidenavModule, MatToolbarModule, MatIconModule,
    MatListModule, MatButtonModule, MatMenuModule,
    MatDividerModule, MatBadgeModule, MatTooltipModule
  ]
})
export class LayoutModule {}
