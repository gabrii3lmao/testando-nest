import { Controller } from '@nestjs/common';
import { AuthService } from './auth.service';
import { HttpStatus, Get, Post, Body, HttpCode } from '@nestjs/common';
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) { }

  @Post('login')
  @HttpCode(200)
  SignIn
}
