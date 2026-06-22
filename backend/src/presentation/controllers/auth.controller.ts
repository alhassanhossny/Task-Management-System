import { Controller, Post, Get, Body, Req, UseGuards, HttpCode } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { AuthService } from '../../infrastructure/auth/auth.service';
import { LoginDto, RefreshTokenDto } from '../../application/dtos/auth.dto';
import { Public } from '../guards/permissions.decorator';
import { JwtAuthGuard } from '../guards/jwt-auth.guard';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Public()
  @Post('login')
  @HttpCode(200)
  async login(@Body() loginDto: LoginDto, @Req() req: any) {
    const ipAddress = req.ip || req.connection?.remoteAddress;
    return this.authService.login(loginDto, ipAddress);
  }

  @Public()
  @Post('refresh')
  @HttpCode(200)
  async refresh(@Body() refreshTokenDto: RefreshTokenDto) {
    return this.authService.refreshToken(refreshTokenDto.refreshToken);
  }

  @UseGuards(JwtAuthGuard)
  @Post('logout')
  @HttpCode(200)
  async logout(@Req() req: any) {
    await this.authService.logout(req.user.id);
    return { message: 'Logged out successfully' };
  }

  @UseGuards(JwtAuthGuard)
  @Get('profile')
  async getProfile(@Req() req: any) {
    return this.authService.getProfile(req.user.id);
  }
}
