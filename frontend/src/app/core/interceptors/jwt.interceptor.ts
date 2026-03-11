import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { AuthService } from '../auth/auth.service';
import { MatSnackBar } from '@angular/material/snack-bar';

@Injectable()
export class JwtInterceptor implements HttpInterceptor {

  constructor(private authService: AuthService, private snackBar: MatSnackBar) {}

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const token = this.authService.getToken();

    const authReq = token
      ? req.clone({ setHeaders: { Authorization: `Bearer ${token}` } })
      : req;

    return next.handle(authReq).pipe(
      catchError((error: HttpErrorResponse) => {
        if (error.status === 401) {
          // Don't auto-logout if we're on the login endpoint
          if (!req.url.includes('/auth/login')) {
            this.authService.logout();
          }
        } else if (error.status === 403) {
          this.snackBar.open('No tiene permisos para realizar esta acción', 'Cerrar', { duration: 4000 });
        } else if (error.status === 422) {
          const mensaje = error.error?.mensaje || 'Error de negocio';
          this.snackBar.open(mensaje, 'Cerrar', { duration: 5000 });
        } else if (error.status >= 500) {
          this.snackBar.open('Error interno del servidor. Intente de nuevo.', 'Cerrar', { duration: 5000 });
        }
        return throwError(() => error);
      })
    );
  }
}
