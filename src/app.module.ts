import { Module } from '@nestjs/common';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { PrismaModule } from './prisma/prisma.module';
import { AppController } from './app.controller';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { CategoriesModule } from './categories/categories.module';
import { ProductsModule } from './products/products.module';
import { UploadModule } from './upload/upload.module';
import { OrdersModule } from './orders/orders.module';
import { PaymentModule } from './payment/payment.module';
import { BranchesModule } from './branches/branches.module';
import { BuilderModule } from './builder/builder.module';

@Module({
  imports: [
    // process.cwd() ব্যবহার করা হলো যাতে রুট ফোল্ডার নিয়ে কোনো কনফিউশন না হয়
    ServeStaticModule.forRoot({
      rootPath: join(process.cwd(), 'uploads'),
      serveRoot: '/uploads',
    }),
    PrismaModule,
    UsersModule,
    AuthModule,
    CategoriesModule,
    ProductsModule,
    UploadModule,
    OrdersModule,
    PaymentModule,
    BranchesModule,
    BuilderModule,
  ],
  controllers: [AppController],
  providers: [],
})
export class AppModule {}
