import { PrismaService } from '../prisma/prisma.service';
export declare class PaymentService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    initPayment(orderId: string): Promise<{
        url: any;
        message?: undefined;
        errorDetails?: undefined;
    } | {
        message: string;
        errorDetails: any;
        url?: undefined;
    }>;
    paymentSuccess(orderId: string): Promise<string>;
    paymentFail(orderId: string): Promise<string>;
    paymentCancel(orderId: string): Promise<string>;
}
