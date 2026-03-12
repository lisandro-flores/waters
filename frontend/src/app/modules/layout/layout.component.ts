import { Component, OnInit } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { AuthService } from '../../core/auth/auth.service';
import { filter } from 'rxjs/operators';

interface NavItem {
  path: string;
  label: string;
  icon: string;
  badge?: number;
}

@Component({
  selector: 'app-layout',
  standalone: false,
  template: `
    <!-- Mobile overlay -->
    <div *ngIf="mobileOpen"
         class="fixed inset-0 bg-black/50 z-40 lg:hidden"
         (click)="mobileOpen = false"></div>

    <!-- Sidebar -->
    <aside [class]="sidebarClasses">
      <!-- Logo -->
      <div class="flex items-center h-16 border-b border-white/10 px-4"
           [class.justify-center]="collapsed">
        <div class="flex items-center gap-2">
          <div class="w-9 h-9 rounded-xl bg-sky-500 flex items-center justify-center flex-shrink-0 shadow-lg">
            <svg xmlns="http://www.w3.org/2000/svg" class="text-white" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 22a7 7 0 0 0 7-7c0-2-1-3.9-3-5.5s-3.5-4-4-6.5c-.5 2.5-2 4.9-4 6.5C6 11.1 5 13 5 15a7 7 0 0 0 7 7z"/></svg>
          </div>
          <div *ngIf="!collapsed">
            <span class="text-xl tracking-tight font-bold text-white">Waters</span>
            <p class="text-[10px] text-sky-300 -mt-0.5 tracking-widest uppercase">Gestión de Agua</p>
          </div>
        </div>
        <button *ngIf="!collapsed && mobileOpen"
                (click)="mobileOpen = false"
                class="lg:hidden text-white/60 hover:text-white ml-auto">
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
        </button>
      </div>

      <!-- Nav Items -->
      <nav class="flex-1 overflow-y-auto py-4 px-2">
        <div class="space-y-0.5">
          <button *ngFor="let item of navItems"
                  (click)="navigate(item.path)"
                  [title]="collapsed ? item.label : ''"
                  [class]="getNavItemClasses(item.path)">
            <span [innerHTML]="getIcon(item.icon)" class="flex-shrink-0 w-[18px] h-[18px]"></span>
            <span *ngIf="!collapsed" [class]="isActive(item.path) ? 'text-white' : ''">{{item.label}}</span>
            <span *ngIf="!collapsed && item.badge"
                  class="ml-auto bg-red-500 text-white text-[10px] rounded-full w-5 h-5 flex items-center justify-center">
              {{item.badge}}
            </span>
          </button>
        </div>
      </nav>

      <!-- Collapse toggle (desktop) -->
      <div class="hidden lg:block border-t border-white/10 p-2">
        <button (click)="collapsed = !collapsed"
                class="w-full flex items-center justify-center py-2 text-white/50 hover:text-white transition-colors rounded-xl hover:bg-white/10">
          <svg *ngIf="!collapsed" xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="m15 18-6-6 6-6"/></svg>
          <svg *ngIf="collapsed" xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="m9 18 6-6-6-6"/></svg>
        </button>
      </div>

      <!-- User section -->
      <div class="border-t border-white/10 p-3">
        <div *ngIf="!collapsed" class="flex items-center gap-3 px-2 py-2">
          <div class="w-8 h-8 rounded-full bg-sky-500 flex items-center justify-center text-sm flex-shrink-0 font-bold text-white">
            {{userInitial}}
          </div>
          <div class="flex-1 min-w-0">
            <p class="text-sm font-medium text-white truncate">{{userName}}</p>
            <p class="text-xs text-white/50 truncate capitalize">{{userRole}}</p>
          </div>
          <button (click)="logout()" class="text-white/50 hover:text-white transition-colors" title="Cerrar sesión">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" x2="9" y1="12" y2="12"/></svg>
          </button>
        </div>
        <div *ngIf="collapsed" class="flex flex-col items-center gap-2">
          <button (click)="logout()" class="text-white/50 hover:text-white transition-colors p-2" title="Cerrar sesión">
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" x2="9" y1="12" y2="12"/></svg>
          </button>
        </div>
      </div>
    </aside>

    <!-- Main content -->
    <div class="flex-1 flex flex-col min-h-screen transition-all duration-300"
         [style.margin-left.px]="sidebarWidth">
      <!-- Top Header -->
      <header class="sticky top-0 z-30 h-16 bg-white border-b border-gray-200 flex items-center px-4 gap-4 shadow-sm">
        <button (click)="mobileOpen = true"
                class="lg:hidden text-gray-500 hover:text-gray-900">
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="4" x2="20" y1="12" y2="12"/><line x1="4" x2="20" y1="6" y2="6"/><line x1="4" x2="20" y1="18" y2="18"/></svg>
        </button>

        <!-- Search -->
        <div class="flex-1 max-w-md hidden sm:flex items-center gap-2 bg-slate-100 rounded-xl px-3 py-2">
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" class="text-gray-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>
          <input type="text" placeholder="Buscar suscriptores, medidores..."
                 class="bg-transparent text-sm outline-none flex-1 text-gray-700 placeholder:text-gray-400" />
        </div>

        <div class="ml-auto flex items-center gap-3">
          <button class="relative w-9 h-9 rounded-xl bg-slate-100 flex items-center justify-center text-gray-600 hover:bg-slate-200 transition-colors">
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9"/><path d="M10.3 21a1.94 1.94 0 0 0 3.4 0"/></svg>
            <span class="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full"></span>
          </button>
          <div class="flex items-center gap-2">
            <div class="w-9 h-9 rounded-xl bg-sky-600 flex items-center justify-center text-white text-sm font-bold">
              {{userInitial}}
            </div>
            <div class="hidden sm:block">
              <p class="text-sm font-medium leading-tight">{{userName}}</p>
              <p class="text-xs text-gray-500 capitalize">{{userRole}}</p>
            </div>
          </div>
        </div>
      </header>

      <!-- Page content -->
      <main class="flex-1 overflow-auto">
        <router-outlet></router-outlet>
      </main>
    </div>
  `,
  styles: [`
    :host {
      display: flex;
      min-height: 100vh;
      background: #f8fafc;
    }
  `]
})
export class LayoutComponent implements OnInit {
  collapsed = false;
  mobileOpen = false;
  currentPath = '';

