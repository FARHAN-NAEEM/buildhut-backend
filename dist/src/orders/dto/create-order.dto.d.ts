declare class OrderItemDto {
    productId: string;
    quantity: number;
    price: number;
}
export declare class CreateOrderDto {
    items: OrderItemDto[];
}
export {};
