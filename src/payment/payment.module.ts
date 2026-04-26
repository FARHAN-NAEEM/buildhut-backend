import { Module } from '@nestjs/common';
import { PaymentService } from './payment.service';
import { PaymentController } from './payment.controller';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [PrismaModule], // ডাটাবেস অ্যাক্সেস করার জন্য
  providers: [PaymentService],
  controllers: [PaymentController]
})
export class PaymentModule {}