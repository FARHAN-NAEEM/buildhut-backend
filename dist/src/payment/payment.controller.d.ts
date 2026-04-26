import { PaymentService } from './payment.service';
export declare class PaymentController {
    private readonly paymentService;
    constructor(paymentService: PaymentService);
    initPayment(orderId: string): Promise<{
        url: any;
        message?: undefined;
        errorDetails?: undefined;
    } | {
        message: string;
        errorDetails: any;
        url?: undefined;
    }>;
    success(orderId: string): Promise<string>;
    fail(orderId: string): Promise<string>;
    cancel(orderId: string): string;
}
