import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor(private readonly prisma: PrismaService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(), // হেডারের Bearer টোকেন খুঁজবে
      ignoreExpiration: false, // টোকেনের মেয়াদ শেষ হলে ঢুকতে দেবে না
      secretOrKey: process.env.JWT_SECRET as string, // আমাদের সেই গোপন চাবি
    });
  }

  // টোকেন আসল হলে এই ফাংশনটি রান হবে
  async validate(payload: { sub: string; email: string; role: string }) {
    // ডাটাবেস থেকে ইউজারকে খুঁজে বের করি
    const user = await this.prisma.user.findUnique({
      where: { id: payload.sub },
    });

    if (!user) {
      throw new UnauthorizedException('User not found or token invalid');
    }

    // পাসওয়ার্ড বাদে বাকি সব ডেটা রিটার্ন করছি, যেটা রিকোয়েস্টের সাথে (req.user) জুড়ে যাবে
    const { passwordHash, ...userWithoutPassword } = user;
    return userWithoutPassword;
  }
}