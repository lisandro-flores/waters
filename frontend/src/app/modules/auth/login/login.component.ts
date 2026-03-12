import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../../core/auth/auth.service';

@Component({
  selector: 'app-login',
  standalone: false,
  template: `
    <div class="min-h-screen flex bg-gradient-to-br from-[#0d2137] via-[#0e3a6b] to-[#1a6fa8]">
      <!-- Left visual panel -->
      <div class="hidden lg:flex flex-1 flex-col items-center justify-center p-12 text-white">
        <div class="max-w-md">
          <div class="w-20 h-20 rounded-3xl bg-white/20 backdrop-blur flex items-center justify-center mb-8 shadow-2xl">
            <svg xmlns="http://www.w3.org/2000/svg" class="text-white" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 22a7 7 0 0 0 7-7c0-2-1-3.9-3-5.5s-3.5-4-4-6.5c-.5 2.5-2 4.9-4 6.5C6 11.1 5 13 5 15a7 7 0 0 0 7 7z"/></svg>
          </div>
          <h1 class="text-5xl mb-4" style="font-weight: 800; line-height: 1.1">
            Gestión<br>de Agua<br>
            <span class="text-sky-300">Inteligente</span>
          </h1>
          <p class="text-white/70 text-lg leading-relaxed">
            Administra suscriptores, medidores, lecturas y facturación de tu sistema de agua potable en un solo lugar.
          </p>
          <div class="mt-10 grid grid-cols-3 gap-4">
            <div class="bg-white/10 rounded-2xl p-4 backdrop-blur">
              <div class="text-2xl text-sky-300 font-bold">225+</div>
              <div class="text-sm text-white/60 mt-0.5">Suscriptores</div>
            </div>
            <div class="bg-white/10 rounded-2xl p-4 backdrop-blur">
              <div class="text-2xl text-sky-300 font-bold">214</div>
              <div class="text-sm text-white/60 mt-0.5">Medidores activos</div>
            </div>
            <div class="bg-white/10 rounded-2xl p-4 backdrop-blur">
              <div class="text-2xl text-sky-300 font-bold">87%</div>
              <div class="text-sm text-white/60 mt-0.5">Tasa de cobro</div>
            </div>
          </div>
        </div>
      </div>

      <!-- Right login panel -->
      <div class="flex-1 lg:max-w-[480px] flex items-center justify-center p-6">
        <div class="w-full max-w-sm">
          <div class="bg-white rounded-3xl shadow-2xl p-8">
            <!-- Logo mobile -->
            <div class="flex items-center gap-3 mb-8 lg:hidden">
              <div class="w-10 h-10 rounded-xl bg-sky-600 flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" class="text-white" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 22a7 7 0 0 0 7-7c0-2-1-3.9-3-5.5s-3.5-4-4-6.5c-.5 2.5-2 4.9-4 6.5C6 11.1 5 13 5 15a7 7 0 0 0 7 7z"/></svg>
              </div>
              <span class="text-2xl text-gray-900 font-bold">Waters</span>
            </div>

            <h2 class="text-gray-900 mb-1 font-bold text-xl">Iniciar sesión</h2>
            <p class="text-gray-500 text-sm mb-6">Accede a tu panel de administración</p>

            <form [formGroup]="loginForm" (ngSubmit)="onSubmit()" class="space-y-4">
              <div>
                <label class="block text-sm text-gray-700 mb-1.5 font-medium">Correo electrónico</label>
                <input type="email" formControlName="email"
                       placeholder="usuario@waters.com"
                       class="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent bg-slate-50" />
              </div>
              <div>
                <label class="block text-sm text-gray-700 mb-1.5 font-medium">Contraseña</label>
                <div class="relative">
                  <input [type]="showPassword ? 'text' : 'password'" formControlName="password"
                         placeholder="••••••••"
                         class="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent bg-slate-50 pr-10" />
                  <button type="button" (click)="showPassword = !showPassword"
                          class="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-700">
                    <!-- Eye icon -->
                    <svg *ngIf="!showPassword" xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M2.062 12.348a1 1 0 0 1 0-.696 10.75 10.75 0 0 1 19.876 0 1 1 0 0 1 0 .696 10.75 10.75 0 0 1-19.876 0"/><circle cx="12" cy="12" r="3"/></svg>
                    <svg *ngIf="showPassword" xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M10.733 5.076a10.744 10.744 0 0 1 11.205 6.575 1 1 0 0 1 0 .696 10.747 10.747 0 0 1-1.444 2.49"/><path d="M14.084 14.158a3 3 0 0 1-4.242-4.242"/><path d="M17.479 17.499a10.75 10.75 0 0 1-15.417-5.151 1 1 0 0 1 0-.696 10.75 10.75 0 0 1 4.446-5.143"/><path d="m2 2 20 20"/></svg>
                  </button>
                </div>
              </div>

              <div *ngIf="error" class="flex items-start gap-2 bg-red-50 text-red-700 text-sm rounded-xl px-4 py-3">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" class="mt-0.5 flex-shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><line x1="12" x2="12" y1="8" y2="12"/><line x1="12" x2="12.01" y1="16" y2="16"/></svg>
                <span>{{error}}</span>
              </div>

              <button type="submit" [disabled]="loading || loginForm.invalid"
                      class="w-full bg-sky-600 hover:bg-sky-700 text-white rounded-xl py-3 text-sm font-semibold transition-colors flex items-center justify-center gap-2 disabled:opacity-60">
                <svg *ngIf="loading" class="animate-spin" xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 12a9 9 0 1 1-6.219-8.56"/></svg>
                {{loading ? 'Ingresando...' : 'Ingresar'}}
              </button>
            </form>

            <!-- Demo credentials -->
            <div class="mt-6 pt-5 border-t border-gray-100">
              <p class="text-xs text-gray-400 text-center mb-3">Accesos de demostración</p>
              <div class="grid grid-cols-2 gap-2">
                <button (click)="fillAdmin()"
                        class="text-xs bg-sky-50 hover:bg-sky-100 text-sky-700 rounded-xl py-2 px-3 transition-colors text-left">
                  <span class="block font-semibold">Admin</span>
                  <span class="text-sky-500">admin&#64;sistema.com</span>
                </button>
                <button (click)="fillOperator()"
                        class="text-xs bg-emerald-50 hover:bg-emerald-100 text-emerald-700 rounded-xl py-2 px-3 transition-colors text-left">
                  <span class="block font-semibold">Operador</span>
                  <span class="text-emerald-500">operador&#64;sistema.com</span>
                </button>
              </div>
            </div>
          </div>

          <p class="text-center text-white/40 text-xs mt-6">
            &copy; 2025 Waters — Sistema de Gestión de Agua Potable
          </p>
        </div>
      </div>
    </div>
  `
})
export class LoginComponent {
  loginForm: FormGroup;
  showPassword = false;
  loading = false;
  error = '';

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required]
    });
  }

  fillAdmin(): void {
    this.loginForm.patchValue({ email: 'admin@sistema.com', password: 'password' });
  }

  fillOperator(): void {
    this.loginForm.patchValue({ email: 'operador@sistema.com', password: 'password' });
  }

  onSubmit(): void {
    if (this.loginForm.invalid) return;
    this.error = '';
    this.loading = true;

    this.authService.login(this.loginForm.value).subscribe({
      next: () => {
        this.router.navigate(['/dashboard'], { replaceUrl: true });
      },
      error: (err) => {
        this.loading = false;
        this.error = err.status === 401
          ? 'Credenciales incorrectas. Verifique su correo y contraseña.'
          : 'Error al conectar con el servidor. Intente de nuevo.';
      }
    });
  }
}
