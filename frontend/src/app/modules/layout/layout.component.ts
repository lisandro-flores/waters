import { Component, OnInit, OnDestroy, HostListener } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';
import { Subscription } from 'rxjs';
import { AuthService } from '../../core/auth/auth.service';
import { ReporteService } from '../../core/services/reporte.service';
import { AuthResponse } from '../../core/models/models';

/** Estructura de cada entrada del menú de navegación */
interface NavItem {
  label: string;
  icon: string;
  route: string;
  roles?: string[];
}

@Component({
  selector: 'app-layout',
  template: `
    <mat-sidenav-container class="sidenav-container">

      <!-- Sidebar de navegación -->
      <mat-sidenav #sidenav [mode]="isMobile ? 'over' : 'side'"
                   [opened]="!isMobile" class="sidenav"
                   [fixedInViewport]="isMobile">
        <div class="sidenav-header">
          <div class="logo-wrap">
            <div class="logo-icon">
              <mat-icon>water_drop</mat-icon>
            </div>
            <div class="app-title">
              <span class="app-name">AguaGestión</span>
              <span class="community-name">{{ currentUser?.comunidadNombre }}</span>
            </div>
          </div>
        </div>

        <mat-nav-list class="nav-list">
          <ng-container *ngFor="let item of navItems">
            <a mat-list-item
               *ngIf="!item.roles || hasRole(item.roles)"
               [routerLink]="item.route"
               routerLinkActive="active-link"
               [routerLinkActiveOptions]="{exact: item.route === '/dashboard'}"
               (click)="isMobile && sidenav.close()">
              <mat-icon matListItemIcon>{{ item.icon }}</mat-icon>
              <span matListItemTitle>{{ item.label }}</span>
            </a>
          </ng-container>
        </mat-nav-list>

        <div class="sidenav-footer">
          <mat-divider></mat-divider>
          <div class="footer-info">
            <small>v1.0 &middot; LSoft Soluciones</small>
          </div>
        </div>
      </mat-sidenav>

      <!-- Contenido principal -->
      <mat-sidenav-content class="content-area">
        <!-- Toolbar superior -->
        <mat-toolbar color="primary" class="toolbar">
          <button mat-icon-button (click)="sidenav.toggle()" aria-label="Menú">
            <mat-icon>{{ sidenav.opened ? 'menu_open' : 'menu' }}</mat-icon>
          </button>

          <div class="toolbar-title-group">
            <span class="toolbar-title">{{ pageTitle }}</span>
          </div>

          <span class="toolbar-spacer"></span>

          <!-- Alertas pendientes -->
          <button mat-icon-button routerLink="/reportes" matTooltip="Alertas pendientes"
                  class="toolbar-action">
            <mat-icon [matBadge]="alertasCount || null" matBadgeColor="warn"
                      matBadgeSize="small">notifications</mat-icon>
          </button>

          <!-- Menu usuario -->
          <button mat-icon-button [matMenuTriggerFor]="userMenu" class="toolbar-action user-btn">
            <div class="user-avatar">{{ userInitials }}</div>
          </button>
          <mat-menu #userMenu="matMenu" xPosition="before">
            <div class="user-menu-header" mat-menu-item disabled>
              <div class="user-detail">
                <strong>{{ currentUser?.nombre }}</strong>
                <span class="user-role">{{ currentUser?.rol }}</span>
              </div>
            </div>
            <mat-divider></mat-divider>
            <button mat-menu-item routerLink="/configuracion">
              <mat-icon>settings</mat-icon> Configuración
            </button>
            <button mat-menu-item (click)="logout()">
              <mat-icon>logout</mat-icon> Cerrar sesión
            </button>
          </mat-menu>
        </mat-toolbar>

        <!-- Contenido del módulo activo -->
        <div class="main-content animate-in">
          <router-outlet></router-outlet>
        </div>
      </mat-sidenav-content>
    </mat-sidenav-container>
  `,
  styles: [`
    .sidenav-container { height: 100vh; }

    /* ---- Sidebar ---- */
    .sidenav {
      width: 260px;
      background: linear-gradient(180deg, #0052748f 0%, #006fa8 100%);
      border-right: none !important;
    }
    .sidenav-header {
      padding: 24px 20px 20px;
      background: rgba(0,0,0,0.15);
    }
    .logo-wrap {
      display: flex;
      align-items: center;
      gap: 14px;
    }
    .logo-icon {
      width: 44px; height: 44px;
      border-radius: 12px;
      background: rgba(255,255,255,0.2);
      display: flex; align-items: center; justify-content: center;
      flex-shrink: 0;
    }
    .logo-icon mat-icon {
      font-size: 26px; width: 26px; height: 26px; color: #b3e5fc;
    }
    .app-title { display: flex; flex-direction: column; }
    .app-name { font-size: 17px; font-weight: 700; color: white; letter-spacing: -0.3px; }
    .community-name { font-size: 11px; color: #b3e5fc; margin-top: 2px; opacity: 0.95; }

    /* Nav items */
    .nav-list { padding: 8px 8px !important; }
    .sidenav .mat-mdc-list-item {
      color: rgba(255,255,255,0.95) !important;
      border-radius: 8px !important;
      margin-bottom: 2px;
      height: 44px !important;
      transition: all 150ms ease;
      font-weight: 500;
    }
    .sidenav .mat-mdc-list-item:hover {
      background: rgba(255,255,255,0.12) !important;
      color: white !important;
    }
    .sidenav .mat-mdc-list-item.active-link {
      background: rgba(179, 229, 252, 0.2) !important;
      color: #b3e5fc !important;
      font-weight: 600;
    }
    .sidenav .mat-mdc-list-item.active-link mat-icon {
      color: #b3e5fc !important;
    }
    .sidenav .mat-mdc-list-item mat-icon {
      color: rgba(255,255,255,0.75) !important;
      transition: color 150ms ease;
    }
    .sidenav .mat-mdc-list-item:hover mat-icon {
      color: rgba(255,255,255,1) !important;
    }

    /* Sidebar footer */
    .sidenav-footer {
      position: absolute;
      bottom: 0;
      width: 100%;
    }
    .sidenav-footer mat-divider { border-color: rgba(255,255,255,0.08); }
    .footer-info {
      padding: 12px 16px;
      color: rgba(255,255,255,0.35);
      text-align: center;
    }

    /* ---- Toolbar ---- */
    .toolbar {
      position: sticky;
      top: 0;
      z-index: 100;
      height: 56px;
      box-shadow: 0 1px 4px rgba(0,0,0,0.1);
    }
    .toolbar-spacer { flex: 1; }
    .toolbar-title-group { margin-left: 8px; }
    .toolbar-title {
      font-size: 17px;
      font-weight: 500;
      letter-spacing: -0.2px;
    }
    .toolbar-action { margin-left: 4px; }

    /* User avatar circle */
    .user-avatar {
      width: 32px; height: 32px;
      border-radius: 50%;
      background: rgba(255,255,255,0.2);
      color: white;
      font-size: 13px;
      font-weight: 600;
      display: flex; align-items: center; justify-content: center;
      letter-spacing: 0.5px;
    }

    /* User menu */
    .user-menu-header { pointer-events: none; }
    .user-detail {
      display: flex;
      flex-direction: column;
      padding: 4px 0;
    }
    .user-detail strong { font-size: 14px; }
    .user-role {
      font-size: 11px;
      color: #90a4ae;
      text-transform: uppercase;
      letter-spacing: 0.5px;
      margin-top: 2px;
    }

    /* ---- Main content ---- */
    .main-content {
      padding: 28px 32px;
      max-width: 1280px;
    }

    @media (max-width: 768px) {
      .main-content { padding: 16px; }
      .toolbar-title { font-size: 15px; }
    }
  `]
})
export class LayoutComponent implements OnInit, OnDestroy {
  currentUser: AuthResponse | null = null;
  isMobile = false;
  alertasCount = 0;
  pageTitle = 'Dashboard';
  userInitials = '';
  private routerSub?: Subscription;

