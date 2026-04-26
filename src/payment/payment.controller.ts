import { Controller, Post, Param } from '@nestjs/common';
import { PaymentService } from './payment.service';

@Controller('payment')
export class PaymentController {
  constructor(private readonly paymentService: PaymentService) {}

  // ১. পেমেন্ট শুরু করার রাউট
  @Post('init/:orderId')
  initPayment(@Param('orderId') orderId: string) {
    return this.paymentService.initPayment(orderId);
  }

  // ২. SSLCommerz থেকে সাকসেস হলে এই রাউটে হিট আসবে
  @Post('success/:orderId')
  success(@Param('orderId') orderId: string) {
    return this.paymentService.paymentSuccess(orderId);
  }

  // ৩. পেমেন্ট ফেইল হলে
  @Post('fail/:orderId')
  fail(@Param('orderId') orderId: string) {
    return this.paymentService.paymentFail(orderId);
  }

  // ৪. ইউজার পেমেন্ট পেজ থেকে ব্যাক করলে
  @Post('cancel/:orderId')
  cancel(@Param('orderId') orderId: string) {
    return '<h1>Payment Cancelled</h1><p>You cancelled the payment.</p>';
  }
}