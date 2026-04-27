import { OrdersService } from './orders.service';
import { CreateOrderDto } from './dto/create-order.dto';
export declare class OrdersController {
    private readonly ordersService;
    constructor(ordersService: OrdersService);
    create(authHeader: string, createOrderDto: CreateOrderDto): Promise<{
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
    findMyOrders(req: any): import("@prisma/client").Prisma.PrismaPromise<({
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
