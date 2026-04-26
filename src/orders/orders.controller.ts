import { Controller, Get, Post, Body, UseGuards, Request, Headers } from '@nestjs/common';
import { OrdersService } from './orders.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('orders')
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  // 🔓 গেস্ট (Guest) এবং লগইন করা ইউজার উভয়েই অর্ডার করতে পারবে
  @Post()
  create(@Headers('authorization') authHeader: string, @Body() createOrderDto: CreateOrderDto) {
    let userId: string | undefined = undefined; // 👈 null এর বদলে undefined

    // যদি হেডারে টোকেন থাকে (লগইন করা ইউজার), তবে ডিকোড করে আইডি বের করে নেব
    if (authHeader && authHeader.startsWith('Bearer ')) {
      const token = authHeader.split(' ')[1];
      try {
        const payload = JSON.parse(Buffer.from(token.split('.')[1], 'base64').toString());
        userId = payload.id || payload.sub;
      } catch (error) {
        console.error("Invalid token during checkout, processing as Guest.");
      }
    }

    // গেস্ট হলে userId 'undefined' যাবে, আর লগইন করা থাকলে আসল আইডি যাবে
    return this.ordersService.create(userId, createOrderDto);
  }

  // 🔒 ইউজারের নিজের অর্ডার হিস্ট্রি
  @UseGuards(JwtAuthGuard)
  @Get('my-orders')
  findMyOrders(@Request() req: any) {
    return this.ordersService.findMyOrders(req.user.id);
  }
}