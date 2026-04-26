import { Injectable, ConflictException, InternalServerErrorException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { PrismaService } from '../prisma/prisma.service';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
  // PrismaService ইনজেক্ট করা হলো ডাটাবেস এক্সেসের জন্য
  constructor(private readonly prisma: PrismaService) {}

  async create(createUserDto: CreateUserDto) {
    const { name, email, phone, password } = createUserDto;

    // ১. চেক করি এই ইমেইল বা ফোন নম্বরে কোনো ইউজার আগে থেকেই আছে কি না
    const existingUser = await this.prisma.user.findFirst({
      where: {
        OR: [{ email }, { phone: phone || '' }],
      },
    });

    if (existingUser) {
      throw new ConflictException('User with this email or phone already exists!');
    }

    // ২. পাসওয়ার্ড এনক্রিপ্ট (হ্যাশ) করা
    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);

    try {
      // ৩. ডাটাবেসে নতুন ইউজার সেভ করা
      const newUser = await this.prisma.user.create({
        data: {
          name,
          email,
          phone,
          passwordHash,
        },
      });

      // সিকিউরিটির জন্য রেসপন্স থেকে পাসওয়ার্ডের হ্যাশ আলাদা করে দিচ্ছি (delete এর বদলে destructuring)
      const { passwordHash: _, ...userWithoutPassword } = newUser;

      return {
        message: 'User registered successfully! 🎉',
        user: userWithoutPassword,
      };
    } catch (error) {
      throw new InternalServerErrorException('Something went wrong while creating the user');
    }
  }

  findAll() {
    // সব ইউজারের লিস্ট রিটার্ন করবে (পাসওয়ার্ড ছাড়া)
    return this.prisma.user.findMany({
      select: { id: true, name: true, email: true, role: true, createdAt: true }
    });
  }

  findOne(id: string) {
    return this.prisma.user.findUnique({
      where: { id },
      select: { id: true, name: true, email: true, role: true, createdAt: true }
    });
  }

  update(id: string, updateUserDto: UpdateUserDto) {
    return `This action updates a #${id} user`;
  }

  remove(id: string) {
    return `This action removes a #${id} user`;
  }
}