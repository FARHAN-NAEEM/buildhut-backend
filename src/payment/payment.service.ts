import { Injectable, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import axios from 'axios';
import * as dotenv from 'dotenv';

dotenv.config();

@Injectable()
export class PaymentService {
  constructor(private readonly prisma: PrismaService) {}

  async initPayment(orderId: string) {
    const order = await this.prisma.order.findUnique({
      where: { id: orderId },
      include: { user: true },
    });

    if (!order) throw new BadRequestException('Order not found');

    // 🔥 Aamarpay প্রথমে ব্যাকএন্ডেই হিট করবে ডাটাবেস আপডেট করার জন্য
    const formData = {
      store_id: process.env.AAMARPAY_STORE_ID!, 
      signature_key: process.env.AAMARPAY_SIGNATURE_KEY!, 
      tran_id: order.id,
      success_url: `http://localhost:5000/payment/success/${order.id}`,
      fail_url: `http://localhost:5000/payment/fail/${order.id}`,
      cancel_url: `http://localhost:5000/payment/cancel/${order.id}`,
      amount: order.totalAmount,
      currency: 'BDT',
      desc: 'BuildHut Product Purchase',
      // 🛠️ এখানে Optional Chaining এবং Fallback যোগ করা হলো
      cus_name: order.user?.name || 'Guest User',
      cus_email: order.user?.email || 'guest@buildhut.com',
      cus_add1: 'Dhaka',
      cus_add2: 'Dhaka',
      cus_city: 'Dhaka',
      cus_state: 'Dhaka',
      cus_postcode: '1000',
      cus_country: 'Bangladesh',
      cus_phone: order.user?.phone || '01711000000',
      type: 'json'
    };

    try {
      const { data } = await axios.post(process.env.AAMARPAY_URL!, formData);
      
      if (data && data.result === 'true') {
        return { url: data.payment_url };
      } else {
        return {
          message: "⚠️ Aamarpay did not return a Gateway URL. Check error:",
          errorDetails: data
        };
      }
    } catch (error) {
      throw new BadRequestException('Payment initiation failed with Aamarpay');
    }
  }

  async paymentSuccess(orderId: string) {
    // ১. ডাটাবেসে অর্ডারের স্ট্যাটাস আপডেট হলো
    await this.prisma.order.update({
      where: { id: orderId },
      data: { status: 'PROCESSING' },
    });

    // ২. অটোমেটিক ফ্রন্টএন্ডের (৩০০০ পোর্ট) সাকসেস পেজে রিডাইরেক্ট করে দেওয়া হলো
    return `
      <html>
        <body>
          <script>
            window.location.href="http://localhost:3000/payment/success?tran_id=${orderId}";
          </script>
        </body>
      </html>
    `;
  }

  async paymentFail(orderId: string) {
    // ১. ডাটাবেসে অর্ডারের স্ট্যাটাস ক্যানসেলড করা হলো
    await this.prisma.order.update({
      where: { id: orderId },
      data: { status: 'CANCELLED' },
    });
    
    // ২. ফেইল পেজে রিডাইরেক্ট
    return `
      <html>
        <body>
          <script>
            window.location.href="http://localhost:3000/payment/fail";
          </script>
        </body>
      </html>
    `;
  }

  // যদি আপনার কন্ট্রোলারে cancel_url এর রাউট থাকে, তার জন্যও এটা দিয়ে রাখলাম
  async paymentCancel(orderId: string) {
    await this.prisma.order.update({
      where: { id: orderId },
      data: { status: 'CANCELLED' },
    });
    
    return `
      <html>
        <body>
          <script>
            window.location.href="http://localhost:3000/payment/fail";
          </script>
        </body>
      </html>
    `;
  }
}