  navItems: NavItem[] = [
    { path: '/dashboard', label: 'Dashboard', icon: 'layout-dashboard' },
    { path: '/suscriptores', label: 'Suscriptores', icon: 'users' },
    { path: '/medidores', label: 'Medidores', icon: 'gauge' },
    { path: '/lecturas', label: 'Lecturas', icon: 'clipboard-list' },
    { path: '/tarifas', label: 'Tarifas', icon: 'dollar-sign' },
    { path: '/facturacion', label: 'Facturación', icon: 'file-text' },
    { path: '/pagos', label: 'Pagos', icon: 'credit-card' },
    { path: '/comunidades', label: 'Comunidades', icon: 'map-pin' },
    { path: '/alertas', label: 'Alertas', icon: 'bell', badge: 0 },
  ];

  constructor(
    private router: Router,
    private authService: AuthService
  ) {}

  ngOnInit() {
    this.router.events.pipe(
      filter(e => e instanceof NavigationEnd)
    ).subscribe((e: any) => {
      this.currentPath = e.urlAfterRedirects || e.url;
      this.mobileOpen = false;
    });
    this.currentPath = this.router.url;
  }

  get sidebarWidth(): number {
    return this.collapsed ? 72 : 256;
  }

  get sidebarClasses(): string {
    const base = 'fixed top-0 left-0 h-full z-50 flex flex-col transition-all duration-300 ease-in-out bg-[#0d2137] text-white';
    const width = this.collapsed ? 'w-[72px]' : 'w-[256px]';
    const mobile = this.mobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0';
    return `${base} ${width} ${mobile}`;
  }

  get userName(): string {
    const user = this.authService.getCurrentUser();
    return user?.nombre || 'Usuario';
  }

  get userInitial(): string {
    return this.userName.charAt(0).toUpperCase();
  }

  get userRole(): string {
    const user = this.authService.getCurrentUser();
    return (user?.rol || 'usuario').toLowerCase();
  }

  isActive(path: string): boolean {
    return this.currentPath.startsWith(path);
  }

  getNavItemClasses(path: string): string {
    const base = 'w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm transition-all duration-150 group';
    const active = this.isActive(path)
      ? 'bg-sky-600 text-white shadow-lg shadow-sky-900/40'
      : 'text-white/70 hover:text-white hover:bg-white/10';
    const center = this.collapsed ? 'justify-center' : '';
    return `${base} ${active} ${center}`;
  }

  navigate(path: string): void {
    this.router.navigate([path]);
    this.mobileOpen = false;
  }

  logout(): void {
    this.authService.logout();
  }

  getIcon(name: string): string {
    const icons: Record<string, string> = {
      'layout-dashboard': '<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="7" height="9" x="3" y="3" rx="1"/><rect width="7" height="5" x="14" y="3" rx="1"/><rect width="7" height="9" x="14" y="12" rx="1"/><rect width="7" height="5" x="3" y="16" rx="1"/></svg>',
      'users': '<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>',
      'gauge': '<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m12 14 4-4"/><path d="M3.34 19a10 10 0 1 1 17.32 0"/></svg>',
      'clipboard-list': '<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="8" height="4" x="8" y="2" rx="1" ry="1"/><path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"/><path d="M12 11h4"/><path d="M12 16h4"/><path d="M8 11h.01"/><path d="M8 16h.01"/></svg>',
      'dollar-sign': '<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="12" x2="12" y1="2" y2="22"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>',
      'file-text': '<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z"/><path d="M14 2v4a2 2 0 0 0 2 2h4"/><path d="M10 9H8"/><path d="M16 13H8"/><path d="M16 17H8"/></svg>',
      'credit-card': '<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="20" height="14" x="2" y="5" rx="2"/><line x1="2" x2="22" y1="10" y2="10"/></svg>',
      'map-pin': '<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 10c0 4.993-5.539 10.193-7.399 11.799a1 1 0 0 1-1.202 0C9.539 20.193 4 14.993 4 10a8 8 0 0 1 16 0"/><circle cx="12" cy="10" r="3"/></svg>',
      'bell': '<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9"/><path d="M10.3 21a1.94 1.94 0 0 0 3.4 0"/></svg>',
    };
    return icons[name] || '';
  }
}
