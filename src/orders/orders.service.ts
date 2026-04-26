import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { CreateOrderDto } from './dto/create-order.dto';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class OrdersService {
  constructor(private readonly prisma: PrismaService) {}

  // 🛠️ userId এখন string অথবা undefined হতে পারে
  async create(userId: string | undefined, createOrderDto: CreateOrderDto) {
    // ১. মোট দাম (Total Amount) হিসাব করা
    const totalAmount = createOrderDto.items.reduce((sum, item) => {
      return sum + (item.price * item.quantity);
    }, 0);

    try {
      // 💡 Prisma-র টাইপ এরর চিরতরে দূর করার জন্য ডাইনামিক অবজেক্ট (any type)
      const orderData: any = {
        totalAmount,
        orderItems: {
          create: createOrderDto.items.map(item => ({
            productId: item.productId,
            quantity: item.quantity,
            price: item.price,
          })),
        },
      };

      // 💡 যদি লগইন করা ইউজার (userId) থাকে, তবে ডাটাবেসে ইউজারের সাথে কানেক্ট করে দেব
      if (userId) {
        orderData.user = { connect: { id: userId } };
      }

      // ২. ডাটাবেসে অর্ডার সেভ করা
      const newOrder = await this.prisma.order.create({
        data: orderData,
        include: {
          orderItems: true, // রেসপন্সে আইটেমগুলোও দেখতে চাই
        },
      });

      return {
        message: userId ? 'Order placed successfully! 🛒🎉' : 'Guest Order placed successfully! 🛒🎉',
        order: newOrder,
      };
    } catch (error) {
      console.error("Order Creation Error:", error);
      throw new InternalServerErrorException('Failed to place order. Please check product IDs.');
    }
  }

  // ইউজারের নিজের অর্ডার হিস্ট্রি দেখার জন্য
  findMyOrders(userId: string) {
    return this.prisma.order.findMany({
      where: { userId },
      include: {
        orderItems: {
          include: { product: true } // কোন প্রোডাক্ট কিনেছে তার ডিটেইলস
        }
      },
      orderBy: { createdAt: 'desc' }
    });
  }
}