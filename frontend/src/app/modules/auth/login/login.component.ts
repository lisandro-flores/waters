import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../../core/auth/auth.service';

@Component({
  selector: 'app-login',
  template: `
    <div class="login-wrapper">
      <div class="login-split-left">
        <div class="left-overlay"></div>
        <div class="left-content animate-in-left">
          <div class="logo-large">
            <mat-icon>water_drop</mat-icon>
          </div>
          <h1 class="welcome-title">AguaGestión</h1>
          <p class="welcome-subtitle">Plataforma inteligente para la administración y control de sistemas de agua potable comunitaria.</p>
          <div class="features-list">
            <div class="feature-item"><mat-icon>check_circle</mat-icon> <span>Toma de lecturas en tiempo real</span></div>
            <div class="feature-item"><mat-icon>check_circle</mat-icon> <span>Facturación automatizada</span></div>
            <div class="feature-item"><mat-icon>check_circle</mat-icon> <span>Gestión de medidores y suscriptores</span></div>
          </div>
        </div>
      </div>
      
      <div class="login-split-right animate-in-right">
        <div class="login-form-container">
          <div class="mobile-branding">
            <div class="logo-small"><mat-icon>water_drop</mat-icon></div>
            <h2>AguaGestión</h2>
          </div>
          
          <div class="login-header">
            <h2>Bienvenido de nuevo</h2>
            <p>Ingresa tus credenciales para acceder al sistema</p>
          </div>

          <form [formGroup]="loginForm" (ngSubmit)="onLogin()" class="login-form">
            <mat-form-field appearance="outline" class="full-width custom-field">
              <mat-label>Correo electrónico</mat-label>
              <input matInput autoFocus type="email" formControlName="email" autocomplete="email" placeholder="ejemplo@correo.com" />
              <mat-icon matPrefix color="primary">email</mat-icon>
              <mat-error *ngIf="loginForm.get('email')?.hasError('required')">El correo es requerido</mat-error>
              <mat-error *ngIf="loginForm.get('email')?.hasError('email')">Correo inválido</mat-error>
            </mat-form-field>

            <mat-form-field appearance="outline" class="full-width custom-field">
              <mat-label>Contraseña</mat-label>
              <input matInput [type]="showPassword ? 'text' : 'password'" formControlName="password" autocomplete="current-password" placeholder="••••••••" />
              <mat-icon matPrefix color="primary">lock</mat-icon>
              <button mat-icon-button matSuffix type="button" tabindex="-1" (click)="showPassword = !showPassword">
                <mat-icon>{{ showPassword ? 'visibility_off' : 'visibility' }}</mat-icon>
              </button>
              <mat-error *ngIf="loginForm.get('password')?.hasError('required')">La contraseña es requerida</mat-error>
            </mat-form-field>

            <div class="forgot-password">
              <a href="javascript:void(0)">¿Olvidaste tu contraseña?</a>
            </div>

            <div *ngIf="errorMsg" class="error-msg animate-shake">
              <mat-icon>error_outline</mat-icon>
              <span>{{ errorMsg }}</span>
            </div>

            <button mat-flat-button color="primary" class="full-width login-btn" type="submit" [disabled]="loginForm.invalid || loading">
              <span *ngIf="loading" class="spinner-container">
                <mat-spinner diameter="24" color="accent"></mat-spinner> Autenticando...
              </span>
              <span *ngIf="!loading">Iniciar Sesión</span>
            </button>
          </form>

          <div class="login-footer">
            <p>&copy; 2026 LSoft Soluciones &mdash; v1.0</p>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    :host {
      display: block;
      height: 100vh;
      width: 100vw;
      background: #f5f7fa;
      overflow: hidden;
    }

    .login-wrapper {
      display: flex;
      height: 100%;
      width: 100%;
    }

    /* Left side (Branding/Image) */
    .login-split-left {
      flex: 1.2;
      position: relative;
      background: linear-gradient(135deg, #004878 0%, #0078a9 40%, #26a8d0 100%);
      display: flex;
      flex-direction: column;
      justify-content: center;
      padding: 0 10%;
      color: white;
      overflow: hidden;
    }
    
    .left-overlay {
      position: absolute;
      top: 0; left: 0; right: 0; bottom: 0;
      background: url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.05'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E");
      z-index: 1;
    }

    .left-content {
      position: relative;
      z-index: 2;
    }

    .logo-large {
      width: 80px; height: 80px;
      background: rgba(255, 255, 255, 0.15);
      backdrop-filter: blur(10px);
      border-radius: 20px;
      display: flex;
      align-items: center;
      justify-content: center;
      margin-bottom: 2rem;
      box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
      border: 1px solid rgba(255, 255, 255, 0.2);
    }
    .logo-large mat-icon {
      font-size: 48px; width: 48px; height: 48px;
      color: #fff;
    }

    .welcome-title {
      font-size: 3.5rem;
      font-weight: 800;
      margin: 0 0 1rem;
      line-height: 1.1;
      letter-spacing: -1px;
    }

    .welcome-subtitle {
      font-size: 1.2rem;
      line-height: 1.6;
      opacity: 0.9;
      margin-bottom: 3rem;
      max-width: 450px;
      font-weight: 300;
    }

    .features-list {
      display: flex;
      flex-direction: column;
      gap: 1.2rem;
    }
    .feature-item {
      display: flex;
      align-items: center;
      gap: 12px;
      font-size: 1.1rem;
      opacity: 0.95;
    }
    .feature-item mat-icon {
      color: #81d4fa;
    }

    /* Right side (Form) */
    .login-split-right {
      flex: 1;
      background: white;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 2rem;
      position: relative;
    }

    .login-form-container {
      width: 100%;
      max-width: 420px;
    }

    .mobile-branding {
      display: none;
      text-align: center;
      margin-bottom: 2rem;
    }
    .logo-small {
      width: 64px; height: 64px;
      margin: 0 auto 1rem;
      border-radius: 16px;
      background: linear-gradient(135deg, #0078a9, #26a8d0);
      display: flex;
      align-items: center;
      justify-content: center;
      color: white;
    }
    .logo-small mat-icon { font-size: 32px; width: 32px; height: 32px; }
    .mobile-branding h2 {
      margin: 0; color: #004878; font-weight: 700; font-size: 24px;
    }

    .login-header {
      margin-bottom: 2.5rem;
    }
    .login-header h2 {
      font-size: 2rem;
      font-weight: 700;
      color: #1a202c;
      margin: 0 0 0.5rem;
    }
    .login-header p {
      color: #718096;
      margin: 0;
      font-size: 1.05rem;
    }

    .custom-field {
      margin-bottom: 0.5rem;
    }
    ::ng-deep .custom-field .mat-mdc-text-field-wrapper {
      background-color: #f8fafc !important;
    }
    ::ng-deep .custom-field .mat-mdc-form-field-focus-overlay {
      background-color: transparent !important;
    }

    .forgot-password {
      text-align: right;
      margin-top: -10px;
      margin-bottom: 24px;
    }
    .forgot-password a {
      color: #0078a9;
      text-decoration: none;
      font-size: 0.9rem;
      font-weight: 500;
      transition: color 0.2s;
    }
    .forgot-password a:hover {
      color: #004878;
      text-decoration: underline;
    }

    .login-btn {
      height: 52px;
      font-size: 1.1rem;
      font-weight: 600;
      letter-spacing: 0.5px;
      border-radius: 10px;
      margin-top: 10px;
      box-shadow: 0 4px 14px rgba(0, 120, 169, 0.3);
      transition: transform 0.2s, box-shadow 0.2s;
    }
    .login-btn:hover:not([disabled]) {
      transform: translateY(-2px);
      box-shadow: 0 6px 20px rgba(0, 120, 169, 0.4);
    }
    .spinner-container {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 10px;
    }

    .error-msg {
      display: flex;
      align-items: center;
      gap: 10px;
      color: #e53e3e;
      background: #fff5f5;
      padding: 12px 16px;
      border-radius: 8px;
      border-left: 4px solid #e53e3e;
      margin-bottom: 20px;
      font-size: 0.95rem;
    }

    .login-footer {
      margin-top: 3rem;
      text-align: center;
      color: #a0aec0;
      font-size: 0.85rem;
    }

    /* Animations */
    .animate-in-left {
      animation: slideInLeft 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards;
    }
    .animate-in-right {
      animation: fadeIn 0.8s ease-out forwards;
    }
    .animate-shake {
      animation: shake 0.4s cubic-bezier(.36,.07,.19,.97) both;
    }

    @keyframes slideInLeft {
      from { opacity: 0; transform: translateX(-30px); }
      to { opacity: 1; transform: translateX(0); }
    }
    @keyframes fadeIn {
      from { opacity: 0; transform: translateY(10px); }
      to { opacity: 1; transform: translateY(0); }
    }
    @keyframes shake {
      10%, 90% { transform: translate3d(-1px, 0, 0); }
      20%, 80% { transform: translate3d(2px, 0, 0); }
      30%, 50%, 70% { transform: translate3d(-3px, 0, 0); }
      40%, 60% { transform: translate3d(3px, 0, 0); }
    }

    /* Responsive Design */
    @media (max-width: 900px) {
      .login-split-left { display: none; }
      .login-split-right {
        background: #f5f7fa;
        padding: 1.5rem;
      }
      .login-form-container {
        background: white;
        padding: 2.5rem 2rem;
        border-radius: 20px;
        box-shadow: 0 10px 40px rgba(0, 0, 0, 0.08);
      }
      .mobile-branding { display: block; }
      .login-header { text-align: center; }
    }
  `]

})
export class LoginComponent implements OnInit {
  loginForm!: FormGroup;
  loading = false;
  showPassword = false;
  errorMsg = '';

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required]
    });

    if (this.authService.isAuthenticated()) {
      this.router.navigate(['/dashboard']);
    }
  }

  onLogin(): void {
    if (this.loginForm.invalid) return;
    this.loading = true;
    this.errorMsg = '';

    this.authService.login(this.loginForm.value).subscribe({
      next: () => this.router.navigate(['/dashboard']),
      error: (err) => {
        this.loading = false;
        this.errorMsg = err.status === 401
          ? 'Credenciales inválidas'
          : 'Error al conectar con el servidor';
      }
    });
  }
}
