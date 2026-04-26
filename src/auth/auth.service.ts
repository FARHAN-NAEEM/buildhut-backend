import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { JwtService } from '@nestjs/jwt';
import { LoginDto } from './dto/login.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService,
  ) {}

  async login(loginDto: LoginDto) {
    const { email, password } = loginDto;

    // ১. চেক করি ইমেইল দিয়ে কোনো ইউজার আছে কি না
    const user = await this.prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      throw new UnauthorizedException('Invalid email or password');
    }

    // ২. ইউজারের দেওয়া পাসওয়ার্ড আর ডাটাবেসের হ্যাশ পাসওয়ার্ড ম্যাচ করে কি না চেক করি
    const isPasswordValid = await bcrypt.compare(password, user.passwordHash);

    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid email or password');
    }

    // ৩. পাসওয়ার্ড মিলে গেলে টোকেনের ভেতর কী কী ডেটা রাখব সেটা সেট করি (Payload)
    const payload = { sub: user.id, email: user.email, role: user.role };

    // ৪. রেসপন্স থেকে পাসওয়ার্ড সরিয়ে দিচ্ছি
    const { passwordHash: _, ...userWithoutPassword } = user;

    return {
      message: 'Login successful! 🚀',
      accessToken: await this.jwtService.signAsync(payload),
      user: userWithoutPassword,
    };
  }
}