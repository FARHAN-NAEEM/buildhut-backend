import { CreateOrderDto } from './dto/create-order.dto';
import { PrismaService } from '../prisma/prisma.service';
export declare class OrdersService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    create(userId: string | undefined, createOrderDto: CreateOrderDto): Promise<{
        message: string;
        order: {
            orderItems: {
                id: string;
                price: number;
                productId: string;
                quantity: number;
                orderId: string;
            }[];
        } & {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            status: import("@prisma/client").$Enums.OrderStatus;
            userId: string | null;
            totalAmount: number;
        };
    }>;
    findMyOrders(userId: string): import("@prisma/client").Prisma.PrismaPromise<({
        orderItems: ({
            product: {
                name: string;
                id: string;
                createdAt: Date;
                updatedAt: Date;
                slug: string;
                status: import("@prisma/client").$Enums.ProductStatus;
                isFeatured: boolean;
                seoTitle: string | null;
                seoDescription: string | null;
                sku: string;
                productBadge: string | null;
                shortDescription: string | null;
                fullDescription: string | null;
                warranty: string | null;
                price: number;
                specialPrice: number | null;
                regularPrice: number | null;
                offerPrice: number | null;
                discountText: string | null;
                emiPrice: string | null;
                imageUrl: string | null;
                stockStatus: import("@prisma/client").$Enums.StockStatus;
                totalQuantity: number;
                isOffer: boolean;
                isNewArrival: boolean;
                isCompareEnabled: boolean;
                isWishlistEnabled: boolean;
                categoryId: string;
                brandId: string | null;
            };
        } & {
            id: string;
            price: number;
            productId: string;
            quantity: number;
            orderId: string;
        })[];
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        status: import("@prisma/client").$Enums.OrderStatus;
        userId: string | null;
        totalAmount: number;
    })[]>;
}
