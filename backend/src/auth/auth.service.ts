import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcryptjs';
import { Usuario } from '../common/entities';
import { LoginRequest, AuthResponse } from './dto/auth.dto';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(Usuario)
    private readonly usuarioRepo: Repository<Usuario>,
    private readonly jwtService: JwtService,
  ) {}

  async login(request: LoginRequest): Promise<AuthResponse> {
    const usuario = await this.usuarioRepo.findOne({
      where: { email: request.email },
      relations: ['comunidad'],
    });

    if (!usuario || !usuario.activo) {
      throw new UnauthorizedException('Credenciales inválidas');
    }

    const isDev = process.env.NODE_ENV === 'dev' || process.env.PROFILE === 'dev';
    let passwordValid: boolean;

    if (isDev) {
      passwordValid = request.password === usuario.password;
    } else {
      passwordValid = await bcrypt.compare(request.password, usuario.password);
    }

    if (!passwordValid) {
      throw new UnauthorizedException('Credenciales inválidas');
    }

    const comunidad = await usuario.comunidad;
    const payload = {
      sub: usuario.email,
      comunidadId: comunidad.id,
      rol: usuario.rol,
    };

    const token = this.jwtService.sign(payload);

    return {
      token,
      email: usuario.email,
      nombre: `${usuario.nombre} ${usuario.apellido}`,
      rol: usuario.rol,
      comunidadId: comunidad.id,
      comunidadNombre: comunidad.nombre,
    };
  }
}
