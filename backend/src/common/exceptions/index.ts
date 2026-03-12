import { HttpException, HttpStatus } from '@nestjs/common';

export class ResourceNotFoundException extends HttpException {
  constructor(entidad: string, id?: number | string) {
    const message = id
      ? `${entidad} con id ${id} no encontrado`
      : entidad;
    super(message, HttpStatus.NOT_FOUND);
  }
}

export class BusinessException extends HttpException {
  constructor(mensaje: string) {
    super(mensaje, HttpStatus.UNPROCESSABLE_ENTITY);
  }
}