  /** Route-to-title mapping */
  private readonly routeTitles: Record<string, string> = {
    '/dashboard':     'Dashboard',
    '/suscriptores':  'Suscriptores',
    '/medidores':     'Medidores',
    '/lecturas':      'Lecturas',
    '/facturacion':   'Facturación',
    '/pagos':         'Pagos',
    '/reportes':      'Reportes',
    '/tarifas':       'Tarifas',
    '/configuracion': 'Configuración',
  };

  navItems: NavItem[] = [
    { label: 'Dashboard',      icon: 'dashboard',        route: '/dashboard' },
    { label: 'Suscriptores',   icon: 'people',           route: '/suscriptores' },
    { label: 'Medidores',      icon: 'speed',            route: '/medidores' },
    { label: 'Lecturas',       icon: 'edit_note',        route: '/lecturas' },
    { label: 'Facturación',    icon: 'receipt_long',     route: '/facturacion', roles: ['ADMIN','CAJERO','SUPER_ADMIN'] },
    { label: 'Pagos',          icon: 'payments',         route: '/pagos',        roles: ['ADMIN','CAJERO','SUPER_ADMIN'] },
    { label: 'Reportes',       icon: 'bar_chart',        route: '/reportes' },
    { label: 'Tarifas',        icon: 'price_change',     route: '/tarifas',     roles: ['ADMIN','SUPER_ADMIN'] },
    { label: 'Configuración',  icon: 'settings',         route: '/configuracion', roles: ['ADMIN','SUPER_ADMIN'] }
  ];

  constructor(
    private authService: AuthService,
    private reporteService: ReporteService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.currentUser = this.authService.getCurrentUser();
    this.userInitials = this.getInitials(this.currentUser?.nombre || '');
    this.checkMobile();

    // Dynamic page title from route
    this.routerSub = this.router.events.pipe(
      filter(e => e instanceof NavigationEnd)
    ).subscribe((e) => {
      const url = (e as NavigationEnd).urlAfterRedirects || (e as NavigationEnd).url;
      this.pageTitle = this.resolveTitleFromUrl(url);
    });

    // Wire alertas count
    this.reporteService.getAlertasPendientes().subscribe({
      next: (alertas) => this.alertasCount = alertas.length,
      error: () => {}
    });
  }

  ngOnDestroy(): void {
    this.routerSub?.unsubscribe();
  }

  @HostListener('window:resize')
  onResize(): void {
    this.checkMobile();
  }

  hasRole(roles: string[]): boolean {
    return this.authService.hasRole(...roles);
  }

  logout(): void {
    this.authService.logout();
  }

  private checkMobile(): void {
    this.isMobile = window.innerWidth < 768;
  }

  private getInitials(name: string): string {
    return name.split(' ').map(w => w.charAt(0)).join('').substring(0, 2).toUpperCase();
  }

  private resolveTitleFromUrl(url: string): string {
    // Match /module or /module/sub
    for (const [route, title] of Object.entries(this.routeTitles)) {
      if (url === route || url.startsWith(route + '/')) {
        return title;
      }
    }
    return 'Dashboard';
  }
}
