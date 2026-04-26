import { BuilderType } from '@prisma/client';
import { BuilderService } from './builder.service';
export declare class BuilderController {
    private readonly builderService;
    constructor(builderService: BuilderService);
    components(type?: BuilderType): import("@prisma/client").Prisma.PrismaPromise<{
        name: string;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        slug: string;
        sortOrder: number;
        builderType: import("@prisma/client").$Enums.BuilderType;
        isRequired: boolean;
        allowMultiple: boolean;
    }[]>;
    products(componentType: string, type?: BuilderType, search?: string): import("@prisma/client").Prisma.PrismaPromise<({
        category: {
            name: string;
            id: string;
            createdAt: Date;
            updatedAt: Date;
            slug: string;
            iconUrl: string | null;
            image: string | null;
            level: number;
            sortOrder: number;
            status: import("@prisma/client").$Enums.CategoryStatus;
            isFeatured: boolean;
            seoTitle: string | null;
            seoDescription: string | null;
            parentId: string | null;
        };
        images: {
            id: string;
            sortOrder: number;
            imageUrl: string;
            productId: string;
            isPrimary: boolean;
        }[];
        componentMaps: {
            id: string;
            productId: string;
            builderType: import("@prisma/client").$Enums.BuilderType;
            componentType: string;
        }[];
        specMeta: {
            id: string;
            productId: string;
            value: string;
            key: string;
        }[];
    } & {
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
        discountText: string | null;
        emiPrice: string | null;
        imageUrl: string | null;
        stockStatus: import("@prisma/client").$Enums.StockStatus;
        totalQuantity: number;
        isCompareEnabled: boolean;
        isWishlistEnabled: boolean;
        categoryId: string;
        brandId: string | null;
    })[]>;
    validate(body: {
        type: BuilderType;
        items: {
            componentType: string;
            productId: string;
        }[];
    }): Promise<{
        valid: boolean;
        warnings: string[];
        totalPrice: number;
        totalPower: number;
        items: {
            componentType: string;
            productId: string;
        }[];
    }>;
    save(body: {
        type: BuilderType;
        userId?: string;
        items: {
            componentType: string;
            productId: string;
        }[];
    }): Promise<{
        items: ({
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
                discountText: string | null;
                emiPrice: string | null;
                imageUrl: string | null;
                stockStatus: import("@prisma/client").$Enums.StockStatus;
                totalQuantity: number;
                isCompareEnabled: boolean;
                isWishlistEnabled: boolean;
                categoryId: string;
                brandId: string | null;
            };
        } & {
            id: string;
            productId: string;
            componentType: string;
            buildId: string;
        })[];
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        userId: string | null;
        totalPrice: number;
        totalPower: number;
        shareCode: string;
    }>;
    share(shareCode: string, type?: BuilderType): Promise<{
        items: ({
            product: {
                images: {
                    id: string;
                    sortOrder: number;
                    imageUrl: string;
                    productId: string;
                    isPrimary: boolean;
                }[];
                specMeta: {
                    id: string;
                    productId: string;
                    value: string;
                    key: string;
                }[];
            } & {
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
                discountText: string | null;
                emiPrice: string | null;
                imageUrl: string | null;
                stockStatus: import("@prisma/client").$Enums.StockStatus;
                totalQuantity: number;
                isCompareEnabled: boolean;
                isWishlistEnabled: boolean;
                categoryId: string;
                brandId: string | null;
            };
        } & {
            id: string;
            productId: string;
            componentType: string;
            buildId: string;
        })[];
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        userId: string | null;
        totalPrice: number;
        totalPower: number;
        shareCode: string;
    }>;
}
