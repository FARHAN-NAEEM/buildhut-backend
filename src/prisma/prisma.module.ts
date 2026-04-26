import { Global, Module } from '@nestjs/common';
import { PrismaService } from './prisma.service';

@Global() // Global করার ফলে অন্য কোনো মডিউলে বারবার import করতে হবে না
@Module({
  providers: [PrismaService],
  exports: [PrismaService], // অন্য মডিউলগুলো যাতে PrismaService ব্যবহার করতে পারে
})
export class PrismaModule {}