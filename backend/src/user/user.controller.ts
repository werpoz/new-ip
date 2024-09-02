import { Controller, Post, Body } from '@nestjs/common';
import { UserService } from './user.service';

import { ApiTags, ApiOperation, ApiResponse, ApiBody } from '@nestjs/swagger';
import { User } from '@prisma/client';
import { RegisterDto } from './dto/register.dto';
@ApiTags('user')
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post('register')
  @ApiOperation({ summary: 'Registrar un nuevo usuario' })
  @ApiResponse({ status: 201, description: 'Usuario registrado exitosamente' })
  @ApiResponse({ status: 400, description: 'Solicitud inválida' })
  @ApiBody({ type: RegisterDto })
  async register(@Body() registerDto: RegisterDto): Promise<User> {
    const { email, password } = registerDto;
    return this.userService.createUser(email, password);
  }
}
