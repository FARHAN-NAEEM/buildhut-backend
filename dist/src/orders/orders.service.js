"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.OrdersService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
let OrdersService = class OrdersService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async create(userId, createOrderDto) {
        const totalAmount = createOrderDto.items.reduce((sum, item) => {
            return sum + (item.price * item.quantity);
        }, 0);
        try {
            const orderData = {
                totalAmount,
                orderItems: {
                    create: createOrderDto.items.map(item => ({
                        productId: item.productId,
                        quantity: item.quantity,
                        price: item.price,
                    })),
                },
            };
            if (userId) {
                orderData.user = { connect: { id: userId } };
            }
            const newOrder = await this.prisma.order.create({
                data: orderData,
                include: {
                    orderItems: true,
                },
            });
            return {
                message: userId ? 'Order placed successfully! 🛒🎉' : 'Guest Order placed successfully! 🛒🎉',
                order: newOrder,
            };
        }
        catch (error) {
            console.error("Order Creation Error:", error);
            throw new common_1.InternalServerErrorException('Failed to place order. Please check product IDs.');
        }
    }
    findMyOrders(userId) {
        return this.prisma.order.findMany({
            where: { userId },
            include: {
                orderItems: {
                    include: { product: true }
                }
            },
            orderBy: { createdAt: 'desc' }
        });
    }
};
exports.OrdersService = OrdersService;
exports.OrdersService = OrdersService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], OrdersService);
//# sourceMappingURL=orders.service.js.map