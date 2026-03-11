import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-forbidden',
  standalone: true,
  imports: [CommonModule, RouterLink, MatButtonModule, MatIconModule],
  template: `
    <div class="forbidden">
      <mat-icon class="icon">lock</mat-icon>
      <h1>403</h1>
      <p>No tiene permisos para acceder a esta sección.</p>
      <button mat-raised-button color="primary" routerLink="/dashboard">
        <mat-icon>home</mat-icon> Ir al Dashboard
      </button>
    </div>
  `,
  styles: [`
    .forbidden {
      display: flex; flex-direction: column; align-items: center;
      justify-content: center; min-height: 70vh; gap: 16px;
    }
    .icon { font-size: 64px; height: 64px; width: 64px; color: #e53935; }
    h1 { font-size: 64px; margin: 0; color: #e53935; }
    p { color: #666; }
  `]
})
export class ForbiddenComponent {}
