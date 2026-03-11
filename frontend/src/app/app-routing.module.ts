import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from './core/guards/auth.guard';
import { RoleGuard } from './core/guards/role.guard';

const routes: Routes = [
  // Redirección raíz
  { path: '', redirectTo: 'dashboard', pathMatch: 'full' },

  // Autenticación (sin layout)
  {
    path: 'auth',
    loadChildren: () => import('./modules/auth/auth.module').then(m => m.AuthModule)
  },

  // Módulos protegidos (con layout principal)
  {
    path: '',
    canActivate: [AuthGuard],
    loadChildren: () => import('./modules/layout/layout.module').then(m => m.LayoutModule)
  },

  // 403 Acceso denegado
  { path: '403', loadComponent: () => import('./shared/components/forbidden/forbidden.component').then(c => c.ForbiddenComponent) },

  // Catch-all
  { path: '**', redirectTo: 'dashboard' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { scrollPositionRestoration: 'top' })],
  exports: [RouterModule]
})
export class AppRoutingModule {}
