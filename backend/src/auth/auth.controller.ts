import { Controller, Post, Body } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { LoginRequest, AuthResponse } from './dto/auth.dto';

@ApiTags('Autenticación')
@Controller('api/v1/auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  @ApiOperation({ summary: 'Iniciar sesión y obtener token JWT' })
  async login(@Body() request: LoginRequest): Promise<AuthResponse> {
    return this.authService.login(request);
  }
}
