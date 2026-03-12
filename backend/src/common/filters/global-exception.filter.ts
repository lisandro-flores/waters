import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
  BadRequestException,
} from '@nestjs/common';
import { Request, Response } from 'express';

@Catch()
export class GlobalExceptionFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost): void {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    if (exception instanceof BadRequestException) {
      const res = exception.getResponse() as any;
      const status = exception.getStatus();

      if (res.message && Array.isArray(res.message)) {
        const campos: Record<string, string> = {};
        for (const msg of res.message) {
          const parts = msg.split(' ');
          const campo = parts[0] || 'campo';
          campos[campo] = msg;
        }
        response.status(status).json({
          timestamp: new Date().toISOString(),
          status,
          error: 'Error de validación',
          campos,
          path: request.url,
        });
        return;
      }
    }

    if (exception instanceof HttpException) {
      const status = exception.getStatus();
      response.status(status).json({
        timestamp: new Date().toISOString(),
        status,
        error: HttpStatus[status] || 'Error',
        mensaje: exception.message,
        path: request.url,
      });
      return;
    }

    console.error(exception);
    response.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
      timestamp: new Date().toISOString(),
      status: HttpStatus.INTERNAL_SERVER_ERROR,
      error: 'Internal Server Error',
      mensaje:
        'Error interno del servidor: ' +
        (exception instanceof Error ? exception.message : String(exception)),
      path: request.url,
    });
  }
}
